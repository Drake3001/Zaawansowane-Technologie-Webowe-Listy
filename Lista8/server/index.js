const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const initializeSocket = require('./socket');

const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

/** MIME -> safe extension (never trust originalname) */
const ALLOWED_MIMES = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = ALLOWED_MIMES.get(file.mimetype) || '';
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('INVALID_MIME'));
  },
});

function handleMulterUpload(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (!err) {
      next();
      return;
    }
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ ok: false, error: 'File too large.' });
        return;
      }
      res.status(400).json({ ok: false, error: err.message });
      return;
    }
    if (err.message === 'INVALID_MIME') {
      res.status(400).json({ ok: false, error: 'Invalid file type.' });
      return;
    }
    res.status(400).json({ ok: false, error: 'Upload failed.' });
  });
}

app.post('/api/uploads', handleMulterUpload, (req, res) => {
  if (!req.file) {
    res.status(400).json({ ok: false, error: 'No file uploaded.' });
    return;
  }
  res.json({
    ok: true,
    url: `/uploads/${req.file.filename}`,
    contentType: req.file.mimetype,
  });
});

app.use('/uploads', express.static(uploadsDir));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// SPA fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Initialize Socket.IO handlers
initializeSocket(io);

server.listen(3000, () => {
  console.log('listening on *:3000');
});

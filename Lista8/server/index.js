const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const initializeSocket = require('./socket');

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

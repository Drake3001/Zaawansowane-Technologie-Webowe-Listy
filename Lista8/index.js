const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const ROOMS = ['general', 'tech', 'random'];
const MAX_NICK_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 300;
const HISTORY_LIMIT = 20;

const activeNicknames = new Set();
const roomHistory = new Map(ROOMS.map((room) => [room, []]));
const roomTyping = new Map(ROOMS.map((room) => [room, new Set()]));

function normalizeNick(rawNick) {
  if (typeof rawNick !== 'string') {
    return '';
  }

  return rawNick.trim().slice(0, MAX_NICK_LENGTH);
}

function normalizeMessage(rawMessage) {
  if (typeof rawMessage !== 'string') {
    return '';
  }

  return rawMessage.trim().slice(0, MAX_MESSAGE_LENGTH);
}

function storeMessage(room, message) {
  const history = roomHistory.get(room);
  if (!history) {
    return;
  }

  history.push(message);
  if (history.length > HISTORY_LIMIT) {
    history.shift();
  }
}

function emitError(socket, message) {
  socket.emit('error_message', message);
}

function updateTypingState(room, nick, isTyping) {
  const typingUsers = roomTyping.get(room);

  if (!typingUsers || !nick) {
    return;
  }

  if (isTyping) {
    typingUsers.add(nick);
  } else {
    typingUsers.delete(nick);
  }

  io.to(room).emit('typing_state', {
    room,
    users: Array.from(typingUsers)
  });
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.data.nick = null;
  socket.data.room = null;

  socket.emit('rooms_list', ROOMS);

  socket.on('set_nick', (rawNick, callback) => {
    const nick = normalizeNick(rawNick);

    if (!nick) {
      const message = 'Nick is required.';
      emitError(socket, message);
      if (callback) callback({ ok: false, message });
      return;
    }

    if (!/^[A-Za-z0-9_]+$/.test(nick)) {
      const message = 'Nick can contain only letters, numbers, and underscore.';
      emitError(socket, message);
      if (callback) callback({ ok: false, message });
      return;
    }

    if (socket.data.nick !== nick && activeNicknames.has(nick)) {
      const message = 'This nick is already taken.';
      emitError(socket, message);
      if (callback) callback({ ok: false, message });
      return;
    }

    if (socket.data.nick && socket.data.nick !== nick) {
      activeNicknames.delete(socket.data.nick);
    }

    socket.data.nick = nick;
    activeNicknames.add(nick);

    if (callback) callback({ ok: true, nick });
  });

  socket.on('join_room', (rawRoom, callback) => {
    const room = typeof rawRoom === 'string' ? rawRoom.trim() : '';

    if (!socket.data.nick) {
      const message = 'Set your nick before joining a room.';
      emitError(socket, message);
      if (callback) callback({ ok: false, message });
      return;
    }

    if (!ROOMS.includes(room)) {
      const message = 'Selected room is not available.';
      emitError(socket, message);
      if (callback) callback({ ok: false, message });
      return;
    }

    const previousRoom = socket.data.room;
    if (previousRoom && previousRoom !== room) {
      socket.leave(previousRoom);
      io.to(previousRoom).emit('system_message', `${socket.data.nick} left the room.`);
    }

    socket.join(room);
    socket.data.room = room;

    io.to(room).emit('system_message', `${socket.data.nick} joined the room.`);

    if (callback) {
      callback({
        ok: true,
        room,
        history: roomHistory.get(room) || []
      });
    }
  });

  socket.on('leave_room', (callback) => {
    const room = socket.data.room;

    if (!room) {
      if (callback) callback({ ok: true, room: null });
      return;
    }

    updateTypingState(room, socket.data.nick, false);

    socket.leave(room);
    socket.data.room = null;

    if (socket.data.nick) {
      io.to(room).emit('system_message', `${socket.data.nick} left the room.`);
    }

    if (callback) callback({ ok: true, room });
  });

  socket.on('chat_message', (rawMessage, callback) => {
    if (!socket.data.nick || !socket.data.room) {
      const message = 'Join a room before sending messages.';
      emitError(socket, message);
      if (callback) callback({ ok: false, message });
      return;
    }

    const text = normalizeMessage(rawMessage);
    if (!text) {
      const message = 'Message cannot be empty.';
      if (callback) callback({ ok: false, message });
      return;
    }

    const payload = {
      nick: socket.data.nick,
      text,
      createdAt: Date.now()
    };

    updateTypingState(socket.data.room, socket.data.nick, false);
    storeMessage(socket.data.room, payload);
    io.to(socket.data.room).emit('chat_message', payload);

    if (callback) callback({ ok: true });
  });

  socket.on('typing_state', (isTyping) => {
    if (!socket.data.nick || !socket.data.room) {
      return;
    }

    updateTypingState(socket.data.room, socket.data.nick, Boolean(isTyping));
  });

  socket.on('disconnect', () => {
    if (socket.data.room && socket.data.nick) {
      updateTypingState(socket.data.room, socket.data.nick, false);
      io.to(socket.data.room).emit('system_message', `${socket.data.nick} left the room.`);
    }

    if (socket.data.nick) {
      activeNicknames.delete(socket.data.nick);
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});


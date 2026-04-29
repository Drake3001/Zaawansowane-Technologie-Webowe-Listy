var socket = io();

var nick = '';
var currentRoom = '';
var availableRooms = [];
var typingUsers = new Set();
var typingEmitTimer = null;
var typingIsActive = false;

var lobby = document.getElementById('lobby');
var chat = document.getElementById('chat');
var status = document.getElementById('status');
var typingIndicator = document.getElementById('typingIndicator');
var error = document.getElementById('error');
var nickInput = document.getElementById('nickInput');
var roomSelect = document.getElementById('roomSelect');
var joinBtn = document.getElementById('joinBtn');
var leaveBtn = document.getElementById('leaveBtn');
var messages = document.getElementById('messages');
var chatForm = document.getElementById('chatForm');
var chatInput = document.getElementById('chatInput');

function setError(message) {
  error.textContent = message || '';
}

function stopTyping() {
  if (typingEmitTimer) {
    clearTimeout(typingEmitTimer);
    typingEmitTimer = null;
  }

  if (typingIsActive) {
    typingIsActive = false;
    socket.emit('typing_state', false);
  }
}

function notifyTyping() {
  if (!currentRoom) {
    return;
  }

  if (!typingIsActive) {
    typingIsActive = true;
    socket.emit('typing_state', true);
  }

  if (typingEmitTimer) {
    clearTimeout(typingEmitTimer);
  }

  typingEmitTimer = setTimeout(function() {
    stopTyping();
  }, 1200);
}

joinBtn.addEventListener('click', function() {
  var desiredNick = nickInput.value.trim();
  var desiredRoom = roomSelect.value;

  if (!desiredNick) {
    setError('Nick is required.');
    return;
  }

  if (!desiredRoom) {
    setError('Choose a room.');
    return;
  }

  socket.emit('set_nick', desiredNick, function(nickResult) {
    if (!nickResult || !nickResult.ok) {
      setError((nickResult && nickResult.message) || 'Cannot set nick.');
      return;
    }

    nick = nickResult.nick;

    socket.emit('join_room', desiredRoom, function(roomResult) {
      if (!roomResult || !roomResult.ok) {
        setError((roomResult && roomResult.message) || 'Cannot join room.');
        return;
      }

      setError('');
      currentRoom = roomResult.room;
      typingUsers.clear();
      showChat(roomResult.room, roomResult.history || [], nick, lobby, chat, status, typingIndicator, messages);
    });
  });
});

leaveBtn.addEventListener('click', function() {
  socket.emit('leave_room', function(result) {
    if (!result || !result.ok) {
      setError('Could not leave the room.');
      return;
    }

    currentRoom = '';
    typingUsers.clear();
    showLobby(lobby, chat, status, typingIndicator);
  });
});

chatForm.addEventListener('submit', function(e) {
  e.preventDefault();

  var text = chatInput.value.trim();
  if (!text) {
    return;
  }

  socket.emit('chat_message', text, function(result) {
    if (!result || !result.ok) {
      setError((result && result.message) || 'Message failed to send.');
      return;
    }

    setError('');
    chatInput.value = '';
    stopTyping();
    chatInput.focus();
  });
});

chatInput.addEventListener('input', function() {
  if (!chatInput.value.trim()) {
    stopTyping();
    return;
  }

  notifyTyping();
});

chatInput.addEventListener('blur', function() {
  stopTyping();
});

socket.on('rooms_list', function(rooms) {
  availableRooms = Array.isArray(rooms) ? rooms : [];
  renderRoomOptions(availableRooms, roomSelect);
});

socket.on('chat_message', function(payload) {
  appendChatMessage(payload, nick, messages);
});

socket.on('system_message', function(message) {
  appendSystemMessage(message, messages);
});

socket.on('typing_state', function(payload) {
  if (!payload || payload.room !== currentRoom) {
    return;
  }

  typingUsers = new Set(Array.isArray(payload.users) ? payload.users : []);
  setTypingIndicator(typingUsers, nick, typingIndicator);
});

socket.on('error_message', function(message) {
  setError(message);
});

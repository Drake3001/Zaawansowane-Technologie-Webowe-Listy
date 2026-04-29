function renderRoomOptions(availableRooms, roomSelect) {
  roomSelect.innerHTML = '';
  for (var i = 0; i < availableRooms.length; i += 1) {
    var option = document.createElement('option');
    option.value = availableRooms[i];
    option.textContent = availableRooms[i];
    roomSelect.appendChild(option);
  }
}

function appendChatMessage(data, nick, messages) {
  var isSelf = data.nick === nick;
  var item = document.createElement('li');
  var bubble = document.createElement('div');
  var meta = document.createElement('div');
  var nickLabel = document.createElement('span');
  var timeLabel = document.createElement('span');
  var text = document.createElement('div');
  var timestamp = data.createdAt ? new Date(data.createdAt) : new Date();

  item.className = 'message-row ' + (isSelf ? 'self' : 'other');
  bubble.className = 'bubble';
  meta.className = 'bubble-meta';
  nickLabel.className = 'bubble-nick';
  timeLabel.className = 'bubble-time';
  text.className = 'bubble-text';

  nickLabel.textContent = data.nick;
  timeLabel.textContent = timestamp.toLocaleString();
  text.textContent = data.text;

  meta.appendChild(nickLabel);
  meta.appendChild(timeLabel);
  bubble.appendChild(meta);
  bubble.appendChild(text);
  item.appendChild(bubble);
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

function appendSystemMessage(text, messages) {
  var item = document.createElement('li');
  item.className = 'system';
  item.textContent = text;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

function setTypingIndicator(typingUsers, nick, typingIndicator) {
  var users = Array.from(typingUsers).filter(function(user) {
    return user !== nick;
  });

  if (!users.length) {
    typingIndicator.textContent = '';
    return;
  }

  if (users.length === 1) {
    typingIndicator.textContent = users[0] + ' is typing...';
    return;
  }

  typingIndicator.textContent = users.slice(0, -1).join(', ') + ' and ' + users[users.length - 1] + ' are typing...';
}

function renderHistory(history, nick, messages) {
  messages.innerHTML = '';
  for (var i = 0; i < history.length; i += 1) {
    appendChatMessage(history[i], nick, messages);
  }
}

function showLobby(lobby, chat, status, typingIndicator) {
  status.textContent = '';
  typingIndicator.textContent = '';
  lobby.classList.remove('hidden');
  chat.classList.add('hidden');
}

function showChat(room, history, nick, lobby, chat, status, typingIndicator, messages) {
  status.textContent = 'Nick: ' + nick + ' | Room: ' + room;
  typingIndicator.textContent = '';
  lobby.classList.add('hidden');
  chat.classList.remove('hidden');
  renderHistory(history || [], nick, messages);
  var chatInput = document.getElementById('chatInput');
  if (chatInput) chatInput.focus();
}

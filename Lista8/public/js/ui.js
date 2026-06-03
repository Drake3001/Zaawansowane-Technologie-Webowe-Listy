function renderRoomOptions(availableRooms, roomSelect) {
  roomSelect.innerHTML = '';
  for (var i = 0; i < availableRooms.length; i += 1) {
    var option = document.createElement('option');
    option.value = availableRooms[i];
    option.textContent = availableRooms[i];
    roomSelect.appendChild(option);
  }
}

function appendFormattedPlainText(container, rawText) {
  var s = typeof rawText === 'string' ? rawText : '';
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  if (!s) {
    return;
  }

  function appendTextSlice(from, to) {
    if (from >= to) {
      return;
    }
    container.appendChild(document.createTextNode(s.slice(from, to)));
  }

  function appendSpan(className, innerFrom, innerTo) {
    var span = document.createElement('span');
    span.className = className;
    span.appendChild(document.createTextNode(s.slice(innerFrom, innerTo)));
    container.appendChild(span);
  }

  function findNextItalicOpen(start) {
    var k = start;
    while (k < s.length) {
      if (s[k] !== '*') {
        k += 1;
        continue;
      }
      if (k + 1 < s.length && s[k + 1] === '*') {
        k += 2;
        continue;
      }
      return k;
    }
    return -1;
  }

  function findNextItalicClose(openPos) {
    var j;
    for (j = openPos + 1; j < s.length; j += 1) {
      if (s[j] !== '*') {
        continue;
      }
      if (j + 1 < s.length && s[j + 1] === '*') {
        j += 1;
        continue;
      }
      return j;
    }
    return -1;
  }

  var i = 0;
  while (i < s.length) {
    var idxBold = s.indexOf('**', i);
    var idxUnder = s.indexOf('__', i);
    var idxItalic = findNextItalicOpen(i);

    var candidates = [];
    if (idxBold >= 0) {
      candidates.push({ pos: idxBold, kind: 'bold' });
    }
    if (idxUnder >= 0) {
      candidates.push({ pos: idxUnder, kind: 'under' });
    }
    if (idxItalic >= 0) {
      candidates.push({ pos: idxItalic, kind: 'italic' });
    }

    if (!candidates.length) {
      appendTextSlice(i, s.length);
      break;
    }

    candidates.sort(function(a, b) {
      if (a.pos !== b.pos) {
        return a.pos - b.pos;
      }
      var lenA = a.kind === 'italic' ? 1 : 2;
      var lenB = b.kind === 'italic' ? 1 : 2;
      return lenB - lenA;
    });

    var pick = candidates[0];
    appendTextSlice(i, pick.pos);

    if (pick.kind === 'bold') {
      var closeB = s.indexOf('**', pick.pos + 2);
      if (closeB === -1 || closeB === pick.pos + 2) {
        appendTextSlice(pick.pos, pick.pos + 2);
        i = pick.pos + 2;
        continue;
      }
      appendSpan('fmt-bold', pick.pos + 2, closeB);
      i = closeB + 2;
      continue;
    }

    if (pick.kind === 'under') {
      var closeU = s.indexOf('__', pick.pos + 2);
      if (closeU === -1 || closeU === pick.pos + 2) {
        appendTextSlice(pick.pos, pick.pos + 2);
        i = pick.pos + 2;
        continue;
      }
      appendSpan('fmt-underline', pick.pos + 2, closeU);
      i = closeU + 2;
      continue;
    }

    if (pick.kind === 'italic') {
      var closeI = findNextItalicClose(pick.pos);
      if (closeI === -1 || closeI === pick.pos + 1) {
        appendTextSlice(pick.pos, pick.pos + 1);
        i = pick.pos + 1;
        continue;
      }
      appendSpan('fmt-italic', pick.pos + 1, closeI);
      i = closeI + 1;
      continue;
    }
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

  meta.appendChild(nickLabel);
  meta.appendChild(timeLabel);
  bubble.appendChild(meta);

  if (data.type === 'image' && data.url) {
    var wrapper = document.createElement('div');
    wrapper.className = 'bubble-image';
    var img = document.createElement('img');
    img.src = data.url;
    img.alt = 'Shared image';
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';
    var fallback = document.createElement('div');
    fallback.className = 'bubble-image-fallback';
    fallback.textContent = 'Could not load image.';
    fallback.hidden = true;
    img.addEventListener('error', function() {
      img.hidden = true;
      fallback.hidden = false;
    });
    wrapper.appendChild(img);
    wrapper.appendChild(fallback);
    bubble.appendChild(wrapper);
  } else {
    appendFormattedPlainText(text, data.text || '');
    bubble.appendChild(text);
  }

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

const ROOMS = ['general', 'tech', 'random'];
const roomTyping = new Map(ROOMS.map((room) => [room, new Set()]));

function updateTypingState(io, room, nick, isTyping) {
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

module.exports = {
  updateTypingState
};

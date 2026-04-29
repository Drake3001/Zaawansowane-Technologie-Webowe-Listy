const ROOMS = ['general', 'tech', 'random'];
const HISTORY_LIMIT = 20;
const roomHistory = new Map(ROOMS.map((room) => [room, []]));

/** Text: { nick, text, createdAt } | Image: { nick, type: 'image', url, createdAt } */
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

function getHistory(room) {
  return roomHistory.get(room) || [];
}

module.exports = {
  storeMessage,
  getHistory
};

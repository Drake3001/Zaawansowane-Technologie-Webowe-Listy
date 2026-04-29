const ROOMS = ['general', 'tech', 'random'];

function getRooms() {
  return ROOMS;
}

function isValidRoom(room) {
  return ROOMS.includes(room);
}

module.exports = {
  getRooms,
  isValidRoom
};

module.exports = Room

/**
 * Room
 *
 * @param {Number} id
 * @returns {Room}
 */

function Room (id) {
  this.clients = []
  this.id = id
}

/**
 * Notify all clients in a room
 *
 * @param {String} msg
 */

Room.prototype.notify = function (msg) {
  this.clients.forEach(function (client) {
    client.write(msg)
  })
}

/**
 * Add a client to the room
 *
 * @param {Stream} client
 */

Room.prototype.join = function (client) {
  this.clients.push(client)
}

/**
 * Remove a client from the room
 *
 * @param {Stream} client
 */

Room.prototype.leave = function (client) {
  var idx = this.clients.indexOf(client)
  this.clients.splice(idx, 1)
}

/**
 * Check if the room is empty
 *
 * @returns {Boolean} empty
 */

Room.prototype.empty = function () {
  return !! this.clients.length
}

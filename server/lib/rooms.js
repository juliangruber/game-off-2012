/**
 * Module dependencies
 */

var Room = require('./room')
var timestamp = require('monotonic-timestamp')
var pick = require('deck').pick
var Emitter = require('events').EventEmitter

/**
 * Room
 *
 * @returns {Rooms}
 */

function Rooms () {
  if (!(this instanceof Rooms)) return new Rooms()

  Emitter.call(this)

  this.rooms = {}
  this.open = []
}

Rooms.prototype = new Emitter

/**
 * Join a room
 *
 * @param {Stream} client
 * @returns {Function} leave
 */

Rooms.prototype.join = function (client) {
  var room = this.match()

  room.notify('player joined')
  room.join(client)
  this.emit('joined', room)

  return this.leave.bind(this, room, client)
}

/**
 * Leave a room
 *
 * @param {Room} room
 * @param {Stream} client
 */

Rooms.prototype.leave = function (room, client) {
  room.leave(client)
  room.notify('player left')
  this.emit('left', room)

  if (room.empty()) return delete this.rooms[room.id]
  this.open.push(room.id)
}

/**
 * Find a fitting room
 *
 * @returns {Room} match
 */

Rooms.prototype.match = function () {
  var rooms = this.rooms
  var open = this.open
  var room, id

  if (Object.keys(rooms).length == 0 || !open.length) {
    id = timestamp()
    room = rooms[id] = new Room(id)
    open.push(id)
  } else {
    id = pick(open)
    room = rooms[id]
    open.splice(open.indexOf(id), 1)
  }

  return room
}

/**
 * Exose `Rooms`
 */

module.exports = Rooms

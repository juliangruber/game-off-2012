/**
 * Module dependencies
 */

var emitStream = require('emit-stream')
var JSONStream = require('JSONStream')

/**
 * Room
 *
 * @param {Number} id
 * @returns {Room}
 */

function Room (id) {
  this.members = []
  this.id = id
}

/**
 * Notify all members in a room
 *
 * @param {String} msg
 */

Room.prototype.notify = function (msg) {
  return
  this.members.forEach(function (member) {
    member.write(msg)
  })
}

/**
 * Add a member to the room
 *
 * @param {Stream} member
 */

Room.prototype.join = function (member) {
  this.members.forEach(function (_member) {
    _member.pipe(member).pipe(_member)
  })
  this.members.push(member)
}

/**
 * Remove a member from the room
 *
 * @param {Stream} member
 */

Room.prototype.leave = function (member) {
  var idx = this.members.indexOf(member)
  this.members.splice(idx, 1)
}

/**
 * Check if the room is empty
 *
 * @returns {Boolean} empty
 */

Room.prototype.empty = function () {
  return !this.members.length
}

module.exports = Room

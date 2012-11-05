module.exports = Room

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

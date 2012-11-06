var Emitter = require('emitter')
var inherit = require('inherit')

var Point = require('./point')
var key = require('./util').key

/**
 * Player
 */

var Player = function () {
  if (!(this instanceof Player)) return new Player()

  Emitter.call(this)

  this.name('anonymous')
  this.point = new Point(this.x, this.y)
  this.id = Math.random().toString(16).slice(2)
  this.last = ''
}

inherit(Player, Emitter)

Player.prototype.name = function (name) {
  if (!name) return this._name
  this._name = name
  return this
}

Player.prototype.move = function (x, y) {
  this.x = x
  this.y = y
  return this
}

Player.prototype.captureKeys = function () {
  key(['up', 'w'], this, 'up')
  key(['down', 's'], this, 'down')
  key(['left', 'a'], this, 'left')
  key(['right', 'd'], this, 'right')
  key('space', this, 'push')
  return this
}

Player.prototype.update = function () {
  if (this.up) this.y -= 1
  if (this.down) this.y += 1
  if (this.left) this.x -= 1
  if (this.right) this.x += 1
  if (this.push) {}

  this.bounce()

  var state = this.toString()
  if (this.last == state) return

  this.last = state
  this.emit('update', {
    x : this.x,
    y : this.y,
    push : this.push
  })
}

Player.prototype.toString = function () {
  return [
    this._name,
    this.x,
    this.y,
    this.push  
  ].join('|')
}

Player.prototype.draw = function (ctx) {
  this.point.x = this.x
  this.point.y = this.y
  this.point.draw(ctx, { fill : true })
}

Player.prototype.bounce = function () {
  ['y', 'x'].forEach(function (cord) {
    if (this[cord] < 0) return this[cord] = 0
    if (this[cord] > 100) return this[cord] = 100
  }.bind(this))
}

module.exports = Player

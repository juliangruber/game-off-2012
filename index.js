/**
 * Module dependencies
 */

var raf = require('raf')
var Vector = require('vector')
var inherit = require('inherit')
var mousetrap = require('mousetrap')
var autoscale = require('autoscale-canvas')
var shoe = require('shoe')

/**
 * Bootstrap
 */

window.addEventListener('load', function () {
  new Game(document.getElementById('canvas'))
})

/**
 * Game
 */

var Game = function (canvas) {
  this.canvas = canvas
  this.ctx = canvas.getContext('2d')

  autoscale(canvas)
  fullscreen(canvas)

  var net = new Net();

  // x and y in %
  this.players = [new Player('julian')]
  this.points = []

  for (var i = 1; i < 10; i++) {
    this.points.push(new Point(50, i * 10))
  }

  this.push = new Push(this.players, this.points)

  this.loop()
}

Game.prototype.loop = function () {
  var self = this

  var iv = setInterval(this.update.bind(this), 16.7)

  function draw() {
    raf(draw)
    self.draw()
  }

  draw()
}

Game.prototype.draw = function () {
  var ctx = this.ctx

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
 
  this.points.forEach(function (point) { point.draw(ctx) })
  this.players.forEach(function (player) { player.draw(ctx) })
}

Game.prototype.update = function () {
  this.points.forEach(function (point) { point.update() })
  this.players.forEach(function (player) { player.update() })
  this.push.update()
}

/**
 * Point
 */

var Point = function (x, y) {
  Vector.call(this, x, y)
}

inherit(Point, Vector)

Point.prototype.draw = function (ctx, opts) {
  if (!opts) opts = {}
  var ratio = window.devicePixelRatio || 1
  var width = ctx.canvas.width / ratio
  var height = ctx.canvas.height / ratio

  var x = width * this.x / 100
  var y = height * this.y / 100

  ctx.beginPath()   
  ctx.arc(x, y, 5, 0, 2 * Math.PI)
  
  if (opts.fill) return ctx.fill()
  ctx.stroke()
}

Point.prototype.update = function () { }

/**
 * Player
 */

var Player = function (name) {
  this.name = name
  Point.call(this, 0, 50)

  key(['up', 'w'], this, 'up')
  key(['down', 's'], this, 'down')
  key('space', this, 'push')
}

inherit(Player, Point)

Player.prototype.update = function () {
  if (this.up) this.y -= 1
  if (this.down) this.y += 1
  if (this.push) {}

  this.bounce()
}

Player.prototype.draw = function (ctx) {
  Point.prototype.draw.call(this, ctx, { fill : true })
}

Player.prototype.bounce = function () {
  ['y', 'x'].forEach(function (cord) {
    if (this[cord] < 0) return this[cord] = 0
    if (this[cord] > 100) return this[cord] = 100
  }.bind(this))
}

/**
 * Push
 */

var Push = function (players, points) {
  this.players = players
  this.points = points
}

Push.prototype.draw = function () {}

Push.prototype.update = function () {
  var players = this.players
  var points = this.points

  players.forEach(function (player) {
    if (!player.push) return

    points.forEach(function (point) {
      if (Math.abs(point.y - player.y) > 10) return
      point.x += 1 / point.distance(player) * 10
    })
  })

  points.forEach(function (point) {
    if (point.x < 50) point.x += 0.025
    if (point.x > 50) point.x -= 0.025
  })
}

var Net = function () {
  var stream = shoe('/stream')
}

/**
 * Utility functions
 */

function key (keys, obj, prop) {
  mousetrap.bind(keys, function () { obj[prop] = true }, 'keydown')
  mousetrap.bind(keys, function () { obj[prop] = false }, 'keyup')
}

function fullscreen (canvas) {
  document.body.style.margin = 0
  document.body.style.overflow = 'hidden'

  window.addEventListener('resize', scale)
  scale()

  function scale () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
}

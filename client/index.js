/**
 * Module dependencies
 */

var raf = require('raf')
var Vector = require('vector')
var inherit = require('inherit')
var autoscale = require('autoscale-canvas')
var shoe = require('shoe')
var Emitter = require('emitter')
var emitStream = require('emit-stream')
var JSONStream = require('JSONStream')
var through = require('through')

var Player = require('./lib/player')
var Point = require('./lib/point')
var util = require('./lib/util')

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
  util.fullscreen(canvas)

  this.players = [
    Player().move(0, 50).name('julian').captureKeys(),
    /*Player().move(100, 50)*/
    Bot()
  ]
  this.points = []

  var numPoints = 300
  for (var i = 1; i < numPoints; i++) {
    this.points.push(new Point(50, i * 100/numPoints))
  }

  this.push = new Push(this.players, this.points)
  this.net = new Net(this.players);

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

  players.forEach(function (player, pid) {
    if (!player.push) return

    points.forEach(function (point) {
      var dir = player.x - point.x > 0
        ? -1
        : 1

      dir = pid == 0
        ? 1
        : -1

      // if (Math.abs(point.y - player.y) > 10) return
      point.x += dir * 1 / point.distance(player) * 3
    })
  })

  points.forEach(function (point) {
    if (point.x < 50) point.x += 0.025
    if (point.x > 50) point.x -= 0.025
  })
}

/**
 * Networking
 */

var Net = function (players) {
  var stream = shoe('/stream')
  stream.on('data', console.log.bind(console))

  emitStream(players[0])
    .pipe(JSONStream.stringify())
    .pipe(stream)

  var foe = emitStream(stream.pipe(JSONStream.parse([true])))
  
  foe.on('update', function (state) {
    players[1].x = 100 - state.x
    players[1].y = state.y
    players[1].push = state.push
  })
}

/**
 * Bot
 */

var Bot = function () {
  if (!(this instanceof Bot)) return new Bot()

  Player.call(this)

  this.name('bot')
  this.move(100, 50)
  this.toGo = 0
  this.up = true
  this.left = false
}

inherit(Bot, Player)

Bot.prototype.update = function () {
  if (this.toGo <= 0) {
    this.toGo = Math.round(Math.random() * 30)
    this.up = Math.random() > 0.5
    this.left = Math.random() > 0.5
  }

  this.y += this.up? 1 : -1
  this.x += this.left? -1 : 1
  this.push = Math.random() > 0.5
  this.toGo-- 

  this.bounce()

  if (this.y <= 0) this.up = true
  if (this.y >= 100) this.up = false
  if (this.x <= 50) this.left = false
  if (this.x >= 100) this.left = true
}

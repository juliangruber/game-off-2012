var Vector = require('vector')
var inherit = require('inherit')

/**
 * Point
 */

var Point = function (x, y) {
  Vector.call(this, x, y)

  this.diameter(5)
}

inherit(Point, Vector)

Point.prototype.draw = function (ctx, opts) {
  if (!opts) opts = {}
  var ratio = window.devicePixelRatio || 1
  var width = ctx.canvas.width / ratio
  var height = ctx.canvas.height / ratio
  var diameter = this._diameter

  var x = width * this.x / 100
  var y = height * this.y / 100

  ctx.beginPath()   
  ctx.arc(x, y, diameter, 0, 2 * Math.PI)
  
  if (opts.fill) return ctx.fill()
  ctx.stroke()
}

Point.prototype.diameter = function (diameter) {
  if (!arguments.length) return this._diameter
  this._diameter = diameter
  return this
}

Point.prototype.update = function () { }

module.exports = Point

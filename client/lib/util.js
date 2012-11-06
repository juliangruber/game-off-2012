var mousetrap = require('mousetrap')

var util = {}

util.key = function (keys, obj, prop) {
  mousetrap.bind(keys, function () { obj[prop] = true }, 'keydown')
  mousetrap.bind(keys, function () { obj[prop] = false }, 'keyup')
}

util.fullscreen = function (canvas) {
  document.body.style.margin = 0
  document.body.style.overflow = 'hidden'

  window.addEventListener('resize', scale)
  scale()

  function scale () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
}

module.exports = util

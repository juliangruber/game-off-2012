var http = require('http')
var shoe = require('shoe')
var Rooms = require('./lib/rooms')

var rooms = Rooms()

/**
 * Http Server
 */

var ecstatic = require('ecstatic')(__dirname + '/../client')
var server = http.createServer(ecstatic)
server.listen(3000)

/**
 * Socket Server
 */
var sock = shoe(function (client) {
  client.on('data', console.log)

  var leave = rooms.join(client)
  client.on('end', leave)
})

sock.install(server, '/stream')

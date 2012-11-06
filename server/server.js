var http = require('http')
var shoe = require('shoe')
var Rooms = require('./lib/rooms')
var emitStream = require('emit-stream')
var JSONStream = require('JSONStream')

var rooms = Rooms()
rooms.on('joined', function (room) {
  console.log('join : room ' + room.id + ', members: ' + room.members.length)
})
rooms.on('left', function (room) {
  console.log('left : room ' + room.id + ', members: ' + room.members.length)
})

/**
 * Http Server
 */

var port = 3000 || process.argv[2]
var ecstatic = require('ecstatic')(__dirname + '/../client')
var server = http.createServer(ecstatic)
server.listen(port)

/**
 * Socket Server
 */

var sock = shoe(function (client) {
  var parsed = client.pipe(JSONStream.parse([true]))
  var events = emitStream(parsed)

  var leave = rooms.join(client)
  client.on('end', leave)
})

sock.install(server, '/stream')

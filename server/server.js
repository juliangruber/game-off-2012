var http = require('http')
var shoe = require('shoe')

var ecstatic = require('ecstatic')(__dirname + '/../client')

var server = http.createServer(ecstatic)
server.listen(3000)

var clients = []

var sock = shoe(function (client) {
  notify('client connected')
  client.on('end', notify.bind(this, 'client disconnected'))

  client.on('data', console.log)

  clients.push(client)
})

sock.install(server, '/stream')

/**
 * Utility functions
 */

function notify (msg) {
  clients.forEach(function (client) {
    client.write(msg)
  })

  console.log(msg)
}

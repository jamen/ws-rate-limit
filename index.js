'use strict'

const duration = require('css-duration')
const intercept = require('event-intercept')

module.exports = rateLimit

/**
 * Rate limit a `ws` client.
 *
 * ```js
 * var limit = rateLimit('.5d', 10000)
 *
 * wss.on('connection', client => {
 *   limit(client)
 * })
 * ```
 */
function rateLimit (rate, max) {
  const clients = []

  // Create an interval that resets message counts
  setInterval(() => {
    let i = clients.length
    while (i--) clients[i].messageCount = 0
  }, duration(rate))

  // Apply limiting to client:
  return function limit (client) {
    client.messageCount = 0

    intercept(client, 'message', function (data, done) {
      // Below rate limit threshold:
      if (client.messageCount++ < max) return done(null, data)
      // Above threshold:
      client.emit('limited', data[0], client.messageCount - max, data[1])
      done(true)
    })

    // Push on clients array, and add handler to remove from array:
    clients.push(client)
    client.on('close', () => {
      clients.splice(clients.indexOf(client), 1)
    })
  }
}

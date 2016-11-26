var Server = require('uws').Server
var wss = new Server({ port: 8001 })
// Initialize module at 5 requests per 10 seconds:
var rateLimit = require('../')('10s', 5)

// Handle connections on WS server
wss.on('connection', function (ws) {
  // Apply rate limiting to client
  rateLimit(ws)

  // Listen for messages normally
  ws.on('message', console.log)

  // Triggered instead of 'message' when requests maxed in time frame
  ws.on('limited', console.log)
})

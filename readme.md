# ws-rate-limit

> Rate limiting utility for `ws`

Rate limits the `'message'` event on [`ws`](https://npmjs.com/ws) objects and triggers `'limited'` event for handling

```js
// Initialize module at 100 requests per 10 seconds:
var rateLimit = require('ws-rate-limit')('10s', 100)

// Handle connections on WS server
wss.on('connection', function (ws) {
  // Apply rate limiting to client
  rateLimit(ws)

  // Listen for messages normally
  ws.on('message', data => ...)

  // Triggered instead of 'message' when requests maxed in time frame
  ws.on('limited', data => ...)
})
```

Can be used with [`uws`](https://npmjs.com/uws)

## Installation

```sh
npm install --save ws-rate-limit
```

## Usage

### `rateLimit(rate, max) -> limiter`

Creates a `limiter` function with your specified rate limiting options for easily reapplying settings on multiple connections

#### Parameters

 - `rate` (`String`): A [`css-duration`](https://npmjs.com/css-duration) string of the rate (i.e. `10m`, `0.5d`, `1w`, etc.)
 - `max` (`Number`): Maximum amount of requests that can be made during the rate

#### Example

```js
// 100 requests per 10 seconds:
var limiter = rateLimit('10s', 100)

// 5000 requests every half a day:
var limiter = rateLimit('.5d', 5000)
```

### `limiter(client)`

Apply rate limiting options on `ws` client

#### Parameters

 - `client` ([`WebSocket`](https://npmjs.com/ws)): A `ws` websocket client to apply rate limits

#### Example

```js
var limiter = rateLimit('10s', 100)

wss.on('connection', function (client) {
  limiter(client)
})
```

### Event `'limited'`

Event is triggered instead of `'message'` when the rate limiting has capped in the time frame.

The parameters are `(message, count, flags)` where `count` is an number of how many rate limited requests the user has made, and `message` and `flags` come from `'message'` event.

#### Example

```js
wss.on('connection', function (client) {
  // Apply limiting
  limiter(client)

  client.on('limited', function (data, count) {
    // Respond with rate limit error
    client.send('No!')
    if (count > 10) client.close()
  })
})
```  

## License

MIT © [Jamen Marz](https://git.io/jamen)

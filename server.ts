import { loadEnvConfig } from '@next/env'
loadEnvConfig('./', process.env.NODE_ENV !== 'production')

import WebSocket from "ws"

import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
 
const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10);
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

 
app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url ?? '', true)
      const { pathname, query } = parsedUrl
 
      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)

        let clients: WebSocket[] = [];
        let wss: WebSocket.Server

        let binanceWSS: WebSocket
        function connectToBinance() {
            console.log("Connecting to Binance WSS")
            binanceWSS = new WebSocket("wss://stream.binance.com:9443/ws")
            binanceWSS.on('open', () => {
                console.log('Connected to Binance WSS')
                wss?.close()
                wss = new WebSocket.Server({ port: 8080 });
                wss.on("connection", (ws) => {
                    clients.push(ws);
                    ws.on("message", (message) => {
                        // Handle incoming messages
                        console.log("Received from our client:", message.toString());
                        binanceWSS.send(message.toString())
                    });
                    ws.on("close", () => {
                        // Remove closed connections from the clients list
                        clients = clients.filter((client) => client !== ws);
                    });
                });
                
                console.log("WebSocket server started on port 8080");
            })
            binanceWSS.on('error', (err) => {
                console.log("Connection to Binance error with", err.toString())
                setTimeout(() => {
                    binanceWSS?.close()
                    connectToBinance()
                }, 1000);
            })
            binanceWSS.on('close', (code, reason) => {
                console.log("Connection to Binance closed with", code, reason.toString())
                setTimeout(() => {
                    binanceWSS?.close()
                    connectToBinance()
                }, 1000);
            })
            binanceWSS.on('message', data => {
                // console.log("Received from binance:", data.toString());
                clients.forEach(client => {
                    client.send(data.toString())
                })
            })
        }
        connectToBinance()
    })
})

import { Middleware } from "redux";
import { receiveStream } from "../features/home/homeSlice";
import { RootState } from "../store";
import { receiveSymbolStream } from "../features/symbol/symbolSlice";


const socketMiddleware: Middleware<
  {},
  RootState
  > = storeApi => {
    let socket: WebSocket | undefined

    const sendSocketEvent = (data: any) => {
      if (socket?.readyState == 1) {
        socket?.send(data)
      } else {
        socket?.addEventListener('open', (evt) => {

          setTimeout(() => {
            socket?.send(data)
          }, 5);
        })
      }
    }
    const autoReconnectDelay = 5000

    const connectToWSS = (): WebSocket => {
        socket = new WebSocket("wss://stream.binance.com:9443/ws")
        socket.onclose = event => {
          setTimeout(() => {
            socket = connectToWSS()
          }, autoReconnectDelay);
          console.log("Websocket closed with", event.reason, "Reconnecting...")
        }

        socket.onerror = error => {
          if (error.type == 'ECONNREFUSED') {
            socket = connectToWSS()
            return
          }
          console.log("Websocket Error", error)
        }

        socket.onmessage = event => {
          // Dispatch action for received message
          const message = event.data.toString()
          storeApi.dispatch(receiveStream(message))
          storeApi.dispatch(receiveSymbolStream(message))
        }
    
        sendSocketEvent(JSON.stringify({
          "method": "SET_PROPERTY",
          "params": [
            "combined",
            true
          ],
          "id": 5
        }))
        sendSocketEvent(JSON.stringify({
          "method": "SUBSCRIBE",
          "params": [
            "!ticker@arr"
          ],
          "id": 1
        }))
        
        return socket
    }

    socket = connectToWSS()

    return (next: (action: any) => void) => (action: any) => {
      const prevSymbol = storeApi.getState().symbol.symbol
      const prevInterval = storeApi.getState().symbol.interval
      switch (action.type) {
    
        case 'symbol/initialize/pending':
          if (prevSymbol && prevInterval) {
            sendSocketEvent(JSON.stringify({
              "method": "UNSUBSCRIBE",
              "params": [
                `${prevSymbol.toLowerCase()}@kline_${prevInterval}`,
                `${prevSymbol.toLowerCase()}@ticker`,
                `${prevSymbol.toLowerCase()}@depth`
              ],
              "id": 2
            }))
          }
          sendSocketEvent(JSON.stringify({
            "method": "SUBSCRIBE",
            "params": [
              `${action.meta.arg.symbol.toLowerCase()}@kline_${action.meta.arg.interval}`,
              `${action.meta.arg.symbol.toLowerCase()}@ticker`,
              `${action.meta.arg.symbol.toLowerCase()}@depth`
            ],
            "id": 3
          }))
          break

        case 'symbol/changeKLineInterval/pending':
          if (prevSymbol && prevInterval) {
            sendSocketEvent(JSON.stringify({
              "method": "UNSUBSCRIBE",
              "params": [
                `${prevSymbol.toLowerCase()}@kline_${prevInterval}`
              ],
              "id": 2
            }))
          }
          sendSocketEvent(JSON.stringify({
            "method": "SUBSCRIBE",
            "params": [
              `${action.meta.arg.symbol.toLowerCase()}@kline_${action.meta.arg.interval}`
            ],
            "id": 3
          }))
          break

        
        case 'symbol/deinitializeSymbol':
          if (prevSymbol && prevInterval) {
            sendSocketEvent(JSON.stringify({
              "method": "UNSUBSCRIBE",
              "params": [
                `${prevSymbol.toLowerCase()}@kline_${prevInterval}`,
                `${prevSymbol.toLowerCase()}@ticker`,
                `${prevSymbol.toLowerCase()}@depth`
              ],
              "id": 2
            }))
          }
          break
    
        default:
          break
      }
    
      return next(action)
    }
}

export default socketMiddleware
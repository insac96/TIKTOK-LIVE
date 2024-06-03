import type { Server as SocketServer, Socket } from 'socket.io'
import tiktokHandler from './tiktok'
import googleHandler from './google'

export default (event : any, io : SocketServer) => {
  io.on('connection', (socket : Socket) => {
    let liveConnection
    tiktokHandler(io, socket, liveConnection)
    googleHandler(io, socket)
  })
}
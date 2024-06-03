import type { Server as SocketServer, Socket } from 'socket.io'
import { WebcastPushConnection } from 'tiktok-live-connector'

export default (io : SocketServer, socket : Socket, liveConnection : any) => {
  // Connect Live
  socket.on('live-connect', async (streamerID) => {
    try {
      if(!streamerID) return socket.emit('live-connect-error', 'Vui lòng nhập thông tin ID phòng')
      if(!!liveConnection) return socket.emit('live-connect-error', 'Đã có kết nối vào phiên live này')
      
      liveConnection = new WebcastPushConnection(streamerID, {
        processInitialData: true,
        enableExtendedGiftInfo: true,
        enableWebsocketUpgrade: true,
        requestPollingIntervalMs: 2000,
        clientParams: {
          "app_language": "vi-VN",
          "device_platform": "web"
        },
      })

      await liveConnection.connect()
      socket.emit('live-connect-success', 'Khởi tạo kết nối thành công')
    }
    catch(e){
      liveConnection = null
      socket.emit('live-connect-error', 'Khởi tạo kết nối không thành công')
    }
  })

  // Disconnect Live
  socket.on('live-disconnect', async () => {
    if(!liveConnection) return socket.emit('live-disconnect-error', 'Phiên live chưa được kết nối')
    
    liveConnection.disconnect()
    liveConnection = null
    socket.emit('live-disconnect', 'Phiên live bị ngắt kết nối')
  })

  // Start Service Live
  socket.on('live-start', () => {
    if(!liveConnection) return socket.emit('live-start-error', 'Phiên live chưa được kết nối')
      socket.emit('live-start-success', 'Kết nối phiên live thành công')

    liveConnection.on('chat', (data : any) => {
      const send = {
        id: data.msgId,
        user: {
          id: Number(data.userId),
          username: data.uniqueId,
          nickname: data.nickname,
          avatar: data.profilePictureUrl
        },
        message: data.comment,
        time: data.createTime,
        type: 'chat'
      }

      socket.emit('live-message', send)
    })

    liveConnection.on('gift', (data : any) => {
      const send : any = {
        id: data.msgId,
        user: {
          id: Number(data.userId),
          username: data.uniqueId,
          nickname: data.nickname,
          avatar: data.profilePictureUrl
        },
        time: data.timestamp,
        type: 'gift'
      }

      if (data.giftType === 1 && !data.repeatEnd) {
        return false
      }
      else {
        send.message = `Gửi tặng ${data.repeatCount} ${data.giftName}`
        socket.emit('live-message', send)
      }
    })

    liveConnection.on('streamEnd', () => {
      liveConnection.disconnect()
      liveConnection = null
      socket.emit('live-disconnect', 'Phiên live đã kết thúc')
    })
  })

  // Get Live Info
  socket.on('live-info', async () => {
    if(!liveConnection) return socket.emit('live-info-error', 'Phiên live chưa được kết nối')

    const { id_str, owner, title, user_count } = await liveConnection.getRoomInfo()
    const { avatar_large, display_id, id, nickname } = owner

    const streamer = {
      id: Number(id),
      username: display_id,
      nickname: nickname,
      avatar: avatar_large ? avatar_large['url_list'][0] : null
    }

    const room = {
      id: Number(id_str),
      title: title,
      view: user_count
    }

    socket.emit('live-info-success', { streamer, room })
  })

  // Client Disconnect
  socket.on('disconnect', async () => {
    if(!liveConnection) return

    liveConnection.disconnect()
    liveConnection = null
    socket.emit('live-disconnect', 'Mất kết nối máy khách')
  })
}
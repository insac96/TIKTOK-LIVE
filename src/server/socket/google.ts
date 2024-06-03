import type { Server as SocketServer, Socket } from 'socket.io'

export default (io : SocketServer, socket : Socket) => {
  socket.on('text-to-speech', async (data) => {
    const { text, voice } = data
    if(!text) return false
    if(!voice) return false

    const APIKey = 'AIzaSyAVg0AgA-g5yehiCVm9kYBV1fzVmwGdYD0'
    const url = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${APIKey}`
    const headers = { 'Content-Type': 'application/json; charset=utf-8' }
    const body = {
      input:{
        text: text
      },
      voice:{
        languageCode: 'vi-VN',
        name: voice.type || 'vi-VN-Neural2-A',
        ssmlGender: voice.sex || 'FEMALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1, // Speed 0.25 - 4
        effectsProfileId: [
          "small-bluetooth-speaker-class-device"
        ],
      }
    }

    const res = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(body) })
    const result = await res.json()
    if(!!result.audioContent) return socket.emit('text-to-speech', result.audioContent)
  })
}
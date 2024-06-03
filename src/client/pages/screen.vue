<template>
  <UiFlex class="z-[1] grow max-h-full py-2" type="col">
    <div class="w-full mb-2" v-if="!!room && !!streamer">
      <UCard :ui="{ background: '', body: { padding: 'px-2 py-2 sm:px-2 sm:py-2' } }">
        <UiFlex>
          <UAvatar :src="streamer.avatar" alt="Avatar" size="md" />

          <UiFlex class="grow mx-3" type="col" items="flex-start">
            <UiText color="primary" weight="semibold">{{ streamer.nickname }}</UiText>
            <UiText color="gray" size="sm">{{ streamer.username }}</UiText>
          </UiFlex>

          <UButton icon="i-mdi-eye" color="gray" size="xs" class="mr-0.5">{{ room.view }}</UButton>
          <UButton icon="i-bx-chat" color="gray" size="xs">{{ messages.length }}</UButton>
        </UiFlex>
      </UCard>
    </div>

    <UCard id="BoxMessage" class="w-full grow overflow-hidden" :ui="{ background: '', body: { padding: 'px-0 py-0 sm:px-0 sm:py-0' } }">
      <UiFlex type="col" items="flex-start" class="gap-5 p-2 pr-0">
        <UiFlex items="flex-start" v-for="item in messages" :key="item.id" >
          <UAvatar :src="item.user.avatar" alt="Avatar" size="md" />

          <div class="ml-2">
            <UiText color="primary" weight="semibold" size="xs" class="mb-1">{{ item.user.nickname }}</UiText>
            <div class="bg-gray-800 py-2 px-3 rounded-xl rounded-ss-none text-sm">
              {{ item.message }}
            </div>
          </div>
        </UiFlex>
      </UiFlex>
    </UCard>

    <div class="w-full mt-2">
      <UCard class="overflow-y-visible" :ui="{ background: '', body: { padding: 'px-2 py-2 sm:px-2 sm:py-2' } }">
        <UiFlex class="gap-0.5">
          <UButton class="mr-1" :color="!config.onSpeak ? 'gray' : 'green'" icon="i-bx-user-voice" @click="config.onSpeak = !config.onSpeak">
            {{ !!config.onSpeak ? 'Tắt' : 'Bật' }}
          </UButton>

          <USelectMenu v-model="voiceSelect" value-attribute="value" :options="voices" />

          <UButton class="ml-auto"  color="red" icon="i-bx-power-off" square @click="disconnect"></UButton>
        </UiFlex>
      </UCard>
    </div>
  </UiFlex>
</template>

<script setup>
const { $socket } = useNuxtApp()
const { success, error } = useNotify()

const room = ref(undefined)
const streamer = ref(undefined)
const reloadInfoProcess = ref(undefined)

const messages = ref([])

const voices = ref([
  { label: 'Giọng Nữ Vừa', type: 'vi-VN-Neural2-A', sex: 'FEMALE', value: 0 },
  { label: 'Giọng Nam Vừa', type: 'vi-VN-Standard-B', sex: 'MALE', value: 1 },
  { label: 'Giọng Nữ Trầm', type: 'vi-VN-Standard-A', sex: 'FEMALE', value: 2 },
  { label: 'Giọng Nam Trầm', type: 'vi-VN-Neural2-D', sex: 'MALE', value: 3 },
  { label: 'Giọng Nữ Cao', type: 'vi-VN-Wavenet-C', sex: 'FEMALE', value: 4 },
])
const voiceSelect = ref(0)

const audio = ref({
  source: undefined,
  data: undefined,
  index: undefined
})
const audioMessage = ref([])
const autoSpeakProcess = ref(undefined)

const config = ref({
  maxMessage: 200,
  reloadTime: 5000,
  delaySpeak: 500,
  onSpeak: false
})

const autoSpeak = () => {

  if(!!autoSpeakProcess.value) return
  autoSpeakProcess.value = setInterval(() => {
    if(!!audio.value.source) return // Đang có Audio được phát
    if(audioMessage.value.length == 0) return // Không có tin nhắn chờ

    audio.value.data = audioMessage.value[0]
    audio.value.index = audioMessage.value.findLastIndex(i => i.id == audio.value.data.id)
    
    $socket.emit('text-to-speech', { 
      text: audio.value.data.message, 
      voice: voices.value[voiceSelect.value] 
    })
  }, config.value.delaySpeak)
}

const toBottom = () => {
  const box = document.getElementById('BoxMessage')
  box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' })
}

const reloadInfo = () => {
  if(!!reloadInfoProcess.value) return
  reloadInfoProcess.value = setInterval(() => {
    $socket.emit('live-info')
  }, config.value.reloadTime)
}

const disconnect = () => {
  $socket.emit('live-disconnect')
}

onMounted(() => {
  // Live Start
  $socket.emit('live-start')
  $socket.on('live-start-error', (message) => {
    error(message)
    navigateTo('/')
  })
  $socket.on('live-start-success', (message) => {
    success(message)
    $socket.emit('live-info')
    reloadInfo()
    autoSpeak()
  })

  // // Live Info
  $socket.on('live-info-error', (message) => {
    error(message)
  })
  $socket.on('live-info-success', (data) => {
    room.value = data.room
    streamer.value = data.streamer
  })

  // Live Disconnect
  $socket.on('live-disconnect', (message) => {
    error(message)
    if(!!reloadInfoProcess.value){
      clearInterval(reloadInfoProcess.value)
      reloadInfoProcess.value = null
    }
    navigateTo('/')
  })

  // Live Message
  $socket.on('live-message', (data) => {
    // Auto Delete Item
    if(messages.value.length > config.value.maxMessage){
      messages.value = []
    }

    // Add Message Chat
    messages.value.push(data)

    // Add Message Speak
    if(!!config.value.onSpeak){
      let content
      if(data.type == 'chat'){
        content = `${data.user.nickname}     ${data.message}`
      }
      if(data.type == 'gift'){
        content = `Cảm ơn ${data.user.nickname} đã ${data.message}`
      }

      audioMessage.value.push({ id: data.id, message: content })
    }

    // Auto To Bottom
    setTimeout(() => toBottom(), 100)
  })

  // Google Speak
  $socket.on('text-to-speech', (data) => {
    if(!!audio.value.source) return

    audio.value.source = new Audio(`data:audio/mp3;base64,${data}`)
    audio.value.source.play()
    audio.value.source.onended = () => {
      audioMessage.value.splice(audio.value.index, 1)
      audio.value.source = undefined
    }
  })
})
</script>
<template>
  <UiFlex class="z-[1] grow max-h-full py-2" type="col">
    <div class="w-full mb-2 " v-if="!!room && !!streamer">
      <UCard :ui="{ background: 'dark:bg-transparent backdrop-blur-xl', body: { padding: 'px-2 py-2 sm:px-2 sm:py-2' } }">
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

    <UCard id="BoxMessage" class="w-full grow overflow-hidden" :ui="{ background: 'dark:bg-transparent backdrop-blur-xl', body: { padding: 'px-0 py-0 sm:px-0 sm:py-0' } }">
      <UiFlex type="col" items="flex-start" class="gap-5 p-2">
        <UiFlex items="flex-start" v-for="item in messages" :key="item.id" >
          <UAvatar :src="item.user.avatar" alt="Avatar" size="md" />

          <UiFlex type="col" items="flex-start" class="ml-2">
            <UiText color="primary" weight="bold" size="xs" class="mb-1">{{ item.user.nickname }}</UiText>
            <div class="bg-gray-800 py-2 px-3 rounded-xl rounded-ss-none text-sm w-fit">
              {{ item.message }}
            </div>
          </UiFlex>
        </UiFlex>
      </UiFlex>
    </UCard>

    <div class="w-full mt-2">
      <UCard class="overflow-y-visible" :ui="{ background: 'dark:bg-transparent backdrop-blur-xl', body: { padding: 'px-2 py-2 sm:px-2 sm:py-2' } }">
        <UiFlex class="gap-0.5">
          <UButtonGroup>
            <UButton :color="!config.onSpeak ? 'gray' : 'green'" icon="i-bx-user-voice" @click="config.onSpeak = !config.onSpeak">
              {{ !!config.onSpeak ? 'Tắt' : 'Bật' }}
            </UButton>
            <UButton v-if="!!config.onSpeak" icon="i-bx-cog" color="gray" square @click="modal = true"></UButton>
          </UButtonGroup>

          <USelectMenu v-if="!!config.onSpeak" v-model="voiceSelect" value-attribute="value" :options="voices" />

          <UButton class="ml-auto"  color="red" icon="i-bx-power-off" square @click="disconnect"></UButton>
        </UiFlex>
      </UCard>
    </div>

    <UModal v-model="modal">
      <UCard>
        <UiFlex class="mb-4" justify="between">
          <UiText color="gray" size="sm">Giọng đọc</UiText>
          <USelectMenu v-model="voiceSelect" value-attribute="value" :options="voices" />
        </UiFlex>

        <UiFlex class="mb-6" justify="between">
          <UiText color="gray" size="sm">Đọc người bình luận</UiText>
          <UToggle v-model="config.listSpeak.chat" />
        </UiFlex>

        <UiFlex class="mb-6" justify="between">
          <UiText color="gray" size="sm">Đọc người tặng quà</UiText>
          <UToggle v-model="config.listSpeak.gift" />
        </UiFlex>

        <UiFlex class="mb-6" justify="between">
          <UiText color="gray" size="sm">Đọc người theo dõi</UiText>
          <UToggle v-model="config.listSpeak.follow" />
        </UiFlex>

        <UiFlex justify="between">
          <UiText color="gray" size="sm">Đọc người chia sẻ</UiText>
          <UToggle v-model="config.listSpeak.share" />
        </UiFlex>
      </UCard>
    </UModal>
  </UiFlex>
</template>

<script setup>
useSeoMeta({
  title: () => `Screen - Tiktok Live Speak`,
})
const { $socket } = useNuxtApp()
const { success, error } = useNotify()
const modal = ref(false)

const room = ref(undefined)
const streamer = ref(undefined)

const messages = ref([])

const voices = ref([
  { label: 'Nữ Vừa', type: 'vi-VN-Neural2-A', sex: 'FEMALE', value: 0 },
  { label: 'Nam Vừa', type: 'vi-VN-Standard-B', sex: 'MALE', value: 1 },
  { label: 'Nữ Trầm', type: 'vi-VN-Standard-A', sex: 'FEMALE', value: 2 },
  { label: 'Nam Trầm', type: 'vi-VN-Neural2-D', sex: 'MALE', value: 3 },
  { label: 'Nữ Cao', type: 'vi-VN-Wavenet-C', sex: 'FEMALE', value: 4 },
])
const voiceSelect = ref(4)

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
  onSpeak: false,
  listSpeak: {
    chat: true,
    gift: true,
    follow: true,
    share: true
  }
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

const disconnect = () => {
  $socket.emit('live-disconnect')
}

const isBanText = (data) => {
  const text = data.toLowerCase()
  const ban = [
    'chem chép', 'lồn', 'bướm', 'bú',
    'buồi', 'cặc', 'chim', 'cu',
    'tiktok', 'tóp tóp', 
    'cấm live', 'tắt live', 'cảnh báo', 'cấm', 'vi phạm',
    'địt', 
  ]
  let is = false
  ban.forEach(i => {
    const position = text.search(i)
    if(position != -1){
      is = true
    }
  })

  return is
}

const isOnlyEmoji = (data) => {
  const pattern = /[A-Za-z0-9]/gm
  const result = pattern.test(data)
  if(!result) return true
  return false
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
    if(!!autoSpeakProcess.value){
      clearInterval(autoSpeakProcess.value)
      autoSpeakProcess.value = null
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
        if(!!isOnlyEmoji(data.message)) return
        content = `${data.user.nickname}. ${data.message}`
      }
      else if(data.type == 'gift'){
        content = `Cảm ơn ${data.user.nickname} đã ${data.message}`
      }
      else if(data.type == 'follow'){
        content = `Cảm ơn ${data.user.nickname} ${data.message}`
      }
      else if(data.type == 'share'){
        content = `Cảm ơn ${data.user.nickname} ${data.message}`
      }
      else {
        return
      }

      if(!!isBanText(content)) return
      if(!!config.value.listSpeak[data.type]) audioMessage.value.push({ id: data.id, message: content })
    }

    // Auto To Bottom
    setTimeout(() => toBottom(), 100)
  })

  // Live View
  $socket.on('live-view', (data) => {
    if(!!room.value) return room.value.view = data
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
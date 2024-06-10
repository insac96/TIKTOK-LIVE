<template>
  <UiFlex class="z-[1] grow" type="col" justify="center">
    <div class="mb-5">
      <UiText align="center" weight="bold" size="3xl" color="primary" class="mb-0.5">Tiktok Live Speak</UiText>
      <UiText align="center" weight="semibold" size="sm" color="gray">Một sản phẩm của Chú Tú</UiText>
    </div>

    <UForm :state="state" @submit="start">
      <UInput v-model="state.id" icon="i-bx-user" placeholder="Nhập ID Livestream" disabled class="mb-2.5" />

      <UiFlex justify="center">
        <UButton :loading="loading" @click="start">Kết Nối</UButton>
      </UiFlex>
    </UForm>
  </UiFlex>
</template>

<script setup>
useSeoMeta({
  title: () => 'Tiktok Live Speak',
})

const { $socket } = useNuxtApp()
const { success, error } = useNotify()

const loading = ref(false)
const state = ref({
  id: '12345suplo'
})

const start = () => {
  const audio = new Audio('sound/click.wav')
  audio.play()
  
  if(!state.value.id) return error('Vui lòng nhập thông tin ID phòng')
  loading.value = true
  $socket.emit('live-connect', state.value.id)
}

onMounted(() => {
  $socket.on('live-connect-error', (message) => {
    loading.value = false
    error(message)
  })

  $socket.on('live-connect-success', () => {
    navigateTo('/screen')
  })
})
</script>
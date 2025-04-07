<template>
  <UiFlex class="z-[1] grow" type="col" justify="center">
    <div class="mb-6">
      <UiFlex class="mb-1 gap-1" justify="center" align="center">
        <UiText align="center" weight="bold" size="2xl" color="primary">Tiktok</UiText>
        <UiText align="center" weight="bold" size="2xl" color="rose">Live</UiText>
      </UiFlex>
      <UiText align="center" weight="semibold" size="sm" color="gray">Một sản phẩm của Trần NQ.Anh</UiText>
    </div>

    <UForm :state="state" @submit="start">
      <UInput v-model="state.id" icon="i-bx-user" placeholder="Nhập ID Livestream" class="mb-4" />

      <UiFlex justify="center">
        <UButton :loading="loading" @click="start" icon="i-bx-station">Kết Nối</UButton>
      </UiFlex>
    </UForm>
  </UiFlex>
</template>

<script setup>
useSeoMeta({
  title: () => 'Tiktok Live',
})

const { $socket } = useNuxtApp()
const { success, error } = useNotify()

const loading = ref(false)
const state = ref({
  id: 'xuanhaydoi'
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
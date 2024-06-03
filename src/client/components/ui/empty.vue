<template>
  <UiFlex type="col">
    <UiIcon size="16" color="primary" name="i-bx-data"></UiIcon>
    <UiText size="sm" color="gray">{{ title || 'Không có dữ liệu' }}</UiText>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['title'])
</script>
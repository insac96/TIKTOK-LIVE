<template>
  <UContainer class="Layout" :ui="{ constrained: 'max-w-3xl', padding: 'px-2 sm:px-4 lg:px-6' }">
    <div class="Layout__BG"></div>
    <slot></slot>
  </UContainer>
</template>

<style lang="sass">
.Layout
  height: 100%
  min-height: 100%
  max-height: 100%
  display: flex
  flex-direction: column
  overflow: hidden
  background-color: rgb(0, 0, 0)
  &__BG
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    aspect-ratio: 1 / 1
    background-image: url(images/MobileBGTop.png), url(images/MobileBGBot.png)
    background-repeat: no-repeat, no-repeat
    background-size: 35%, 35%
    background-position: left top, right bottom
    z-index: 0
</style>
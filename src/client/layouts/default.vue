
<template>
  <UContainer class="Layout" :ui="{ constrained: 'max-w-3xl', padding: 'px-2 sm:px-4 lg:px-6' }">
    <div class="Layout__BG" style="background-image: url(images/MobileBGBot.png), url(images/MobileBGTop.png)"></div>
    <slot></slot>

    <!-- <UiSnow /> -->
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
    background-repeat: no-repeat, no-repeat, no-repeat
    background-size: auto 40%, auto 40%
    background-position: right bottom, left top
    z-index: 0

@keyframes snowflakes-fall
  0%
    top: -10%
  100%
    top: 100%

@keyframes snowflakes-shake
  0%,100%
    transform: translateX(0)

  50%
    transform: translateX(80px)

.snowflake
  color: #fff
  font-size: 1em
  font-family: Arial, sans-serif
  text-shadow: 0 0 5px #000
  position: fixed
  top: -10%
  z-index: 9999
  -moz-user-select: none
  -ms-user-select: none
  user-select: none
  cursor: default
  animation-name: snowflakes-fall,snowflakes-shake
  animation-duration: 10s,3s
  animation-timing-function: linear,ease-in-out
  animation-iteration-count: infinite,infinite
  animation-play-state: running,running

  &:nth-of-type(0)
    left: 1%
    animation-delay: 0s, 0s

  &:nth-of-type(1)
    left: 10%
    animation-delay: 1s, 1s

  &:nth-of-type(2)
    left: 20%
    animation-delay: 6s, 0.5s

  &:nth-of-type(3)
    left: 30%
    animation-delay: 4s, 2s

  &:nth-of-type(4)
    left: 40%
    animation-delay: 2s, 2s

  &:nth-of-type(5)
    left: 50%
    animation-delay: 8s, 3s

  &:nth-of-type(6)
    left: 60%
    animation-delay: 6s, 2s

  &:nth-of-type(7)
    left: 70%
    animation-delay: 2.5s, 1s

  &:nth-of-type(8)
    left: 80%
    animation-delay: 1s, 0s

  &:nth-of-type(9)
    left: 90%
    animation-delay: 3s, 1.5s

  &:nth-of-type(10)
    left: 25%
    animation-delay: 2s, 0s

  &:nth-of-type(11)
    left: 65%
    animation-delay: 4s, 2.5s

</style>
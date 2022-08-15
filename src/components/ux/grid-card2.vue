<template>
  <div class="wrapper">
    <div class="grid-card row-span-2 row-start-1">
      <div class="grid-content bg-font-3">1</div>
    </div>
    <div
      class="group grid-card row-start-2 row-end-4"
      @mouseover="mouseOut = true"
      @mouseout="mouseOut = false"
      :class="{
        delay: !mouseOut
      }"
    >
      <div class="grid-card__img absolute">a</div>
      <div class="grid-card__img absolute">a1</div>
      <div class="grid-card__img absolute">a2</div>
      <div class="grid-card__img absolute">a3</div>
      <div class="grid-card__img absolute">a4</div>
      <div
        class="
          grid-content
          rounded-xl
          bg-main-2
          group-hover:bg-font-1 group-hover:text-white
        "
      >
        1
      </div>
    </div>
    <div class="grid-card row-start-1 row-span-2">
      <div class="grid-content bg-main-4">1</div>
    </div>
    <div class="grid-card row-span-2">
      <div class="grid-content bg-font-4">1</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue-demi"

const mouseOut = ref(false)
</script>
<style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-template-rows: 30px 100px 30px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  z-index: 1;
}
.grid-card {
  padding: 0;
  transition: transform 0.3s;
  cursor: pointer;
  position: relative;
  min-width: 200px;
  aspect-ratio: 1;
  &__img {
    width: 80px;
    aspect-ratio: 1;
    transition: all 0.3s 0.6s;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    background: red;
  }
  &:hover {
    z-index: 10;
    transform: scale(1.2);
    animation: shake 300ms 300ms;
    .grid-content::before {
      transform: translate(-50%, 50%);
      background: #000;
      opacity: 0.2;
    }
    .grid-card__img:nth-child(1) {
      transform: translate(-210%, 90%) rotate(-10deg);
      background: yellowgreen;
    }
    .grid-card__img:nth-child(2) {
      transform: translate(-200%, -200%) rotate(10deg);
      background: brown;
    }
    .grid-card__img:nth-child(4) {
      transform: translate(100%, -180%) rotate(-10deg);
      background: pink;
    }
    .grid-card__img:nth-child(3) {
      transform: translate(80%, 100%) rotate(-30deg);
      background: green;
    }
  }
}
.grid-content {
  position: relative;
  width: 100%;
  height: 100%;
  &::before {
    position: absolute;
    content: "";
    inset: 1rem;
    background: #000;
    transition: all 0.3s;
    z-index: -1;
    filter: blur(20px);
  }
}
.delay {
  transition-delay: .6s;
  z-index: 10;
}
@keyframes shake {
  25% {
    transform: scale(1.2) rotate(10deg);
  }

  55% {
    transform: scale(1.2) rotate(-10deg);
  }

  75% {
    transform: scale(1.2) rotate(10deg);
  }
}

@keyframes imgTrans {
  25% {
    transform: scale(1.2) rotate(10deg);
  }
}
</style>

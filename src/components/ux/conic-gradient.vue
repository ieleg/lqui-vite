<template>
  <div class="container" @mousemove.stop="handleMove" @mouseleave="handleLeave">
    <div
      class="card shadow-md flex items-center justify-center m-0 p-0"
      :class="{
        [type]: true
      }"
      ref="cardRef"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue-demi"
const props = defineProps({
  type: {
    type: String,
    default: "base"
  }
})
const x = ref("0")
const y = ref("0")
const cardRef = ref<HTMLElement>()
const handleMove = (e: MouseEvent) => {
  const { pageX, pageY, clientX, clientY } = e
  const { left, top, x: _x, y: _y } = cardRef.value!.getBoundingClientRect()
  // x.value = (pageY - top) / -10 + 20 + "deg"
  // y.value = (pageX - left) / 15 - 10 + "deg"
  x.value = (clientY - _y) / -10 + 20 + "deg"
  y.value = (clientX - _x) / 15 - 10 + "deg"
  console.log(x.value, y.value, pageY - top, pageX - left)
}

const handleLeave = () => {
  x.value = "0"
  y.value = "0"
}
</script>
<style lang="scss" scoped>
.container {
  perspective: 800px;
  perspective-origin: 100% 0;
}
.card {
  transition: all 0.1s;
  width: 300px;
  height: 400px;

  background: conic-gradient(#000 0% 25%, #fff 0% 50%, #000 0% 75%, #fff 0%) 50% /
    50px 50px repeat;
    // background: conic-gradient(at 10px y-start,#000 0% 25%, #fff 0% 50%, #000 0% 75%, #fff 0%);
  &:hover {
    transform: rotateX(v-bind(x)) rotateY(v-bind(y));
  }
}
.rotate {
  background: conic-gradient(
      from 45deg,
      #000 0% 25%,
      #fff 0% 50%,
      #000 0% 75%,
      #fff 0%
    )
    50% / 50px 50px repeat;
}
.angle {
  $c0: #000;
  $c1: #fff;

  background: conic-gradient(
      from 30deg,
      $c1 0% 60deg,
      $c0 0% 120deg,
      $c1 0% 50%,
      $c0 0% 240deg,
      $c1 0% 300deg,
      $c0 0%
    )
    50% / 30px 51px;
}
</style>

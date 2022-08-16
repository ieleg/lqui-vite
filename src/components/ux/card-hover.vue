<template>
  <div class="container" @mousemove.stop="handleMove" @mouseleave="handleLeave">
    <div
      class="card shadow-md flex items-center justify-center m-0 p-0"
      ref="cardRef"
    ></div>
  </div>
</template>

<script lang="ts" setup>
/* 
ax+b = y
b = 20 b = -10
400x+20 = -20 300b - 10 = 10
x = -0.1 x = 2/3
-0.1x+20 =y  1/15x - 10 = y

````````````````````````
`0 0(20deg -10deg)   300 0(20deg 10deg) 
`
`
`
`
`
`
`
`
`0 400 (-20deg -10deg)  300 400(-20deg 10deg)
`````````````````````````

*/
import { ref } from "vue-demi"
const x = ref("0")
const y = ref("0")
const cardRef = ref<HTMLElement>()
const handleMove = (e: MouseEvent) => {
  const { pageX, pageY } = e
  const { left, top } = cardRef.value!.getBoundingClientRect()
  x.value = (pageY - top) / -10 + 20 + "deg"
  y.value = (pageX - left) / 15 - 10 + "deg"

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

  background:
//   url('./cat.jpg') center no-repeat,
    repeating-conic-gradient(
        #b0a8b9e5 90deg,
        #edebf083 0 180deg,
        #b0a8b969 0 270deg,
        #b0a8b996 0
      )
      center / 50px 50px repeat,
    radial-gradient(#d5cabd 10px, #fefedf 0) center / 25px 25px repeat;
  &:hover {
    transform: rotateX(v-bind(x)) rotateY(v-bind(y));
    // transform: rotateX(20deg) rotateY(10deg);
  }
}
</style>

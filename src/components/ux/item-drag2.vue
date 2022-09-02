<template>
  <div ref="dragRef" class="relative flex flex-col gap-4">
    <div
      class="h-10 w-40 ring-1 absolute duration-300"
      v-for="(item, index) in list"
      :key="item.key"
      @mousedown="a($event, item)"
      @mousemove="b"
      @mouseup="c"
      :style="transform(item._index)"
      :ref="e => refs[item._index] = e"
    >
      {{ item.desc }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue-demi"

const refs = ref({})
const yCompute = index => height * index + gap * index
const gap = 16
const height = 40
let curIndex = -1
const list = ref(
  Array.from({ length: 10 }, (_, i) => ({
    desc: "asd" + i,
    _index: i,
    key: i
  }))
)

const a = (e, d) => {
  console.log(e, d)
  curIndex = d._index
}

const b = (e) => {
  if(!~curIndex) return

  const { clientX, clientY } = e
  const { left, top, x, y } = refs.value[curIndex].getBoundingClientRect()

  console.log(e.y, clientY,y, clientY-y);
  const yy = Math.min(Math.max(0, e.y + clientY-y), yCompute(list.value.length - 1)) 

  refs.value[curIndex].style.transform = `translate(0, ${e.y}px)`
}

const c = c => {
  curIndex = -1
}
const transform = (i) => {
  console.log(i);
  return `transform: translate(0, ${yCompute(i)}px)`
}
</script>

<style lang="scss" scoped>

</style>

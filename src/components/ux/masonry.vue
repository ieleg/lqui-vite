<template>
  <div
    class="
      masonry
      grid
      gap-3
      grid-cols-[repeat(auto-fill,minmax(150px,1fr))] grid-rows-[masonry]
    "
    ref="wrapperRef"
  >
    <div
      v-for="i in amount"
      :key="i"
      class="ring-1 p-4 max-h-[inherit] mt-0 self-start"
    >
      <span>
        {{ mockContent(i) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useMasonry } from './useMasonry.js'
const amount = ~~(Math.random() * 50 + 1)
const wrapperRef = ref(null)
const mockContent = index => {
  let str = ""
  for (let i = 0; i < ~~(Math.random() * 150 + 1); i++) {
    str += String.fromCharCode(0x4e00 + Math.random() * (0x9fa5 - 0x4e00 + 1))
  }
  return str
}
useMasonry(wrapperRef)
</script>

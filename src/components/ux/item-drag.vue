<template>
  <svg
    class=""
    width="150"
    :height="list.length * height + (list.length - 1) * gap"
    ref="dragRef"
  >
    <g
      v-for="(item, index) in list"
      class="drag-node"
      :key="item.key"
      :transform="`translate(0, ${yCompute(item._index)})`"
      @dragstart="t"
      @dragend="t"
      @dragenter="t"
    >
      <rect :height="height" width="150" fill="red"></rect>
      <text x="15" y="30" fill="black">{{ item.desc }}</text>
    </g>
  </svg>
</template>

<script setup>
import { drag, selectAll, select } from "d3"
import { onMounted, ref } from "vue-demi"
const gap = 16
const height = 40
const dragRef = ref(null)
const list = ref(Array.from({ length: 10 }, (_, i) => ({
  desc: "asd" + i,
  _index: i,
  key: i
})))
let curIndex = 0
let y = 0
const dragStart = (e, d, v) => {
  console.log(e, d, v)
}

const yCompute = index => height * index + gap * index
const computeIndex = y => {
  for (let i = 0; i <= list.value.length; i++) {
    if (yCompute(i) > y) {
      return i - 1
    }
  }
}
function t(e) {
  curIndex = computeIndex(e.y) 
  y = yCompute(curIndex) - e.y
  // console.log(this, e, curIndex)

}

function dragged(e) {
  const yy = Math.min(Math.max(0, e.y + y), yCompute  (list.value.length - 1)) 
  // console.log(e)

  select(this).attr("transform", `translate(0, ${yy})`)
  list.value.sort((a,b) => a._index - b.index);
  const targetIndex = computeIndex(e.y)

  if(curIndex === targetIndex) return 
  console.log(list.value);
  list.value.forEach(item => {
    if(item._index === targetIndex) {
      item._index = curIndex
      curIndex = targetIndex
    }
  })
  selectAll(".drag-node")
  .transition()
  // .attr("transform", (d, i) => {
  //   console.log(d, i);
  //   return `translate(0 ${yCompute(d._index)})`
  // })
}
onMounted(() => {
  // selectAll(".drag-node").data(list.value).call(drag().on("start", t).on("drag", dragged))
})
</script>

<style lang="scss" scoped></style>

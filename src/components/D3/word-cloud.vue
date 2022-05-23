<template>
  <div>
    <button @click="savingForPng">
      保存为png格式
    </button>
    <button @click="savingForSvg">
      保存为svg
    </button>
    <div id="cloud" />
  </div>
</template>

<script>
import { render } from "./word-cloud.js"
import { data } from "./mock/word.js"
import { onMounted } from "vue"
export default {
  setup() {
    const { append, savingForPng, savingForSvg } = render(data, {
      id: "#cloud",
      name: d => d.stWords
    })
    onMounted(() => {
      append()
    })
    return {
      savingForPng,
      savingForSvg
    }
  }
  // mounted() {
  //   console.log(this.a);
  //   render(data, {
  //     id: "#cloud",
  //     name: d => d.stWords
  //   })
  // }
}
</script>

<style lang="scss"></style>

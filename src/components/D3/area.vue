<template>
  <div id="area" />
</template>

<script>
import { render } from "./area.js"
import { data } from "./mock/area.js"

export default {
  mounted() {
    console.log(123);
    render(data, {
      id: "#area",
      x: d => d.key,
      y: d => d.value
    })
  }
}
</script>

<style lang="scss">
.line {
  fill: none;
  stroke: salmon;
  stroke-width: 2px;
}
</style>

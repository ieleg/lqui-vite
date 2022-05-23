<template>
  <div id="brush" style="position: relative" />
</template>

<script>
import * as d3 from "d3"
import { BarChart } from "./brush-domain.js"
import { barData } from "./mock/bar.js"

export default {
  mounted() {
    const data = d3.range(-2, 2, 0.1).map((x, k) => {
      return {
        y: Math.abs(Math.sin(x)),
        x: x,
        name: "名称" + (k % 2)
      }
    })
    BarChart(barData, {
      id: "#brush",
      x: d => d.key,
      y: d => +d.value
    })
  }
}
</script>

<style lang="scss"></style>

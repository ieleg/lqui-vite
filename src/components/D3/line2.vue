<template>
  <div id="line" />
</template>

<script>
import * as d3 from "d3"
import { LineChart } from "./line.js"

export default {
  props: {
    /**
     * 改变傅里叶展开层级
     */
    n: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => []
    }
  },

  mounted() {
    const types = [
      { value: d3.curveBundle.beta(0.1), desc: "curveBundle.beta(.1)" },
      { value: d3.curveBundle.beta(0.5), desc: "curveBundle.beta(.5)" },
      { value: d3.curveBundle.beta(0.9), desc: "curveBundle.beta(.9)" },
      { value: d3.curveBasis, desc: "curveBasis" },
      { value: d3.curveLinear, desc: "curveLinear" },
      { value: d3.curveStepAfter, desc: "curveStepAfter" }
    ]
    const data = d3.range(-Math.PI * 2, Math.PI * 2, 1 / 10).map((x, k) => {
      return {
        y: this.fft(this.n, 1 * x),
        x: x,
        name: types[k % 6]
      }
    })
    LineChart(data, {
      id: "#line",
      x: d => d.x,
      y: d => d.y,
      z: d => d.name,
      yLabel: "y",
      height: 500,
      color: "#4a61d9"
    })
  },
  methods: {
    fft(n, x) {
      let sum = 0
      for (let i = 0; i <= Math.abs(n); i++) {
        sum = Math.sin(x * (2 * i + 1)) / (2 * i + 1) + sum
      }
      return (4 / Math.PI) * sum
    }
  }
}
</script>

<style lang="scss">
.pie {
  &:hover {
    fill-opacity: 0.8;
  }
}

.pie-tooltip {
  position: absolute;
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.3s;

  &::after {
    position: absolute;
    top: -12px;
    left: 50%;
    display: block;
    border-width: 6px;
    border-style: solid dashed dashed dashed;
    border-color: transparent transparent #fff transparent;
    content: "";
    font-size: 0;
    line-height: 0;
    transform: translateX(-50%);
  }
}
</style>

<template>
  <div id="pie" />
</template>

<script>
import * as d3 from "d3"
export default {
  props: {
    colors: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    tipText: {
      type: Function,
      default: () => {}
    }
  },
  mounted() {
    console.log(d3, d3.tip, 3)
    const width = 450
    const height = 450
    const margin = 40
    const radius = Math.min(width, height) / 2.5 - margin
    let colors = this.colors.length
      ? this.colors
      : d3.quantize(
          t => d3.interpolateSpectral(t * 0.8 + 0.1),
          this.data.length
        )

    const pie = d3
      .pie()
      .padAngle(1 / radius)
      .value(d => d.value)
    const data_ready = pie(this.data)
    // Construct arcs.
    console.log(
      "set",
      new d3.InternSet([1, 2, 3, 1]),
      d3.schemeSpectral,
      d3.map
    )
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    const arcGenerator = d3
      .arc()
      .innerRadius(radius / 3)
      .outerRadius(radius)
    let pointStart = d3.arc().innerRadius(radius).outerRadius(radius)
    let pointEnd = d3
      .arc()
      .innerRadius(radius + 20)
      .outerRadius(radius + 50)
    const svg = d3
      .select("#pie")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
      .selectAll("arcs")
      .data(data_ready)
      .enter()
      .append("g")
      .attr("stroke", "stroke")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
    svg
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d, i) => colors[i])
      .style("opacity", 0.7)
      .style("cursor", "pointer")
      .attr("class", "pie")
      .on("mouseover", (event, i) => {
        tooltip.style("opacity", 1.0)
      })
      .on("mousemove", (event, i) => {
        console.log(event, "drop-shadow(2px 2px 10px" + colors[i.index] + ")")
        const x = event.pageX - 100
        const y = event.pageY + 40
        tooltip.style("display", "block")

        tooltip
          .html(this.tipText(i.data))
          .style("left", x + "px")
          .style("top", y + "px")
          .style("display", "block")

          .style("filter", "drop-shadow(2px 2px 10px " + colors[i.index] + ")")
      })
      .on("mouseout", function (d) {
        //鼠标移除 透明度设为0
        tooltip.style("display", "none")
      })
    svg
      .append("g")

      .append("polyline")
      .attr("points", (d, i) => {
        const [x, y] = pointStart.centroid(d)
        const [x2, y2] = pointEnd.centroid(d)
        console.log(d)
        return [
          x,
          y,
          x2,
          y2,
          d.startAngle < Math.PI ? x2 + 50 : x2 - 50,
          y2
        ].join()
      })
      .style("stroke-width", 1)
      .attr("fill", "none")
      .style("stroke", "#999")
    svg
      .append("g")

      .append("text")
      .text(function (d, i) {
        return "天青色等烟雨而我在等你"[i]
      })
      .attr("x", (d, i) => {
        const [x2, y2] = pointEnd.centroid(d)
        return d.startAngle < Math.PI ? x2 : x2 - 50
      })
      .attr("y", (d, i) => {
        const [x, y] = pointStart.centroid(d)
        const [x2, y2] = pointEnd.centroid(d)
        console.log(d)
        return y2 - 10
      })
      .style("stroke-width", 1)
      .attr("fill", (d, i) => colors[i])
      .style("text-anchor", "start")
      .style("font-size", 16)
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip") //用于css设置类样式
      .attr("class", "pie-tooltip") //新建一个tooltip
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

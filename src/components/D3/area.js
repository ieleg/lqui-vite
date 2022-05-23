import * as d3 from "d3"

export const render = (
  data,
  {
    id,
    curve = d3.curveBasis,
    x = d => d.x,
    y = d => d.y,
    marginTop = 20,
    marginRight = 30,
    marginBottom = 30,
    marginLeft = 40,
    width = 640,
    height = 400,
    xType = d3.scaleLinear,
    yType = d3.scaleLinear,
    yLabel
  }
) => {
  const X = d3.map(data, x)
  const Y = d3.map(data, y)
  const I = d3.range(X.length)
  const D = d3.map(data, (d, i) => !isNaN(X[i]) && !isNaN(Y[i]))
  const xDomain = d3.extent(X)
  const yDomain = [0, d3.max(Y)]
  const xRange = [0, width - marginLeft - marginRight]
  const yRange = [height - marginBottom - marginTop, 0]
  const xScale = xType().domain(xDomain).range(xRange)
  const yScale = yType().domain(yDomain).range(yRange)
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  const area = d3
    .area()
    .defined(i => D[i])
    .curve(curve)
    .x(i => xScale(X[i]))
    .y0(yScale(0))
    .y1(i => yScale(Y[i]))
  const line = d3
    .line()
    .defined(i => D[i])
    .curve(d3.curveStep)
    .x(i => xScale(X[i]))
    .y(i => yScale(Y[i]))
  console.log(line)
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

  let areaGradient = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", "areaGradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%")
  areaGradient
    .append("stop")
    .attr("offset", 0.01)
    .attr("stop-color", "#f20666")
    .attr("stop-opacity", 0.3)

  areaGradient
    .append("stop")
    .attr("offset", 0.99)
    .attr("stop-color", "#022859")
    .attr("stop-opacity", 0)
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call(g => g.select(".domain").remove())
    .call(g =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1)
    )
    .call(g =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(yLabel)
    )
  svg
    .append("path")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .attr("class", "line")
    .attr("d", line(I))
  svg
    .append("path")
    .attr("transform", `translate(${marginLeft})`)
    .attr("fill", "url(#areaGradient)")
    .attr("d", area(I))
  svg
    .append("g")
    .attr(
      "transform",
      `translate(${marginLeft},${height - marginBottom - marginTop})`
    )
    .call(xAxis)

  const node = Object.assign(svg.node(), { value: null })

  if (id) {
    document.querySelector(id).append(node)
  } else {
    return node
  }
}

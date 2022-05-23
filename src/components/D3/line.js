import * as d3 from "d3"

export function LineChart(
  data,
  {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    id,
    title, // given d in data, returns the title text
    defined, // for gaps in data
    curve = d3.curveLinear, // method of interpolation between points
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    zDomain, // array of z-values
    color = "currentColor", // stroke color of line, as a constant or a function of *z*
    strokeLinecap, // stroke line cap of line
    strokeLinejoin, // stroke line join of line
    strokeWidth = 1.5, // stroke width of line
    strokeOpacity, // stroke opacity of line
    mixBlendMode = "multiply" // blend mode of lines
  } = {}
) {
  // Compute values.
  const X = d3.map(data, x)
  const Y = d3.map(data, y)
  const Z = d3.map(data, z)
  const O = d3.map(data, d => d)
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i])
  const D = d3.map(data, defined)

  // Compute default domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X)
  if (yDomain === undefined) yDomain = d3.extent(Y)
  if (zDomain === undefined) zDomain = Z
  zDomain = new d3.InternSet(zDomain)

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]))

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange)
  const yScale = yType(yDomain, yRange)

  const xAxis = d3
    .axisBottom(xScale)
    .ticks(width / 80)
    .tickSizeOuter(0)
  const yAxis = d3.axisLeft(yScale).ticks(height / 60)

  // Compute titles.
  const T =
    title === undefined ? Z : title === null ? null : d3.map(data, title)

  // Construct a line generator.
  const line = type =>
    d3
      .line()
      .defined(i => D[i])
      .curve(type)
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]))

  const line2 = d3
    .line()
    .curve(d3.curveStep)
    .defined(i => D[i])
    .x(i => xScale(X[i]))
    .y(i => yScale(Y[i]))
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .on("pointerenter", pointerentered)
    .on("pointermove", pointermoved)
    .on("pointerleave", pointerleft)

  svg
    .append("g")
    .attr(
      "transform",
      `translate(0,${(height - marginBottom + marginTop) / 2})`
    )
    .call(xAxis)

  svg
    .append("g")
    .attr("transform", `translate(${(width - marginLeft) / 2},0)`)
    .call(yAxis)

  const path = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", typeof color === "string" ? color : null)
    .attr("stroke-linecap", strokeLinecap)
    .attr("stroke-linejoin", strokeLinejoin)
    .attr("stroke-width", strokeWidth)
    .attr("stroke-opacity", strokeOpacity)
    .selectAll("path")
    .data(d3.group(I, i => Z[i]))
    .join("path")
    .style("mix-blend-mode", mixBlendMode)
    .attr("stroke", (_, i) => d3.schemeCategory10[i])
    .attr("d", ([d, I]) => {
      console.log(d, line2)
      return line(d.value)(I)
    })

  const dot = svg.append("g").attr("display", "none")

  dot.append("circle").attr("r", 2.5)

  dot
    .append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "middle")
    .attr("y", -8)

  function pointermoved(event) {
    console.log(event)
    const [xm, ym] = d3.pointer(event)
    const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)) // closest point
    path
      .style("stroke", ([z]) => (Z[i] === z ? null : "#ddd"))
      .filter(([z]) => Z[i] === z)
      .raise()
    dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`)
    if (T) dot.select("text").text("插值类型：" + O[i].name.desc)
  }

  function pointerentered() {
    path.style("mix-blend-mode", null).style("stroke", "#ddd")
    dot.attr("display", null)
  }

  function pointerleft() {
    path.style("mix-blend-mode", "multiply").style("stroke", null)
    dot.attr("display", "none")
    svg.node().value = null
    svg.dispatch("input", { bubbles: true })
  }
  const node = Object.assign(svg.node(), { value: null })
  if (id) {
    document.querySelector(id).append(node)
  } else {
    return node
  }
}

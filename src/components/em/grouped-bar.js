import * as d3 from "d3"

export function GroupedBarChart(
  data,
  {
    id,
    keys = [],
    groupKey = "date",
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    marginTop = 30, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 37, // left margin, in pixels
    width = 728, // outer width, in pixels
    height = 310, // outer height, in pixels
    xDomain, // array of x-values
    xRange = [
      marginLeft,
      data.length > 10
        ? (data.length / 10) * (width - marginRight)
        : width - marginRight
    ], // [xmin, xmax]
    xPadding = 0.65, // amount of x-range to reserve to separate groups
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [ymin, ymax]
    zDomain, // array of z-values
    y2
  } = {}
) {
  const X = d3.map(data, x)
  const Y = d3.map(data, y2)
  const Z = d3.map(data, z)
  console.log(Y)

  if (xDomain === undefined) xDomain = X
  if (zDomain === undefined) zDomain = Z
  // 最大的值
  const yMax = d3.max(data, d => d3.max(keys, key => d[key]))
  xDomain = new d3.InternSet(xDomain)
  yDomain = [0, yMax]
  zDomain = new d3.InternSet(zDomain)
  const y2Domain = [0, d3.max(Y)]

  const I = d3.range(X.length)

  const color = d3.scaleOrdinal().range(["#FF8B7B", "#877BF4"])
  const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding)
  const yScale = yType(yDomain, yRange).nice()
  // 曲线
  const y2Scale = yType(y2Domain, yRange).nice()
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0)

  const yAxis = d3
    .axisLeft(yScale)
    .ticks(5)
    .tickFormat(d => {
      return yMax > 10e3 ? d / 10e3 + "万" : d
    })
  const y2Axis = d3
    .axisRight(y2Scale)
    .tickValues([0, 1])
    .tickFormat(d3.format(".0%"))
    .tickSize(0)

  const line = d3
    .line()
    .defined(i => Y[i])
    .curve(d3.curveLinear)
    .x(i => xScale(X[i]) + xScale.bandwidth() / 2)
    .y(i => y2Scale(Y[i]))
  const x1 = d3
    .scaleBand()
    .domain(keys)
    .rangeRound([0, xScale.bandwidth()])
    .padding(0.25)

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .style("z-index", -1)
    .style("position", "absolute")

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
  svg
    .append("g")
    .attr("transform", `translate(${width - marginRight},0)`)
    .call(y2Axis)
    .call(g => g.select(".domain").remove())

  // 交互
  const tooltip = d3
    .create("div")
    .attr("class", "d3-gmv-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
  // .text("a simple tooltip")
  const bar = svg.append("g").attr("display", "none")
  bar
    .append("rect")
    .attr("height", height - marginTop - marginBottom)
    .attr("width", 30)

  // x-滚轮
  const overwidth =
    data.length > 10
      ? (data.length / 10) * (width - marginRight)
      : width - marginRight
  const parent = d3.create("div")
  const node = Object.assign(svg.node(), { value: null })
  if (id) {
    const root = document.querySelector(id)
    root.append(node)
    const scroll = parent
      .append("div")
      .attr("class", "scroll-bar")
      .style("overflow-x", data.length > 10 ? "scroll" : "none")
      .style("-webkit-overflow-scrolling", "touch")
      .on("touch", function (event) {
        console.log(event)
      })
    const p = scroll
      .append("svg")
      .attr("width", overwidth)
      .attr("height", height)
      .style("display", "block")
      .style("z-index", 1)
      .on("mouseover", function (event) {
        tooltip.style("visibility", "visible")
        bar.attr("display", "block").attr("fill", "#F5F4FF")
      })
      .on("mousemove", function (event) {
        const el = document.querySelector(".scroll-bar")
        const [xm, ym] = d3.pointer(event)
        const i = d3.least(I, i =>
          Math.hypot(xScale(X[i]) - xm, yScale(Y[i] ?? 0) - ym)
        ) // closest point
        console.log(data[i][keys[1]])
        bar
          .transition()
          .duration(100)
          .attr(
            "transform",
            `translate(${xScale(X[i]) - el.scrollLeft}, ${marginTop})`
          )
        tooltip.html(`
          <p><i class="d3-gmv-tooltip-target"></i> <span class="d3-gmv-tooltip-title">目标GMV</span> <span>${
            data[i][keys[0]]
          }</span></p>
          <p><i class="d3-gmv-tooltip-real"></i> <span class="d3-gmv-tooltip-title">实际GMV</span> <span>${
            data[i][keys[1]]
          }</span></p>
          <p><i class="d3-gmv-tooltip-line"></i> <span class="d3-gmv-tooltip-title">完成率</span> <span>${y2(
            data[i] || ""
          )}</span></p>`)
        tooltip
          .transition()
          .duration(90)
          .style(
            "transform",
            `translate(${xScale(X[i]) - el.scrollLeft + 50}px, ${
              -6 * marginTop
            }px)`
          )
      })
      .on("mouseout", function (event) {
        bar.attr("display", "none")
        tooltip.style("visibility", "hidden")
      })
      .call(svg =>
        svg
          .append("g")
          .attr("transform", `translate(0,${height - marginBottom})`)
          .call(xAxis)
      )

    p.append("path")
      .attr("fill", "none")
      .attr("stroke", "#BAB4EF")
      .attr("stroke-width", "1.5px")
      .attr("filter", "drop-shadow(2px 2px 4px rgba(138, 128, 234, 0.2)")
      .attr("d", line(I))

    p.append("g")
      .selectAll("g")
      .data(data)

      .join("g")
      .attr("transform", d => `translate(${xScale(d[groupKey])},0)`)
      .selectAll("rect")
      .data(d => {
        let allVals = []
        let desiredKeys = keys
        desiredKeys.forEach(dKey => {
          let val = {
            key: dKey,
            value: d[dKey]
          }
          allVals.push(val)
        })
        return allVals
      })

      .join("rect")
      .transition()
      .duration(800)

      .attr("x", d => x1(d.key))
      .attr("y", d => yScale(d.value))
      .attr("rx", "3")
      .attr("width", x1.bandwidth())
      .attr("height", d => yScale(0) - yScale(d.value))
      .attr("fill", d => color(d.key))
      .attr("opacity", 0.7)

    root.append(scroll.node())
    root.append(tooltip.node())
  } else {
    return node
  }
}

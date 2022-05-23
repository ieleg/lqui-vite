import * as d3 from "d3"

export function BarChart(
  data,
  {
    id,
    width = 400,
    height = 400,
    margin = [20, 30, 10, 28], // 画布margin 上右下左
    miniMargin = [0, 30, 0, 28], // 画布margin 上右下左
    mainHeight = 300,
    miniHeight = height -
      mainHeight -
      margin[0] -
      margin[3] -
      miniMargin[0] -
      miniMargin[3],
    mainWidth = width - margin[1] - margin[3],
    xRange = [0, mainWidth], // 从左往右 -去margin
    yRange = [mainHeight - margin[0], margin[2]], // 从下往上 -去margin
    miniyRange = [miniMargin[2], miniHeight - miniMargin[0]], // 从下往上 -去margin
    xPadding = 0.08,
    xScaleType = d3.scaleBand,
    yScaleType = d3.scaleLinear,
    x = d => d.x,
    y = d => d.y,
    color = "#7783d3"
  }
) {
  const minimapPositionTranslate =
    "" +
    miniMargin[3] +
    "," +
    parseFloat(margin[0] + mainHeight + margin[2] + miniMargin[0])
  // const mainWidth = width - margin[1] - margin[3]
  const X = d3.map(data, x)
  const Y = d3.map(data, y)
  const xDomain = new d3.InternSet(X)
  const I = d3.range(X.length).filter(i => xDomain.has(X[i]))
  const xScale = xScaleType().domain(X).range(xRange).padding(xPadding)
  const xScaleCopy = xScale.copy()
  const yScale = yScaleType()
    .domain([0, d3.max(Y)])
    .range(yRange)
    .nice()
  const x_time = d3
    .scaleTime()
    .domain(d3.extent(X).map(item => new Date(item)))
    .range(xRange)
    .nice()
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d => d3.timeFormat("%Y-%m")(new Date(d)))
    .tickSizeOuter(0)
  const yAxis = d3.axisLeft(yScale).tickSizeOuter(0)
  // mini area
  const miniXScale = d3
    .scaleBand()
    .domain(X)
    .range([0, mainWidth])
    .padding(xPadding)
  const miniYScale = d3
    .scaleLinear()
    .domain([0, d3.max(Y)])
    .range(miniyRange)
  const mainXZoom = d3
    .scaleLinear()
    .range([0, mainWidth])
    .domain([0, mainWidth])

  function update(startIndex, endIndex) {
    const transform =
      xScale.domain().length < 6
        ? "translate(0,0)rotate(0)"
        : "translate(15,10)rotate(30)"
    // d3.selectAll(".bars rect")
    //   .data(d3.range(startIndex, endIndex-1))
    //   // .join("rect")
    //   .attr("x", i => xScale(X[i]))
    //   .attr("y", i => yScale(Y[i]))
    //   .attr("height", i => yScale(0) - yScale(Y[i]))
    //   .attr("width", xScale.bandwidth())
    //   .attr("fill", color)
    barArea
      .selectAll("rect")
      // .transition().delay(100)
      // .ease(d3.easeLinear)
      .data(d3.range(startIndex, endIndex))
      .join(
        enter => enter.append("rect"),
        update => update,
        exit => exit.remove()
      )
      .attr("x", i => xScale(X[i]))
      .attr("y", i => yScale(Y[i]))
      .attr("height", i => yScale(0) - yScale(Y[i]))
      .attr("width", xScale.bandwidth())
      .attr("fill", color)
      // .attr("x", i => {
      //   return x_time(new Date(X[i])) - xScale.bandwidth() / 2
      // })
      // .attr("y", i => yScale(Y[i]))
      // .attr("height", i => yScale(0) - yScale(Y[i]))
      // .attr("width", xScale.bandwidth())
      .on("mouseover", function (e, d, i) {
        tooltip.style("visibility", "visible")
        tooltip.select(".tooltip-title").text(`x:${X[d]} y: ${Y[d]}`)
        // .append(tooltipSvg)

        d3.select(this).transition().attr("fill", "#000000")
      })
      .on("mousemove", function (e) {
        tooltip.attr(
          "transform",
          `translate(${e.offsetX - width + 10}, ${e.offsetY - height / 2})`
        )
      })
      .on("mouseout", function (e) {
        tooltip.style("visibility", "hidden")
        d3.select(this).transition().attr("fill", color)
      })
    svg
      .selectAll(".x-axis")
      .call(xAxis)
      .selectAll(".tick text")
      .transition()
      .duration(300)
      .attr("transform", transform)
    // .attr("fill", 'red')
  }
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

    .on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("touchend.zoom", null)
  const barArea = svg
    .append("g")
    .attr("class", "bars")
    .attr("transform", `translate(${margin[3]}, ${margin[0]})`)
    .attr("clip-path", "url(#clip-th)")
    .attr("fill", color)
  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [mainWidth, miniHeight + 1]
    ])
    .on("brush", brushmove)
  function brushmove(event, d) {
    // const extentX = [0, 200]
    const extentX = event.selection
    // const xDate = d.map(item => d3.timeFormat('%Y-%M')(item))
    const selected = miniXScale.domain().filter(i => {
      return (
        extentX[0] - miniXScale.bandwidth() + 1e-2 <= miniXScale(i) &&
        miniXScale(i) <= extentX[1] - 1e-2
      )
    })
    const xDate = []
    if (selected.length > 1) {
      xDate.push(...[selected[0], selected[selected.length - 1]])
    } else {
      xDate.push(...[selected[0], selected[0]])
    }
    console.log(event, xDate)
    d3.select(".miniGroup")
      .selectAll("rect")
      .style("fill", i => {
        return ~selected.indexOf(X[i]) ? "red" : "blue"
      })
    let originalRange = mainXZoom.range()
    const startIndex = xScaleCopy.domain().indexOf(xDate[0])
    const endIndex = xScaleCopy.domain().indexOf(xDate[1])
    xScale.domain(xScaleCopy.domain().slice(startIndex, endIndex))
    // yScale.domain(xScaleCopy.domain().slice(startIndex, endIndex+1))

    d3.select(".x-axis")
      .transition()
      .duration(100)
      .ease(d3.easeLinear)
      .call(xAxis)

    console.log(xScaleCopy.domain().slice(startIndex, endIndex))
    update(startIndex, endIndex)
  }

  const miniGroup = svg
    .append("g")
    .attr("class", "miniGroup")
    .attr("transform", "translate(" + minimapPositionTranslate + ")")

  const brushGroup = svg
    .append("g")
    .attr("class", "brushGroup")
    .attr("transform", "translate(" + minimapPositionTranslate + ")")
    .append("g")
    .attr("class", "brush")
    .call(brush)
  brushGroup.selectAll("rect").attr("width", mainWidth)
  brushGroup
    .select(".overlay")
    .each(d => {
      return (d.type = "selection")
    })
    .on("mousedown touchstart", brushcenter)
  const miniBars = miniGroup.selectAll(".mini-bar").data(I)
  function brushcenter(event, node) {
    let selection = d3.brushSelection(brushGroup.node()),
      size = selection[1] - selection[0],
      range = miniXScale.range(),
      cx = event.offsetX,
      x0 = cx - size / 2,
      x1 = cx + size / 2,
      y1 = d3.max(range) + miniXScale.bandwidth(),
      pos = x1 > y1 ? [y1 - size, y1] : x0 < 0 ? [0, size] : [x0, x1]
    brushGroup.call(brush.move, pos)
  }
  miniBars
    .enter()
    .append("rect")
    .attr("class", "ddbar")
    .attr("x", i => miniXScale(X[i]))
    .attr("y", i => miniHeight - miniYScale(Y[i]))
    .attr("width", miniXScale.bandwidth())
    .attr("height", i => miniYScale(Y[i]))
    .style("fill", "grey")

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(28,${mainHeight})`)
    .attr("clip-path", "url(#clip-th)")
    .call(xAxis)
    .selectAll(".tick text")
    .attr("transform", "translate(0,10)rotate(30)")
    // .style("text-anchor", "end")
    .style("font-size", 10)
  svg
    .append("g")
    .attr("transform", `translate(${margin[3]})`)
    .call(yAxis)
    .call(g =>
      g
        .selectAll(".tick line")
        .attr("x2", 0)
        .clone()
        .attr("x2", width - margin[1] - margin[3])
        .attr("stroke-opacity", 0.1)
    )
    .selectAll(".domain")
    .style("opacity", 0)
  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip-th")
    .append("rect")
    .attr("width", mainWidth)
    .attr("height", mainHeight)
  // const bar = svg
  //   .append("g")
  //   .attr("class", "bars")
  //   .attr("transform", `translate(${margin[3]}, ${margin[0]})`)
  //   .attr("clip-path", "url(#clip-th)")
  //   .attr("fill", color)
  //   .selectAll("rect")
  //   .data(I, d => d)
  //   .join(
  //     enter  => enter.append('rect'),
  //     update => update,
  //     exit => exit.remove()
  //   )
  //   // .attr("x", i => {
  //   //   return x_time(new Date(X[i])) - xScale.bandwidth() / 2
  //   // })
  //   // .attr("y", i => yScale(Y[i]))
  //   // .attr("height", i => yScale(0) - yScale(Y[i]))
  //   // .attr("width", xScale.bandwidth())
  //   .on("mouseover", function (e, d, i) {
  //     tooltip.style("visibility", "visible")
  //     tooltip.select(".tooltip-title").text(`x:${X[d]} y: ${Y[d]}`)
  //     // .append(tooltipSvg)

  //     d3.select(this).transition().attr("fill", "#000000")
  //   })
  //   .on("mousemove", function (e) {
  //     tooltip.attr(
  //       "transform",
  //       `translate(${e.offsetX - width + 10}, ${e.offsetY - height / 2})`
  //     )
  //   })
  //   .on("mouseout", function (e) {
  //     tooltip.style("visibility", "hidden")
  //     d3.select(this).transition().attr("fill", color)
  //   })

  // tooltip
  const txScale = d3
    .scaleUtc()
    .range([0, 160])
    .domain(d3.extent(X).map(item => new Date(item)))
    .nice()
  const txAxis = d3
    .axisBottom(txScale)
    .ticks(2)
    // .tickFormat(d3.timeFormat("%Y-%m"))
    .tickSizeOuter(0)
  const tyScale = yScale.copy()
  tyScale.range([170, 30])
  const tyAxis = d3.axisLeft(tyScale).tickSizeOuter(0)
  const tooltip = d3
    .create("svg")
    .attr("width", 200)
    .attr("height", 200)
    .attr("viewBox", [0, 0, 200, 200])
    .attr("style", "border: 1px solid #000")
    .attr("class", "d3-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(250,250,251,.6)")
  const line = d3
    .line()
    .curve(d3.curveBasis)
    .x(i => txScale(new Date(X[i])))
    .y(i => tyScale(Y[i]))
  tooltip
  tooltip.append("g").attr("transform", "translate(30)").call(tyAxis)
  tooltip.append("g").attr("transform", "translate(30, 170)").call(txAxis)
  tooltip
    .append("g")
    .append("text")
    .attr("class", "tooltip-title")
    .attr("transform", "translate(100, 50)")
    .attr("text-anchor", "middle")

  tooltip
    .append("g")
    .attr("transform", "translate(30)")
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("d", line(d3.range(X.length)))
  const node = Object.assign(svg.node(), { value: null })
  // document.body.append(tooltip.node())

  if (id) {
    document.querySelector(id).append(node)
    document.querySelector(id).append(tooltip.node())

    brushGroup.call(brush.move, [mainWidth / 3, mainWidth])
  } else {
    return node
  }
}

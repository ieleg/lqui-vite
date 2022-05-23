import * as d3 from "d3"

export const BarChart = (
  data,
  {
    id,
    width = 400,
    height = 280,
    margin = [40, 40, 40, 28], // 画布margin 上右下左
    xRange = [margin[3], width - margin[1]], // 从左往右 -去margin
    yRange = [height - margin[0], margin[2]], // 从下往上 -去margin
    xPadding = 0.1,
    xScaleType = d3.scaleBand,
    yScaleType = d3.scaleLinear,
    x = d => d.x,
    y = d => d.y,
    color = "#7783d3"
  }
) => {
  let k = 1
  const X = d3.map(data, x)
  const Y = d3.map(data, y)
  const xDomain = new d3.InternSet(X)
  const I = d3.range(X.length).filter(i => xDomain.has(X[i]))
  const xScale = xScaleType().domain(X).range(xRange).padding(xPadding)
  const yScale = yScaleType()
    .domain([0, d3.max(Y)])
    .range(yRange)
    .nice()
  const x_time = d3
    .scaleTime()
    .domain(d3.extent(X).map(item => new Date(item)))
    .range(xRange)
    .nice()
  console.log(12, x_time.ticks(2))

  console.log(d3.ticks(...d3.extent(xScale.domain()), width / 50))

  const xAxis = d3
    .axisBottom(x_time)
    .tickFormat(d3.timeFormat("%Y-%m"))
    // .tickValues(d3.timeDay.range(new Date(2015, 0, 2), new Date(2015, 0, 8), 2))
    .tickSizeOuter(0)
  const yAxis = d3.axisLeft(yScale).tickSizeOuter(0)
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .call(zoom)
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height - margin[2]})`)
    .call(xAxis)
    .selectAll(".tick text")
    .attr("transform", "translate(15,10)rotate(30)")
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
        .attr("stroke-opacity", 0.2)
    )
    .selectAll(".domain")
    .style("opacity", 0)
  const bar = svg
    .append("g")
    .attr("class", "bars")
    .attr("fill", color)
    .selectAll("rect")
    .data(I)
    .join("rect")
    .attr("x", i => {
      return x_time(new Date(X[i])) - xScale.bandwidth() / 2
    })
    .attr("y", i => yScale(Y[i]))
    .attr("height", i => yScale(0) - yScale(Y[i]))
    .attr("width", xScale.bandwidth())
    .on("mouseover", function (e, d, i) {
      tooltip
        .html(`<div>y: ${Y[d]}</div><div>x: ${X[d]}</div>`)
        .style("visibility", "visible")
      d3.select(this).transition().attr("fill", "#000000")
    })
    .on("mousemove", function (e) {
      tooltip
        .style("top", e.pageY - 10 + "px")
        .style("left", e.pageX + 10 + "px")
    })
    .on("mouseout", function (e) {
      tooltip.html(``).style("visibility", "hidden")
      d3.select(this).transition().attr("fill", color)
    })
  // svg.selectAll('text')
  // .attr("transform", "translate(-0,20)rotate(-45)")
  // .style("text-anchor", "end")
  // .style("font-size", 12)
  // .style("fill", "#69a3b2")
  function zoom(svg) {
    const extent = [
      [margin[3], margin[0]],
      [width - margin[1], height - margin[0]]
    ]

    svg.call(
      d3
        .zoom()
        .scaleExtent([1, 8])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", zoomed)
    )

    function zoomed(event) {
      console.log(event.transform)
      k = Math.round(event.transform.k)
      x_time.range(
        [margin[3], width - margin[1]].map(d => event.transform.applyX(d))
      )
      xScale.range(
        [margin[3], width - margin[1]].map(d => event.transform.applyX(d))
      )
      svg
        .selectAll(".bars rect")
        .attr("x", i => x_time(new Date(X[i])) - xScale.bandwidth() / 2)
        .attr("width", xScale.bandwidth())
      // xAxis.ticks(width / 50 / event.transform.k)
      const transform =
        event.transform.k > 1.2
          ? "translate(0,0)rotate(0)"
          : "translate(15,10)rotate(30)"
      const ticks = event.transform.k > 3.5 ? 20 : 10
      svg
        .selectAll(".x-axis")
        .call(xAxis.ticks(ticks))
        .selectAll(".tick text")
        .transition()
        .duration(300)
        .attr("transform", transform)
    }
  }
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "d3-bar-tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("padding", "10px")
    .style("background", "rgba(0,0,0,.6)")
    .style("box-shadow", "0px 12px 30px rgba(227, 229, 247, 0.3)")
    .style("border-radius", "4px")
    .style("color", "#fff")
    .style("font-size", "14px")
    .text("a simple tooltip")
  const node = Object.assign(svg.node(), { value: null })
  if (id) {
    document.querySelector(id).append(node)
  } else {
    return node
  }
}

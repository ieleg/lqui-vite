import * as d3 from "d3"
export const render = (
  data,
  {
    id,
    marginTop = 20,
    marginRight = 30,
    marginBottom = 30,
    marginLeft = 40,
    width = 400,
    height = 380,
    x = x => x.month
  }
) => {
  const stack = d3
    .stack()
    .keys(["apples", "bananas", "cherries", "dates"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone)

  const series = stack(data)
  console.log(
    series,
    d3.max(series, d => d3.max(d, _d => d3.max(_d)))
  )

  const X = d3.map(data, x)
  const xScale = d3
    .scaleBand()
    .domain(X)
    .range([0, width - marginLeft - marginRight])
    .padding(0.2)
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y-%m-%d"))
    .tickSizeOuter(0)

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, _d => d3.max(_d)))])
    .range([height - marginTop - marginBottom, 0])
    .nice()

  const yAxis = d3.axisLeft(yScale).tickSizeInner(0).tickSizeOuter(0)
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("text-anchor", "middle")
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(${marginLeft}, ${height - marginBottom})`)
    .call(xAxis)

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${marginLeft}, ${marginTop})`)
    .call(yAxis)

  console.log(series)
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, ${marginTop})`)
    .selectAll("g")
    .data(series)
    .join("g")
    .classed("bar", true)
    .attr("fill", (d, i) => d3.schemeCategory10[i])
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => xScale(d.data.month))
    .attr("y", d => yScale(d[1]))
    .attr("width", xScale.bandwidth())
    .attr(
      "height",
      d => height - marginTop - marginBottom - yScale(d[1] - d[0])
    )
    .on("mouseover", function (e, d, i) {
      const value = d[1] - d[0]
      tooltip.style("visibility", "visible")
      toolTipUpdate(d.data, value)
    })
    .on("mousemove", function (e, d, i) {
      tooltip.attr(
        "transform",
        `translate(${e.offsetX - width + 10}, ${e.offsetY - height / 2})`
      )
    })
    .on("mouseout", function (e, d, i) {
      tooltip.style("visibility", "hidden")
      // tooltip.selectAll('g').transition().remove()
    })
  const t = svg.transition().duration(250)

  //tooptip

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
  const node = Object.assign(svg.node(), { value: null })
  const tyScale = d3.scaleLinear().range([160, 0]).domain([0, 1])
  const tyAxis = d3.axisLeft(tyScale).tickSizeInner(0).tickSizeOuter(0)
  const txScale = d3.scaleBand().domain([0, 1]).range([0, 160]).padding(0.2)
  const txAxis = d3.axisBottom(txScale).tickSizeOuter(0)
  const bar = tooltip
    .append("g")
    .attr("transform", "translate(20, 20)")
    .attr("class", "tooltip-bar")
    .selectAll("rect")
    .data([0, 1, 2, 3])
    .join("rect")
  tooltip
    .append("g")
    .attr("class", "ty-axis")
    .attr("transform", "translate(20, 20)")
    .call(tyAxis)
  tooltip
    .append("g")
    .attr("class", "tx-axis")
    .attr("transform", "translate(20, 180)")
    .call(txAxis)
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
    .attr("stop-color", "red")
    .attr("stop-opacity", 0.9)

  areaGradient
    .append("stop")
    .attr("offset", 0.99)
    .attr("stop-color", "#022859")
    .attr("stop-opacity", 0.6)
  // update
  const toolTipUpdate = (source, value) => {
    const data = Object.entries(source).reduce((pre, next) => {
      if (!isNaN(next[1].toString())) {
        pre.push({
          value: next[1],
          desc: next[0]
        })
      }
      return pre
    }, [])
    console.log(data)
    const X = d3.map(data, d => d.desc)
    const Y = d3.map(data, d => d.value)
    const I = d3.range(data.length)
    tyScale.domain([0, d3.max(Y)])
    txScale.domain(X)
    d3.select(".tx-axis")
      .transition()
      .duration(300)
      .ease(d3.easeLinear)
      .call(txAxis)
    d3.select(".ty-axis")
      .transition()
      .duration(300)
      .ease(d3.easeLinear)
      .call(tyAxis)
    bar
      .selectAll("rect")
      .data(I)
      .join(
        enter =>
          enter.append("rect").call(position, i => txScale(X[i]), tyScale(0)),
        update => update,
        exit => exit.remove()
      )

    function position(rect, x, y) {
      return rect
        .attr("fill", "url(#areaGradient)")

        .attr("opacity", i => (Y[i] === value ? 1 : 0.5))
        .attr("x", x)
        .attr("y", y)
        .attr(
          "height",
          typeof y === "function" ? i => tyScale(0) - y(i) : i => tyScale(0) - y
        )
        .attr("width", txScale.bandwidth())
    }

    bar.transition(2000).call(
      position,
      i => txScale(X[i]),
      i => tyScale(Y[i])
    )
  }

  if (id) {
    document.querySelector(id).append(node)
    document.querySelector(id).append(tooltip.node())
  }
}

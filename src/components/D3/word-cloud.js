import * as d3 from "d3"
import d3Cloud from "d3-cloud"
export const render = (
  data,
  {
    id,
    marginTop = 20,
    marginRight = 30,
    marginBottom = 30,
    marginLeft = 40,
    width = 480,
    height = 600,
    maxLength = 100,
    padding = 2,
    rotate = 0,
    colors = d3.schemeCategory10,
    name = d => d.name
  }
) => {
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("text-anchor", "middle")
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

  const wordsData = data.map((item, index) => {
    let size = 30 - index < 12 ? 12 : 30 - index
    return {
      ...item,
      text: name(item),
      size,
      index
    }
  })

  const g = svg
    .append("g")
    .attr("transform", `translate(${marginLeft},${marginTop})`)

  const cloud = d3Cloud()
    .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
    .words(wordsData)
    .padding(padding)
    .rotate(rotate)
    .spiral("rectangular")
    .fontSize(d => d.size)
    .on("word", ({ size, x, y, rotate, text, index }) => {
      g.append("text")
        .attr("font-size", size)
        .style("fill", colors[index % 10])
        .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
        .text(text)
        .on("mouseover", function (e, d, i) {
          tooltip.html(`<div>${text}</div>`).style("visibility", "visible")
          d3.select(this)
            .transition()
            .attr("fill", "#000000")
            .style("cursor", "default")
            .style("opacity", 0.8)
        })
        .on("mousemove", function (e) {
          tooltip
            .style("top", e.pageY - 10 + "px")
            .style("left", e.pageX + 10 + "px")
        })
        .on("mouseout", function (e) {
          tooltip.html(``).style("visibility", "hidden")
        })
    })

  cloud.start()
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "d3-cloud-tooltip")
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

  const serializedSvg = serialize(node)
  const append = () => {
    if (id) {
      document.querySelector(id).append(node)
    }
  }
  return {
    append,
    savingForSvg: () => downloadFileByBlob(serializedSvg, "test"),
    savingForPng: async () => {
      const rasterizePng = await rasterize(node)
      downloadFileByBlob(rasterizePng, "test2")
    }
  }
  console.log(rasterize(node))
  // setTimeout(async () => {
  //   const ImgUrl = await rasterize(node)
  //   downloadFileByBlob(ImgUrl, 'test')
  // }, 2000);
}
function downloadFileByBlob(blobUrl, filename) {
  const eleLink = document.createElement("a")
  eleLink.download = filename
  eleLink.style.display = "none"
  eleLink.href = URL.createObjectURL(blobUrl)
  document.body.appendChild(eleLink)
  eleLink.click()
  URL.revokeObjectURL(eleLink.href)
  document.body.removeChild(eleLink)
}
// 序列化
function serialize(svg) {
  const xmlns = "http://www.w3.org/2000/xmlns/"
  const xlinkns = "http://www.w3.org/1999/xlink"
  const svgns = "http://www.w3.org/2000/svg"
  svg = svg.cloneNode(true)
  const fragment = window.location.href + "#"
  const walker = document.createTreeWalker(svg, NodeFilter.SHOW_ELEMENT)
  while (walker.nextNode()) {
    for (const attr of walker.currentNode.attributes) {
      if (attr.value.includes(fragment)) {
        attr.value = attr.value.replace(fragment, "#")
      }
    }
  }
  svg.setAttributeNS(xmlns, "xmlns", svgns)
  svg.setAttributeNS(xmlns, "xmlns:xlink", xlinkns)
  const serializer = new window.XMLSerializer()
  const string = serializer.serializeToString(svg)
  return new Blob([string], { type: "image/svg+xml" })
}

// 栅格化
function rasterize(node) {
  let resolve, reject
  const promise = new Promise((y, n) => ((resolve = y), (reject = n)))
  const image = new Image()
  const canvas = document.createElement("canvas")
  image.onerror = reject
  image.onload = () => {
    const rect = node.getBoundingClientRect()
    canvas.height = rect.height
    canvas.width = rect.width
    const context = canvas.getContext("2d")
    context.drawImage(image, 0, 0, rect.width, rect.height)
    context.canvas.toBlob(resolve)
  }
  image.src = URL.createObjectURL(serialize(node))
  console.log(image.src)
  return promise
}

const a = () => {
  let resolve, reject
  const promise = new Promise((ok, no) => {
    ;(resolve = ok), (reject = no)
  })
  let a = 1
  // const promise = new Promise((y, n) => ((resolve = y), (reject = n)))
  setTimeout(() => {
    resolve(222)
  }, 1000)
  return promise
}

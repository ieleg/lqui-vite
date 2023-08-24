// import PSD from "psd.js"
import { RGBA2HexA, toRGBAColor, toRGBAColor1 } from "./color"
import { psdText } from "./mock"
import { readPsd } from 'ag-psd';
import * as fs from 'fs';
import * as path from 'path';
interface PsdShadow {
  color: number[]
  distance: number
  blur: number
  angle: number
}
/**
 * 画布存储可渲染的json数据格式
 */
interface FB {
  [x: string]: any
  type: "group" | "text" | "image"
  width: number
  height: number
  top: number
  left: number
  objects: FB[]
}

interface FBImage {
  [x: string]: any
  src: string
  type: string
  width: number
  height: number
  top: number
  left: number
  opacity: number
}

interface FBData {
  [x: string]: any
}
interface PSD {
  [x: string]: any
  type: "group" | "text" | "image"
  children: PSD[]
}

/**
 * psd解析出来的数据格式
 */
interface Psd {
  children: {
    type: string
    visible: boolean
    opacity: number
    blendingMode: string
    name: string
    left: number
    right: number
    top: number
    bottom: number
    height: number
    width: number
    children: {
      type: string
      visible: boolean
      opacity: number
      blendingMode: string
      name: string
      left: number
      right: number
      top: number
      bottom: number
      height: number
      width: number
      mask: {}
      text: {
        value: string
        font: {
          name: string
          sizes: number[]
          colors: number[][]
          alignment: string[]
        }
        left: number
        top: number
        right: number
        bottom: number
        transform: {
          xx: number
          xy: number
          yx: number
          yy: number
          tx: number
          ty: number
        }
      }
      image: {}
    }[]
  }[]
  document: {
    width: number
    height: number
    resources: {
      layerComps: {
        id: number
        name: string
        capturedInfo: number
      }[]
      guides: any[]
      slices: any[]
    }
  }
}

const STROKE_TYPE = {
  InsF: "inner",
  CtrF: "center",
  OutF: "outer"
}

const fileToBuffer = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(reader.result)
    }
    reader.readAsArrayBuffer(file)
  })
}

export const parse = async (file: File) => {
  const url = URL.createObjectURL(file)
  const psd: Psd = await PSD.fromURL(url)
  URL.revokeObjectURL(url)
  const fb = parsePSD2FB(psd)
  return fb
}
const findLayer = (data: any, psd: any) => {
  return psd.layers.find((layer: any) => layer.name === data.name)
}
// 解析psd文件到fb格式
const parsePSD2FB = async psd => {
  const { children, document: doc } = psd.tree().export()

  const [bgData] = children.slice(-1)
  const fb: FB = {
    backgroundColor: "#fff",
    backgroundImage: "",
    width: doc.width,
    height: doc.height,
    objects: []
  }
  if (["Background", "background", "背景"].includes(bgData.name)) {
    const layer = findLayer(bgData, psd)
    const image = parseImage(bgData, layer)
    fb.backgroundImage = image.src

    children.pop()
  }

  const process = (children: PSD[]) => {
    children.forEach((item: any) => {
      if (item.type === "group" && Array.isArray(item.children)) {
        return process(item.children)
      }

      const layer = findLayer(item, psd)
      if (!layer) return

      const cloud = layer.typeTool
        ? parseText(item, layer)
        : parseImage(item, layer)
      fb.objects.unshift(cloud as never)
    })
  }
  process(children)
  // const process = (psdTrees: PSD[]): FB[] => {
  //   const fb: FB[] = []
  //   for (let i = 0; i < psdTrees.length; i++) {
  //     const item = psdTrees[i]
  //     console.log(item)

  //     if (item.type === "group" && Array.isArray(item.children)) {
  //       const { children, ...y } = item
  //       fb.push({
  //         objects: [
  //           {
  //             type: "i-text",
  //             width: 38,
  //             height: 19,
  //             originX: "left",
  //             originY: "top",
  //             top: 0,
  //             left: 0,
  //             text: "123",
  //             opacity: 1,
  //             textAlign: "center",
  //             fontFamily: "dobeInvisFont",
  //             fontSize: 25,
  //             fill: "#ed1a65ff",
  //             textDecoration: "",
  //             fontWeight: "",
  //             fontStyle: "",
  //             texts: [
  //               {
  //                 text: "1",
  //                 fontSize: 25,
  //                 color: "#651aedff"
  //               },
  //               {
  //                 text: "23",
  //                 fontSize: 25,
  //                 color: "#651aedff"
  //               }
  //             ],
  //             strokes: [],
  //             shadows: [],
  //             angle: 0
  //           },
  //           {
  //             type: "i-text",
  //             originX: "left",
  //             originY: "top",
  //             width: 77,
  //             height: 50,
  //             top: 162,
  //             left: 48,
  //             text: "nihao\r\twoshi",
  //             opacity: 1,
  //             textAlign: "center",
  //             fontFamily: "dobeInvisFont",
  //             fontSize: 25,
  //             fill: "#ed1a65ff",
  //             textDecoration: "",
  //             fontWeight: "",
  //             fontStyle: "",
  //             texts: [
  //               {
  //                 text: "n",
  //                 fontSize: 25,
  //                 color: "#651aedff"
  //               },
  //               {
  //                 text: "ihao\r\twoshi",
  //                 fontSize: 25,
  //                 color: "#651aedff"
  //               }
  //             ],
  //             strokes: [],
  //             shadows: [],
  //             angle: 0
  //           }
  //         ],
  //         type: "group",
  //         visible: true,
  //         originX: "left",
  //         originY: "top",
  //         opacity: 1,
  //         blendingMode: "normal",
  //         name: "组 1",
  //         left: 48,
  //         right: 304,
  //         top: 162,
  //         bottom: 243,
  //         height: 81,
  //         width: 256
  //       })
  //       console.log(fb, "fb")
  //     } else {
  //       const layer = findLayer(item, psd)

  //       const data = layer.typeTool
  //         ? parseText(item, layer)
  //         : parseImage(item, layer)
  //       const fbData: FBData = {
  //         ...data
  //       }
  //       fb.push(fbData)
  //     }
  //   }
  //   return fb
  // }
  // fb.objects = process(children)
  return fb
}

// 解析文字类型
const parseText = (data, layer) => {
  const { objectEffects, typeTool } = layer.adjustments
  const { StyleRun } = typeTool.engineData.EngineDict

  let point = 0
  const texts = StyleRun.RunArray.map((text: any, index: number) => {
    const length = StyleRun.RunLengthArray[index]
    const props: { text: string; fontSize: number; color?: string } = {
      text: data.text.value.substr(point, length),
      fontSize: text.StyleSheet.StyleSheetData.FontSize
    }
    const { FillColor } = text.StyleSheet.StyleSheetData
    if (FillColor) {
      props.color = RGBA2HexA(...toRGBAColor1(FillColor.Values))
    }
    point += length
    return props
  })

  const stroke = {}
  let shadow = {}
  const gradients = []
  // console.log(layer,data.name, "字体效果");
  const { angle } = calcTransform(typeTool.transform)

  if (objectEffects) {
    const { FrFX, DrSh, GrFl } = objectEffects.data

    if (FrFX) {
      stroke.strokeWidth = FrFX["Sz  "].value
      stroke.paintFirst = FrFX['Styl'].value === 'InsF' ? 'fill' : "stroke"
      stroke.stroke = RGBA2HexA(
        FrFX["Clr "]["Rd  "],
        FrFX["Clr "]["Grn "],
        FrFX["Clr "]["Bl  "],
        FrFX.Opct.value / 100
      )
    }

    if (DrSh) {
      shadow = parseShadow(DrSh)
    }

    if (GrFl) {
      gradients.push(parseGradient(GrFl, angle, data.height, data.width))
    }
  }

  const tranY = layer.node.export().text.transform.yy
  const tranX = layer.node.export().text.transform.yx
  const fontSize =
    Math.abs(angle) === 90
      ? data.text.font.sizes[0] * tranX
      : data.text.font.sizes[0] * tranY
  console.log("tranY", data.name, objectEffects)
  return {
    type: "i-text",
    width: data.width,
    height: data.height,
    top: data.top,
    left: data.left,
    text: data.text.value.replace(/\r/g, "\n"),
    opacity: data.opacity,
    textAlign: data.text.font.alignment[0],
    // fontFamily: typeTool
    //   .fonts()
    //   .map((font: string) => font.slice(1).replace('\u0000', '')),
    fontFamily: typeTool.fonts()[0].slice().replace("\u0000", ""),
    fontSize,
    fill: gradients.length
      ? gradients[0]
      : RGBA2HexA(...toRGBAColor(data.text.font.colors[0])),
    textDecoration: StyleRun.RunArray[0].StyleSheet.StyleSheetData.Underline
      ? "underline"
      : "",
    fontWeight: "",
    fontStyle: "",
    texts,
    ...stroke,
    shadow,
    angle,
    styles: [],
    ...parseLeftTop(data.left, data.top, data.height, data.width, angle)
  }
}

// 解析图片类型
const parseImage = (data: any, layer: any) => {
  return {
    src: layer?.image?.toBase64(),
    type: "image",
    width: data.width,
    height: data.height,
    top: data.top,
    left: data.left,
    opacity: data.opacity,
    styles: []
  }
}

const isSupportFontFamily = function (f) {
  if (typeof f != "string") {
    return false
  }
  let h = "Arial"
  if (f.toLowerCase() == h.toLowerCase()) {
    return true
  }
  let e = "a"
  let d = 100
  let a = 100,
    i = 100
  let c = document.createElement("canvas")
  let b = c.getContext("2d")
  c.width = a
  c.height = i
  b.textAlign = "center"
  b.fillStyle = "black"
  b.textBaseline = "middle"
  let g = function (j) {
    b.clearRect(0, 0, a, i)
    b.font = d + "px " + j + ", " + h
    b.fillText(e, a / 2, i / 2)
    let k = b.getImageData(0, 0, a, i).data
    return [].slice.call(k).filter(function (l) {
      return l != 0
    })
  }
  return g(h).join("") !== g(f).join("")
}

function calcTransform({ xx, xy }: { xx: number; xy: number }): {
  scale: number
  angle: number
} {
  /**
   * xx yx tx
   * xy yy ty
   * 0  0  1
   */
  const scale = Math.sqrt(xx * xx + xy * xy)
  const angle = (Math.asin(xy / scale) * 180) / Math.PI
  return { scale, angle }
}

;[
  {
    color: [0, 0, 0, 0.35],
    distance: 3,
    blur: 7,
    angle: 90
  }
]
// 将psd的投影转换为fabric的shadow
const parseShadow = DrSh => {
  const color = RGBA2HexA(
    DrSh["Clr "]["Rd  "],
    DrSh["Clr "]["Grn "],
    DrSh["Clr "]["Bl  "],
    DrSh.Opct.value / 100
  )
  const blur = DrSh.blur.value

  return {
    blur,color,
    ...getOffestByAngle(DrSh.lagl.value, DrSh.Dstn.value),
  }
}

const getOffestByAngle = (angle: number, distance: number) => {
  const offsetX = Math.cos(angle) * distance
  const offsetY = Math.sin(angle) * distance
  return { offsetX, offsetY }
}

const parseLeftTop = (
  left: number,
  top: number,
  height: number,
  width: number,
  angel: number
) => {
  if (Math.abs(angel) === 90) {
    return {
      left,
      top: top + height
    }
  }
  return {
    left,
    top
  }
}

// 将Grfl 转换为fabric的fill的Gradient类型
const parseGradient = (
  data: any,
  angel: number,
  height: number,
  width: number
) => {
  const { Clrs, Trns, Angl, Type } = data.Grad
  const colorStops = Clrs.map((item: any) => {
    const Clr = item["Clr "]
    const color = RGBA2HexA(
      ...toRGBAColor([Clr["Rd  "], Clr["Grn "], Clr["Bl  "]])
    )
    const middlePoint = item.Mdpn / 100
    return {
      offset: item.Lctn / 4096,
      color
    }
  })
  const offsetX = data.Ofst.Hrzn.value / 100
  const offsetY = data.Ofst.Vrtc.value / 100
  console.log(parseCoords(angel, height, width))

  return {
    colorStops,
    offsetX,
    offsetY,
    type: "linear",
    coords: parseCoords(angel, height, width)
  }
}

const parseCoords = (angel: number, height: number, width: number) => {
  const cos = Math.cos((angel * Math.PI) / 180) * height
  const sin = Math.sin((angel * Math.PI) / 180) * width
  if (angel > 90) {
    return {
      x1: 0,
      y1: 0,
      x2: sin,
      y2: cos
    }
  } else {
    return {
      x1: sin,
      y1: cos,
      x2: 0,
      y2: 0
    }
  }
}

// 内外描边可以通过fill和stroke绘制顺序来实现
const parseStroke = () => {}

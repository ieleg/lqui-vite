// import PSD from "psd.js"
import { RGBA2HexA, toRGBAColor, toRGBAColor1 } from "./color"
import { psdText } from "./mock"
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
  InsF: 'inner',
  CtrF: 'center',
  OutF: 'outer',
};

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
  console.log(psd, "psd")

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
    console.log(bgData, layer, "background")

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
      console.log(layer);

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
  console.log(fb)

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

  const strokes = []
  const shadows = []
  if (objectEffects) {
    console.log(objectEffects, "objectEffects");
    
    const { FrFX, DrSh } = objectEffects.data

    if (FrFX) {
      strokes.push({
        type: Reflect.get(STROKE_TYPE, FrFX.Styl.value),
        width: FrFX["Sz  "].value,
        color: [
          FrFX["Clr "]["Rd  "],
          FrFX["Clr "]["Grn "],
          FrFX["Clr "]["Bl  "],
          FrFX.Opct.value / 100
        ]
      })
    }

    if (DrSh) {
      shadows.push({
        color: [
          DrSh["Clr "]["Rd  "],
          DrSh["Clr "]["Grn "],
          DrSh["Clr "]["Bl  "],
          DrSh.Opct.value / 100
        ],
        distance: DrSh.Dstn.value,
        blur: DrSh.blur.value,
        angle: DrSh.lagl.value
      })
    }
  }

  const { angle } = calcTransform(typeTool.transform)

  return {
    type: "i-text",
    width: data.width,
    height: data.height,
    top: data.top,
    left: data.left,
    text: data.text.value,
    opacity: data.opacity,
    textAlign: data.text.font.alignment[0],
    // fontFamily: typeTool
    //   .fonts()
    //   .map((font: string) => font.slice(1).replace('\u0000', '')),
    fontFamily: typeTool.fonts()[0].slice().replace("\u0000", ""),
    fontSize: data.text.font.sizes[0],
    fill: RGBA2HexA(...toRGBAColor(data.text.font.colors[0])),
    textDecoration: StyleRun.RunArray[0].StyleSheet.StyleSheetData.Underline
      ? "underline"
      : "",
    fontWeight: "",
    fontStyle: "",
    texts,
    strokes,
    shadow: parseShadow(shadows?.[0]),
    angle
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
    opacity: data.opacity
  }
}

var isSupportFontFamily = function (f) {
  if (typeof f != "string") {
    return false
  }
  var h = "Arial"
  if (f.toLowerCase() == h.toLowerCase()) {
    return true
  }
  var e = "a"
  var d = 100
  var a = 100,
    i = 100
  var c = document.createElement("canvas")
  var b = c.getContext("2d")
  c.width = a
  c.height = i
  b.textAlign = "center"
  b.fillStyle = "black"
  b.textBaseline = "middle"
  var g = function (j) {
    b.clearRect(0, 0, a, i)
    b.font = d + "px " + j + ", " + h
    b.fillText(e, a / 2, i / 2)
    var k = b.getImageData(0, 0, a, i).data
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

[
  {
      "color": [
          0,
          0,
          0,
          0.35
      ],
      "distance": 3,
      "blur": 7,
      "angle": 90
  }
]
// 将psd的投影转换为fabric的shadow
const parseShadow = (data: PsdShadow) => {
  if(!data) {
    return null
  }
  return {
    color: RGBA2HexA(...toRGBAColor(data.color)),
    distance: data.distance,
    blur: data.blur,
    angle: data.angle
  }
}
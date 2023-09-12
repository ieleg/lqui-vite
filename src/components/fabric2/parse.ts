// import PSD from "psd.js"
import { RGB2Hex, RGBA2HexA, toRGBAColor, toRGBAColor1 } from "./color"
import { psdText } from "./mock"
import { Layer, LayerTextData, Psd, readPsd } from "ag-psd"
import * as fs from "fs"
import * as path from "path"
import { getAngelByCanvasTransform, getLeftTopByAngel } from "./temp"
import { fabric } from "fabric"

const STROKE_TYPE = {
  InsF: "inner",
  CtrF: "center",
  OutF: "outer"
}

const fileToBuffer = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      resolve(reader.result)
    }
    reader.readAsArrayBuffer(file)
  })
}

const getCanvasAttr = (canvas: HTMLCanvasElement) => {
  if (!canvas) {
    return {}
  }
  const height = canvas.height
  const width = canvas.width
  return {
    height,
    width
  }
}

export const parse = async (file: File) => {
  const buffer = await fileToBuffer(file)
  const res = await readPsd(buffer)
  document.body.appendChild(res.canvas)
  const fb = parsePSD2FB(res)
  return fb
}

const findClipMainLayer = list => {
  for (let i = list.length - 2; i > 0; i--) {
    if (!list[i].clipping) {
      return list[i]
    }
  }
}
// 解析psd文件到fb格式
const parsePSD2FB = async (psd: Psd) => {
  const { height, width } = psd
  const children = psd.children?.reverse() ?? []
  console.log(psd, "psd")

  // const [bgData] = children.slice()
  const fb: FB = {
    // backgroundColor: "#fff",
    backgroundImage: "",
    width,
    height,
    objects: []
  }
  // if (["Background", "background", "背景"].includes(bgData.name)) {
  //   const image = parseImage(bgData)
  //   fb.backgroundImage = image.src
  //   console.log(image, "bgimage");
    
  //   children.pop()
  // }

  const process = (children: Psd[]) => {
    children.forEach(item => {
      if (item.children && item.children.length) {
        return process(item.children)
      }

      const cloud = item.text ? parseText(item) : parseImage(item)
      fb.objects.unshift(cloud as never)
    })
  }
  process(children)
  return fb
}

// 解析文字类型
const parseText = (data: Layer) => {
  const { effects, canvas, left, top } = data
  const { transform, style, text, ...y } = data.text as LayerTextData
  let angle = getAngelByCanvasTransform(transform!)
  const obj: any = {}

  if (effects?.stroke && effects.stroke[0].enabled) {
    const { r, g, b } = effects.stroke[0].color
    const opacity = effects.stroke[0].opacity
    obj.strokes = effects.stroke
    obj.stroke = RGBA2HexA(r, g, b, opacity)
    obj.strokeWidth = effects.stroke[0].size.value
    obj.paintFirst = "fill"
  }
  if(effects?.dropShadow && effects.dropShadow[0].enabled){
    obj.shadows = effects.dropShadow
  }
  if (angle) {
    obj.originX = "center"
    obj.originY = "center"
    Object.assign(
      obj,
      getLeftTopByAngel(angle, canvas!.width, canvas!.height, top!, left!)
    )
  }
  if (style?.fillColor) {
    obj["fill"] = RGB2Hex(style.fillColor)
  }
  console.log(data, data.name)

  return {
    ...getCanvasAttr(canvas!),
    ...y,
    fontFamily: getFontFamily(data),
    fontWeight: getFontWeight(data),
    textAlign: 'center',
    fontSize: style.fontSize * getScaleByCanvasTransform(transform),
    // left: transform[4],
    // top: transform[5],
    text: style?.fontCaps === 2 ? text.toUpperCase() : text,
    angle,
    type: "i-text",
    left,
    top,
    styles: [],
    ...obj
  }
}

const cavas2ImageData = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d")!
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}
function applyMask(data, mask) {
  const maskCtx = mask.canvas.getContext("2d")
  const imgCtx = data.canvas.getContext("2d")
  const y = mask.top - data.top
  const x = mask.left - data.left
  const maskData = maskCtx.getImageData(
    0,
    0,
    mask.canvas.width,
    mask.canvas.height
  )
  const imgData = imgCtx.getImageData(
    x,
    y,
    mask.canvas.width,
    mask.canvas.height
  )
  const flag = 5
  for (let i = 0; i < maskData.data.length; i += 4) {
    if (maskData.data[i] <= flag) {
      imgData.data[i + 3] = 0 // 设置透明度为0
    }

  }
  imgCtx.putImageData(imgData, x, y)
}


// 解析图片类型
const parseImage = (data: Layer) => {
  console.log(data)
  const canvas = data.canvas
  const width = canvas.width
  const height = canvas.height
  const { left, top, imageData, mask, clipping } = data
  const obj = {}
  const img = canvas.toDataURL()
  if(data.effects?.dropShadow && data.effects.dropShadow[0].enabled){
    obj.shadows = data.effects.dropShadow
  }
  if (mask) {
    const canvas = mask.canvas!
    applyMask(data, mask)
    const i = new fabric.Image(data.canvas, {
      ...data,
      // clipPath: new fabric.loadSVGFromString(mask_)
    })
    // path.absolutePositioned = true
    img &&
      Object.assign(obj, {
        // clipPath: path
        // ...mask,
        // ...getCanvasAttr(canvas),
        // src: i
        ...i.toJSON()
      })
    console.log(obj, "obj")
  }
  if (clipping) {
    console.log(data, "clipping")
    Object.assign(obj, {
      globalCompositeOperation: "source-atop",
      clipping: true
      // clipPath: new fabric.Circle({
      //   radius: 50
      // })
    })
  } else {
    obj["dirty "] = true
  }
  return {
    src: canvas.toDataURL(),
    type: "image",
    left,
    top,
    width,
    height,
    ...obj
  }
}

const getFontFamily = (data: Layer) => {
  return data.text?.style?.font?.name
}

const getFontWeight = (data: Layer) => {
  const fontFamily = getFontFamily(data)
  if (!fontFamily) {
    return "normal"
  }
  const isBold = fontFamily?.indexOf("Bold") > -1
  return isBold ? "bold" : "normal"
}

const getScaleByCanvasTransform = (
  transform: [number, number, number, number, number, number]
) => {
  const scale = Math.sqrt(
    transform[0] * transform[0] + transform[1] * transform[1]
  )
  return scale
}

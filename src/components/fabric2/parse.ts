// import PSD from "psd.js"
import { RGB2Hex, RGBA2HexA, toRGBAColor, toRGBAColor1 } from "./color"
import { psdText } from "./mock"
import { Layer, LayerTextData, Psd, readPsd } from 'ag-psd';
import * as fs from 'fs';
import * as path from 'path';
import { getAngelByCanvasTransform, getLeftTopByAngel } from "./temp";




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

const getCanvasAttr = (canvas: HTMLCanvasElement) => {
  if(!canvas) {
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
  document.body.appendChild(res.canvas);
  console.log(buffer, JSON.stringify(res.canvas), 'buffer');

  console.log(res, 'buffer');
  const fb = parsePSD2FB(res)
  return fb
}
// 解析psd文件到fb格式
const parsePSD2FB = async (psd: Psd) => {
  const { height, width} = psd
  const children = psd.children?.reverse() ?? []
  const [bgData] = children.slice(-1)
  const fb: FB = {
    backgroundColor: "#fff",
    backgroundImage: "",
    width,
    height,
    objects: []
  }
  if (["Background", "background", "背景"].includes(bgData.name)) {
    const image = parseImage(bgData)
    fb.backgroundImage = image.src
    children.pop()
  }

  const process = (children: Psd[]) => {
    children.forEach((item) => {
      if (item.children  && item.children.length) {
        return process(item.children)
      }

      const cloud = item.text
        ? parseText(item)
        : parseImage(item)
      fb.objects.unshift(cloud as never)
    })
  }
  process(children)
  return fb
}

// 解析文字类型
const parseText = (data: Layer) => {
  const { effects,canvas, left, top } = data
  const {transform, style,text,...y} = data.text as LayerTextData
  let angle = getAngelByCanvasTransform(transform!)
  console.log(style.fillColor, data);
  const obj: any = {

  }
  console.log( data,data.name, transform, y.left,y.top, 'stroke');

  if(effects?.stroke && effects.stroke[0].enabled) {
    
    const {r,g,b} = effects.stroke[0].color
    const opacity = effects.stroke[0].opacity
    obj.stroke = RGBA2HexA(r,g,b, opacity)
    obj.strokeWidth = effects.stroke[0].size.value
    obj.paintFirst = "fill"
  }
  if(angle) {
    obj.originX = 'center'
    obj.originY = 'center'
    Object.assign(obj,getLeftTopByAngel(angle, canvas!.width, canvas!.height, top!, left!) )
  }
  return {

    ...getCanvasAttr(canvas!),
    ...y,
    fontFamily: getFontFamily(data),
    fontWeight: getFontWeight(data),
    fontSize: style.fontSize * getScaleByCanvasTransform(transform),
    // left: transform[4],
    // top: transform[5],
    text: style?.fontCaps === 2 ? text.toUpperCase() : text,
    fill: RGB2Hex(style.fillColor),
    angle,
    type: "i-text",
    left,top,
    ...obj
  }
}

// 解析图片类型
const parseImage = (data: Layer) => {
  console.log(data);
  const canvas = data.canvas || data.mask?.canvas
  const width = canvas.width
  const height = canvas.height
  return {
    src: canvas.toDataURL(),
    type: "image",
    width,
    height

  }
}

const getFontFamily = (data: Layer) => {
  return data.text?.style?.font?.name
}

const getFontWeight = (data: Layer) => {
  const fontFamily = getFontFamily(data)
  if(!fontFamily) {
    return 'normal'
  }
  const isBold = fontFamily?.indexOf('Bold') > -1
  return isBold ? 'bold' : 'normal'
}


const getScaleByCanvasTransform = (transform: [number,number,number,number,number,number]) => {
  const scale = Math.sqrt(transform[0] * transform[0] + transform[1] * transform[1])
  return scale
}

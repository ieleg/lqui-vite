import { RGBA2HexA } from "./color"

const DrSH: Root = {
  class: {
    name: "",
    id: "DrSh"
  },
  enab: true,
  present: true,
  showInDialog: true,
  "Md  ": {
    type: "BlnM",
    value: "Mltp"
  },
  "Clr ": {
    class: {
      name: "",
      id: "RGBC"
    },
    "Rd  ": 0,
    "Grn ": 0,
    "Bl  ": 0
  },
  Opct: {
    id: "#Prc",
    unit: "Percent",
    value: 50
  },
  uglg: true,
  lagl: {
    id: "#Ang",
    unit: "Angle",
    value: 90
  },
  Dstn: {
    id: "#Pxl",
    unit: "Pixels",
    value: 5
  },
  Ckmt: {
    id: "#Pxl",
    unit: "Pixels",
    value: 0
  },
  blur: {
    id: "#Pxl",
    unit: "Pixels",
    value: 5
  },
  Nose: {
    id: "#Prc",
    unit: "Percent",
    value: 0
  },
  AntA: false,
  TrnS: {
    class: {
      name: "",
      id: "ShpC"
    },
    "Nm  ": "Linear",
    "Crv ": [
      {
        class: {
          name: "",
          id: "CrPt"
        },
        Hrzn: 0,
        Vrtc: 0
      },
      {
        class: {
          name: "",
          id: "CrPt"
        },
        Hrzn: 255,
        Vrtc: 255
      }
    ]
  },
  layerConceals: true
}
export interface Root {
  class: Class
  enab: boolean
  present: boolean
  showInDialog: boolean
  "Md  ": Md
  "Clr ": Clr
  Opct: Opct
  uglg: boolean
  lagl: Lagl
  Dstn: Dstn
  Ckmt: Ckmt
  blur: Blur
  Nose: Nose
  AntA: boolean
  TrnS: TrnS
  layerConceals: boolean
}

export interface Class {
  name: string
  id: string
}

export interface Md {
  type: string
  value: string
}

export interface Clr {
  class: Class2
  "Rd  ": number
  "Grn ": number
  "Bl  ": number
}

export interface Class2 {
  name: string
  id: string
}

export interface Opct {
  id: string
  unit: string
  value: number
}

export interface Lagl {
  id: string
  unit: string
  value: number
}

export interface Dstn {
  id: string
  unit: string
  value: number
}

export interface Ckmt {
  id: string
  unit: string
  value: number
}

export interface Blur {
  id: string
  unit: string
  value: number
}

export interface Nose {
  id: string
  unit: string
  value: number
}

export interface TrnS {
  class: Class3
  "Nm  ": string
  "Crv ": Crv[]
}

export interface Class3 {
  name: string
  id: string
}

export interface Crv {
  class: Class4
  Hrzn: number
  Vrtc: number
}

export interface Class4 {
  name: string
  id: string
}

const shadow = {
  color: "rgba(0,0,0,0.3)",
  blur: 5,
  offsetX: 5,
  offsetY: 5
}

// 将Root结构转化成shadow结构
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

const getOffestByAngle = (angle, distance) => {
  const offsetX = Math.cos(angle) * distance
  const offsetY = Math.sin(angle) * distance
  return { offsetX, offsetY }
}

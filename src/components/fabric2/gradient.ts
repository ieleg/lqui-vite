import { fabric } from "fabric"
export const data = [
  {
    enabled: true,
    present: true,
    showInDialog: true,
    blendMode: "normal",
    opacity: 0.72,
    gradient: {
      type: "solid",
      name: "黑, 白渐变",
      smoothness: 1,
      colorStops: [
        {
          color: {
            r: 3.4771758411079645,
            g: 0,
            b: 0.07869462337112054
          },
          location: 0,
          midpoint: 0.5
        },
        {
          color: {
            r: 255,
            g: 254.99969601631165,
            b: 255
          },
          location: 1,
          midpoint: 0.5
        }
      ],
      opacityStops: [
        {
          opacity: 1,
          location: 0,
          midpoint: 0.5
        },
        {
          opacity: 1,
          location: 1,
          midpoint: 0.5
        }
      ]
    },
    angle: -137,
    type: "linear",
    reverse: false,
    dither: false,
    align: true,
    scale: 1,
    offset: {
      x: 0,
      y: 0
    }
  },
  {
    enabled: true,
    present: true,
    showInDialog: true,
    blendMode: "normal",
    opacity: 1,
    gradient: {
      type: "solid",
      name: "前景色到透明渐变",
      smoothness: 1,
      colorStops: [
        {
          color: {
            r: 255,
            g: 0,
            b: 0
          },
          location: 0,
          midpoint: 0.5
        },
        {
          color: {
            r: 255,
            g: 0,
            b: 0
          },
          location: 1,
          midpoint: 0.5
        }
      ],
      opacityStops: [
        {
          opacity: 1,
          location: 0,
          midpoint: 0.5
        },
        {
          opacity: 0,
          location: 1,
          midpoint: 0.5
        }
      ]
    },
    angle: 90,
    type: "linear",
    reverse: false,
    dither: false,
    align: true,
    scale: 1,
    offset: {
      x: 0,
      y: 0
    }
  },
  {
    enabled: true,
    present: true,
    showInDialog: true,
    blendMode: "normal",
    opacity: 1,
    gradient: {
      type: "solid",
      name: "紫色_02",
      smoothness: 1,
      colorStops: [
        {
          color: {
            r: 18.00781700760126,
            g: 213.9961114525795,
            b: 223.00000190734863
          },
          location: 0,
          midpoint: 0.5
        },
        {
          color: {
            r: 247.00000047683716,
            g: 15.002202987670898,
            b: 255
          },
          location: 1,
          midpoint: 0.5
        }
      ],
      opacityStops: [
        {
          opacity: 1,
          location: 0,
          midpoint: 0.5
        },
        {
          opacity: 1,
          location: 1,
          midpoint: 0.5
        }
      ]
    },
    angle: 90,
    type: "linear",
    reverse: false,
    dither: false,
    align: true,
    scale: 1,
    offset: {
      x: 0,
      y: 0
    }
  }
]

<template>
  <div>
    <div calss="mainBox">
      <span class="flex gap-1 items-start">
        <img
          draggable="true"
          src="http://i.imgur.com/8rmMZI3.jpg"
          crossorigin="anonymous"
          width="100"
          height="100"
          @dragend="onDragEnd"
        />
        <img
          draggable="true"
          crossorigin="anonymous"
          src="https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80"
          width="100"
          height="100"
          @dragend="onDragEnd"
        />
        <img
          draggable="true"
          src="http://i.imgur.com/q9aLMza.png"
          crossorigin="anonymous"
          width="100"
          height="100"
          @dragend="onDragEnd"
        />
        <img
          draggable="true"
          src="https://learn.g2.com/hs-fs/hubfs/plan%20gif%20marketing%20strategy.gif?width=500&name=plan%20gif%20marketing%20strategy.gif"
          width="100"
          crossorigin="anonymous"
          height="100"
          @dragend="onDragEnd"
        />
        <img
          draggable="true"
          src="https://svgsilh.com/svg/1801287.svg"
          width="100"
          height="100"
          @dragend="onDragEnd"
        />
      </span>
      <input type="file" @change="onChange" ref="inputRef" />
      <button class="border" @click="editorStore.saveCanvas">保存json</button>
      <button class="border ml-2" @click="() => editorStore.loadJson()">
        加载json
      </button>
      <canvas id="c" ref="canvasRef"></canvas>
    </div>
    <div>图层</div>
  </div>
</template>
<script lang="ts" setup>
import { markRaw, onMounted, ref } from "vue"
import { fabric } from "fabric"
import { useEditorStore } from "./store/editor"
import { IMG_SCALE_WIDTH } from "./config"
import PSD from "psd.js"
import { parse } from "./parse"
const editorStore = useEditorStore()
const canvasRef = ref()
const inputRef = ref()
const onDragEnd = event => {
  // console.log(event);

  const img = event.target

  fabric.Image.fromURL(
    img.currentSrc,
    img => {
      if (!img.filters) {
        return
      }
      // img.filters.push(new fabric.Image.filters.Sepia())
      // img.applyFilters()
      img.scaleToWidth(IMG_SCALE_WIDTH)
      img.set(
        "shadow",
        new fabric.Shadow({
          color: "yellow",
          blur: 50,
          offsetX: 5,
          offsetY: 5
        })
      )
      img.set("stroke", "blue")
      editorStore.dragAddItem(event, img)
    },
    { crossOrigin: "anonymous" }
  )

  // const item = new fabric.Image(img, {
  //   name: "xxx",
  //   filters: [new fabric.Image.filters.Sepia()],
  //   crossOrigin: "anonymous",

  // })
  // item.scaleToWidth(IMG_SCALE_WIDTH)
  // editorStore.dragAddItem(event, item)
  // editorStore.add(item)
}

const onChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) {
    return
  }
  const url = URL.createObjectURL(file)

  const psd = await PSD.fromURL(url)
  URL.revokeObjectURL(url)
  const d = psd.tree().export()
  const data = await parse(file)
  console.log(d, "d")
  console.log(data)
  editorStore.loadJson(data)
  inputRef.value.value = ""
}
onMounted(() => {
  const script = document.createElement("script")
  script.src =
    "https://ipfs.filebase.io/ipfs/QmcJ4M2TykYGmvD1k3tauKK8tH8UQw4jU4PB6VbgBWf9Ei"
  document.body.appendChild(script)
  const instance = new fabric.Canvas(canvasRef.value, {
    width: 1000,
    height: 1000
    // backgroundImage: 'http://i.imgur.com/8rmMZI3.jpg'
  })
  editorStore.init(instance)
  const text = new fabric.IText("等宽字体的渐变测试", {
    fontFamily: "monospace",
    left: 100,
    top: 100,
    fill: {
      offsetX: 0,
      offsetY: 0,
      type: "linear",
      gradientUnits: "pixels",
      coords: {
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 100
      },

      colorStops: [
        {
          offset: 0,
          color: "red"
        },
        {
          offset: 1,
          color: "blue"
        }
      ]
    }
  })
  const text2 = new fabric.IText("请输入文字ed1a65ff", {
    fontFamily: "dobeInvisFont",
    fill: "black",
    stroke: "white",
    strokeWidth: 2,
    strokeLineCap: "round",
    left: 200,

    top: 200
  })
  const text4 = new fabric.IText("投影", {
    fontFamily: "dobeInvisFont",
    fill: "black",
    shadow: new fabric.Shadow({
      color: "rgba(0,0,0,0.3)",
      blur: 5,
      offsetX: -5,
      offsetY: 5
    }),
    left: 600,
    top: 200
  })
  const text3 = new fabric.IText("多字号测试", {
    fill: "#ed1a65ff",
    left: 500,
    angle: 80,
    originX: "center",
    originY: "center",
    shadow: new fabric.Shadow({
      color: "rgba(0,0,0,0.3)",
      blur: 5,
      offsetX: 5,
      offsetY: 5
    }),
    top: 300,
    styles: {
      0: {
        0: { fontSize: 16 },
        1: { fontSize: 20 },
        3: { fontSize: 50 }
      }
    }
  })
  const rect = new fabric.Rect({
    top: 30,
    left: 30,
    width: 100,
    height: 60,
    stroke: "red",
    shadow: 'blue 50px -50px 30px',
    fill: "#000"
  })
  const cilcle = new fabric.Circle({
    top: 230,
    left: 130,
    radius: 50,

    fill: "red"
  })
  const group = new fabric.Group([cilcle, text])
  const group2 = new fabric.Group([group, rect], {
    shadow: 'green -50px -50px 3px'
  })

  // cilcle.set({
  //   borderColor: 'red',
  //   cornerColor: 'green',
  //   cornerSize: 6,
  //   transparentCorners: false
  // })
  fabric.Image.fromURL(
    "http://fabricjs.com/assets/pug_small.jpg",
    function (myImg) {
      myImg.scaleToWidth(50)
      myImg.scaleToHeight(50)
      //i create an extra var for to change some image properties
      var img1 = myImg.set({
        left: 0,
        top: 0,
        width: 500,
        height: 500,
        stroke: "red"
      })
      editorStore.add(img1)
    }
  )
  const path = new fabric.Path(
    "M85.6,606.2c-13.2,54.5-3.9,95.7,23.3,130.7c27.2,35-3.1,55.2-25.7,66.1C60.7,814,52.2,821,50.6,836.5c-1.6,15.6,19.5,76.3,29.6,86.4c10.1,10.1,32.7,31.9,47.5,54.5c14.8,22.6,34.2,7.8,34.2,7.8c14,10.9,28,0,28,0c24.9,11.7,39.7-4.7,39.7-4.7c12.4-14.8-14-30.3-14-30.3c-16.3-28.8-28.8-5.4-33.5-11.7s-8.6-7-33.5-35.8c-24.9-28.8,39.7-19.5,62.2-24.9c22.6-5.4,65.4-34.2,65.4-34.2c0,34.2,11.7,28.8,28.8,46.7c17.1,17.9,24.9,29.6,47.5,38.9c22.6,9.3,33.5,7.8,53.7,21c20.2,13.2,62.2,10.9,62.2,10.9c18.7,6.2,36.6,0,36.6,0c45.1,0,26.5-15.6,10.1-36.6c-16.3-21-49-3.1-63.8-13.2c-14.8-10.1-51.4-25.7-70-36.6c-18.7-10.9,0-30.3,0-48.2c0-17.9,14-31.9,14-31.9h72.4c0,0,56-3.9,70.8,26.5c14.8,30.3,37.3,36.6,38.1,52.9c0.8,16.3-13.2,17.9-13.2,17.9c-31.1-8.6-31.9,41.2-31.9,41.2c38.1,50.6,112-21,112-21c85.6-7.8,79.4-133.8,79.4-133.8c17.1-12.4,44.4-45.1,62.2-74.7c17.9-29.6,68.5-52.1,113.6-30.3c45.1,21.8,52.9-14.8,52.9-14.8c15.6,2.3,20.2-17.9,20.2-17.9c20.2-22.6-15.6-28-16.3-84c-0.8-56-47.5-66.1-45.1-82.5c2.3-16.3,49.8-68.5,38.1-63.8c-10.2,4.1-53,25.3-63.7,30.7c-0.4-1.4-1.1-3.4-2.5-6.6c-6.2-14-74.7,30.3-74.7,30.3s-108.5,64.2-129.6,68.9c-21,4.7-18.7-9.3-44.3-7c-25.7,2.3-38.5,4.7-154.1-44.4c-115.6-49-326,29.8-326,29.8s-168.1-267.9-28-383.4C265.8,13,78.4-83.3,32.9,168.8C-12.6,420.9,98.9,551.7,85.6,606.2z",
    { top: 60, left: 100, fill: "red", stroke: "", scaleX: 0.2, scaleY: 0.2 }
  )
  editorStore.add(path)
  fabric.Image.fromURL(
    "data:image/jpeg;base64,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",
    function (myImg) {
      myImg.scaleToWidth(200)
      myImg.scaleToHeight(200)
      // myImg.selectable = false
      // myImg.clipPath = path
      //i create an extra var for to change some image properties
      myImg.set({
        left: 580,
        top: 170,
        stroke: "red"
      })
      console.log(myImg.filters, 'filter');
      
      myImg.filters.push(new fabric.Image.filters.RemoveColor({
        color: "#000",
        distance: 0.4
      }))
      myImg.applyFilters()
      editorStore.add(myImg)
    }, {
      crossOrigin: 'anonymouss'
    }
  )
  const textRight = new fabric.Textbox("右对齐", {
    top: 5,
    left: 200,
    width: 500,
    height: 20,
    textAlign: "right"
  })
  const textSpace = new fabric.Textbox("字体间距", {
    top: 20,
    charSpacing: 1050,
    left: 200
  })
  const textBold = new fabric.Textbox("加粗", {
    top: 60,
    charSpacing: 1050,
    left: 200,
    fontWeight: "bold"
  })
  const textLine = new fabric.Textbox("下划线", {
    top: 60,
    left: 500,
    underline: true
  })

  const textOpacity = new fabric.Textbox("透明都", {
    top: 80,
    left: 800,
    fontSize: 20,
    opacity: 0.5
  })

  const img = new Image()
  img.onload = () => {
    var clipPath = new fabric.Circle({
      radius: 5 * IMG_SCALE_WIDTH,
      originX: "center",
      originY: "center",
      fill: "red"
    })
    const _img = new fabric.Image(img, {
      crossOrigin: "anonymous",
      top: 100,
      left: 600,
      stroke: "blue"
    })
    _img.scaleToWidth(IMG_SCALE_WIDTH)
    _img.clipPath = clipPath
    editorStore.add(_img)
  }
  // img.src =
  //   "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80"
  const circle = new fabric.Circle({
    top: 230,
    left: 630,
    radius: 100,

    fill: "red"
  })
  // circle.clipPath = new fabric.Path('M 0,0 L 0,50 H 50')
  fabric.Image.fromURL(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS87dOWh6uv6a11hrKdBKq9CIXitOl1OVn9HQ&usqp=CAU",
    function (img) {
      img.scale(0.1).set({
        left: 100,
        top: 100,
        angle: -15
      })

      circle.clipPath = img
    }
  )

  editorStore.add(rect)
  // editorStore.add(circle)
  var blue = new fabric.Circle({
    top: 150,
    left: 80,
    radius: 180,
    strokeDashArray: [5, 5],
    stroke: "black",
    strokeWidth: 5,
    fill: "purple",
    globalCompositeOperation: "source-atop"
  })

  var red = new fabric.Rect({
    top: 0,
    left: 0,
    width: 300,
    height: 300,
    strokeDashArray: [5, 5],
    stroke: "black",
    strokeWidth: 5,
    fill: "red",
    rx: 40
  })
  console.log(red.toJSON(), "red")

  editorStore.add(red)
  editorStore.add(blue)
  editorStore.add(textRight)
  editorStore.add(textSpace)
  editorStore.add(textBold)
  editorStore.add(textOpacity)
  editorStore.add(textLine)
  editorStore.add(group2)
  editorStore.add(text2)
  editorStore.add(text3)
  editorStore.add(text4)
  editorStore.addAllEvent()
})
</script>
<style>
* {
  font-family: "Courier New", Courier, monospace;
}
</style>

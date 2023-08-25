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
  <div>
    图层
  </div>
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

  fabric.Image.fromURL(img.currentSrc, (img) => {
    if(!img.filters) {
      return
    }
    // img.filters.push(new fabric.Image.filters.Sepia())
    // img.applyFilters()
    img.scaleToWidth(IMG_SCALE_WIDTH)
    img.set('shadow', new fabric.Shadow({
      color: 'yellow',
      blur: 50,
      offsetX: 5,
      offsetY: 5
    }))
    img.set('stroke', 'blue')
    editorStore.dragAddItem(event, img)
}, {crossOrigin: 'anonymous'})

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
    height: 1000,
    backgroundColor: "#eee"
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
    fill: "#000"
  })
  const cilcle = new fabric.Circle({
    top: 230,
    left: 130,
    radius: 50,
    fill: "red"
  })
  const group = new fabric.Group([cilcle, text])
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
      var img1 = myImg.set({ left: 0, top: 0, width: 500, height: 500, stroke: "red" })
      editorStore.add(img1)
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

  const img = new fabric.Image("https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80", {
    crossOrigin: "anonymous",
    top: 100,
    left: 100,
    width: 100,
    height: 100,
    stroke: 'blue'
  })

  editorStore.add(rect)
  editorStore.add(img)

  editorStore.add(textRight)
  editorStore.add(textSpace)
  editorStore.add(textBold)
  editorStore.add(textOpacity)
  editorStore.add(textLine)
  editorStore.add(group)
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

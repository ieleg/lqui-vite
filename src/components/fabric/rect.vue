<template>
  <div calss="mainBox">
    <span class="flex gap-1 items-start">
      <img
        draggable="true"
        src="http://i.imgur.com/8rmMZI3.jpg"
        width="100"
        height="100"
        @dragend="onDragEnd"
      />
      <img
        draggable="true"
        src="http://i.imgur.com/q9aLMza.png"
        width="100"
        height="100"
        @dragend="onDragEnd"
      />
      <img
        draggable="true"
        src="https://learn.g2.com/hs-fs/hubfs/plan%20gif%20marketing%20strategy.gif?width=500&name=plan%20gif%20marketing%20strategy.gif"
        width="100"
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
    <input type="file" @change="onChange" />
    <button class="border" @click="editorStore.saveCanvas">保存json</button>
    <button class="border ml-2" @click="editorStore.loadJson">加载json</button>
    <canvas id="c" ref="canvasRef"></canvas>
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
const onDragEnd = event => {
  const img = event.target

  const item = new fabric.Image(img, {
    name: "xxx"
  })
  item.scaleToWidth(IMG_SCALE_WIDTH)
  editorStore.dragAddItem(event, item)
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
  const text = new fabric.IText("等宽字体", {
    fontFamily: "monospace",
    left: 100,
    top: 100
  })
  const text2 = new fabric.IText("请输入文字ed1a65ff", {
    fontFamily: "dobeInvisFont",
    fill: "#ed1a65ff",
    left: 200,
    shadow: new fabric.Shadow({
      color: "rgba(0,0,0,0.3)",
      blur: 5,
      offsetX: 5,
      offsetY: 5
    }),
    top: 200
  })
  const rect = new fabric.Rect({
    top: 30,
    left: 30,
    width: 100,
    height: 60,
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
      var img1 = myImg.set({ left: 0, top: 0, width: 500, height: 500 })
      editorStore.add(img1)
    }
  )
  editorStore.add(rect)
  editorStore.add(group)
  editorStore.add(text2)
  editorStore.addAllEvent()
})
</script>
<style>
* {
  font-family: 'Courier New', Courier, monospace;
}
</style>
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

    <canvas id="c" ref="canvasRef"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { markRaw, onMounted, ref } from "vue"
import { fabric } from "fabric"
import { useEditorStore } from "./store/editor"
import { IMG_SCALE_WIDTH } from "./config"
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
onMounted(() => {
  const instance = new fabric.Canvas(canvasRef.value, {
    width: 800,
    height: 600,
    backgroundColor: "#eee"
  })
  editorStore.init(instance)
  const text = new fabric.IText("请输入文字", {
    fontFamily: "Delicious_500",
    left: 100,
    top: 100
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
  // cilcle.set({
  //   borderColor: 'red',
  //   cornerColor: 'green',
  //   cornerSize: 6,
  //   transparentCorners: false
  // })
  if (!editorStore.canvas) {
    return
  }
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
  editorStore.add(cilcle)
  editorStore.add(text)


  editorStore.addAllEvent()
})
</script>

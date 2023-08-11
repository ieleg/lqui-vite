import { fabric } from "fabric"
import { defineStore } from "pinia"
import { markRaw, ref } from "vue"
import { useControlStore } from "./controls"
import { IMG_SCALE_WIDTH } from "../config"
import { useLocalStorage } from "@vueuse/core"
import { str } from "../mock"
function initCenteringGuidelines(canvas) {
  var canvasWidth = canvas.getWidth(),
    canvasHeight = canvas.getHeight(),
    canvasWidthCenter = canvasWidth / 2,
    canvasHeightCenter = canvasHeight / 2,
    canvasWidthCenterMap = {},
    canvasHeightCenterMap = {},
    centerLineMargin = 4,
    centerLineColor = "rgba(255,0,241,0.5)",
    centerLineWidth = 1,
    ctx = canvas.getSelectionContext(),
    viewportTransform

  for (
    var i = canvasWidthCenter - centerLineMargin,
      len = canvasWidthCenter + centerLineMargin;
    i <= len;
    i++
  ) {
    canvasWidthCenterMap[Math.round(i)] = true
  }
  for (
    var i = canvasHeightCenter - centerLineMargin,
      len = canvasHeightCenter + centerLineMargin;
    i <= len;
    i++
  ) {
    canvasHeightCenterMap[Math.round(i)] = true
  }

  function showVerticalCenterLine() {
    showCenterLine(
      canvasWidthCenter + 0.5,
      0,
      canvasWidthCenter + 0.5,
      canvasHeight
    )
  }

  function showHorizontalCenterLine() {
    showCenterLine(
      0,
      canvasHeightCenter + 0.5,
      canvasWidth,
      canvasHeightCenter + 0.5
    )
  }

  function showCenterLine(x1, y1, x2, y2) {
    ctx.save()
    ctx.strokeStyle = centerLineColor
    ctx.lineWidth = centerLineWidth
    ctx.beginPath()
    ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3])
    ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3])
    ctx.stroke()
    ctx.restore()
  }

  var afterRenderActions = [],
    isInVerticalCenter,
    isInHorizontalCenter

  canvas.on("mouse:down", function () {
    viewportTransform = canvas.viewportTransform
  })

  canvas.on("object:moving", function (e) {
    var object = e.target,
      objectCenter = object.getCenterPoint(),
      transform = canvas._currentTransform

    if (!transform) return
    ;(isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap),
      (isInHorizontalCenter =
        Math.round(objectCenter.y) in canvasHeightCenterMap)

    if (isInHorizontalCenter || isInVerticalCenter) {
      object.setPositionByOrigin(
        new fabric.Point(
          isInVerticalCenter ? canvasWidthCenter : objectCenter.x,
          isInHorizontalCenter ? canvasHeightCenter : objectCenter.y
        ),
        "center",
        "center"
      )
    }
  })

  canvas.on("before:render", function () {
    canvas.clearContext(canvas.contextTop)
  })

  canvas.on("after:render", function () {
    if (isInVerticalCenter) {
      showVerticalCenterLine()
    }
    if (isInHorizontalCenter) {
      showHorizontalCenterLine()
    }
  })

  canvas.on("mouse:up", function () {
    // clear these values, to stop drawing guidelines once mouse is up
    isInVerticalCenter = isInHorizontalCenter = null
    canvas.renderAll()
  })
}
function initAligningGuidelines(canvas) {
  var ctx = canvas.getSelectionContext(),
    aligningLineOffset = 5,
    aligningLineMargin = 4,
    aligningLineWidth = 1,
    aligningLineColor = "rgb(0,255,0)",
    viewportTransform,
    zoom = 1

  function drawVerticalLine(coords) {
    drawLine(
      coords.x + 0.5,
      coords.y1 > coords.y2 ? coords.y2 : coords.y1,
      coords.x + 0.5,
      coords.y2 > coords.y1 ? coords.y2 : coords.y1
    )
  }

  function drawHorizontalLine(coords) {
    drawLine(
      coords.x1 > coords.x2 ? coords.x2 : coords.x1,
      coords.y + 0.5,
      coords.x2 > coords.x1 ? coords.x2 : coords.x1,
      coords.y + 0.5
    )
  }

  function drawLine(x1, y1, x2, y2) {
    ctx.save()
    ctx.lineWidth = aligningLineWidth
    ctx.strokeStyle = aligningLineColor
    ctx.beginPath()
    ctx.moveTo(
      (x1 + viewportTransform[4]) * zoom,
      (y1 + viewportTransform[5]) * zoom
    )
    ctx.lineTo(
      (x2 + viewportTransform[4]) * zoom,
      (y2 + viewportTransform[5]) * zoom
    )
    ctx.stroke()
    ctx.restore()
  }

  function isInRange(value1, value2) {
    value1 = Math.round(value1)
    value2 = Math.round(value2)
    for (
      var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin;
      i <= len;
      i++
    ) {
      if (i === value2) {
        return true
      }
    }
    return false
  }

  var verticalLines = [],
    horizontalLines = []

  canvas.on("mouse:down", function () {
    viewportTransform = canvas.viewportTransform
    zoom = canvas.getZoom()
  })

  canvas.on("object:moving", function (e) {
    var activeObject = e.target,
      canvasObjects = canvas.getObjects(),
      activeObjectCenter = activeObject.getCenterPoint(),
      activeObjectLeft = activeObjectCenter.x,
      activeObjectTop = activeObjectCenter.y,
      activeObjectBoundingRect = activeObject.getBoundingRect(),
      activeObjectHeight =
        activeObjectBoundingRect.height / viewportTransform[3],
      activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0],
      horizontalInTheRange = false,
      verticalInTheRange = false,
      transform = canvas._currentTransform

    if (!transform) return

    for (var i = canvasObjects.length; i--; ) {
      if (canvasObjects[i] === activeObject) continue

      var objectCenter = canvasObjects[i].getCenterPoint(),
        objectLeft = objectCenter.x,
        objectTop = objectCenter.y,
        objectBoundingRect = canvasObjects[i].getBoundingRect(),
        objectHeight = objectBoundingRect.height / viewportTransform[3],
        objectWidth = objectBoundingRect.width / viewportTransform[0]

      // snap by the horizontal center line
      if (isInRange(objectLeft, activeObjectLeft)) {
        verticalInTheRange = true
        verticalLines.push({
          x: objectLeft,
          y1:
            objectTop < activeObjectTop
              ? objectTop - objectHeight / 2 - aligningLineOffset
              : objectTop + objectHeight / 2 + aligningLineOffset,
          y2:
            activeObjectTop > objectTop
              ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
              : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
        })
        activeObject.setPositionByOrigin(
          new fabric.Point(objectLeft, activeObjectTop),
          "center",
          "center"
        )
      }

      // snap by the left edge
      if (
        isInRange(
          objectLeft - objectWidth / 2,
          activeObjectLeft - activeObjectWidth / 2
        )
      ) {
        verticalInTheRange = true
        verticalLines.push({
          x: objectLeft - objectWidth / 2,
          y1:
            objectTop < activeObjectTop
              ? objectTop - objectHeight / 2 - aligningLineOffset
              : objectTop + objectHeight / 2 + aligningLineOffset,
          y2:
            activeObjectTop > objectTop
              ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
              : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
        })
        activeObject.setPositionByOrigin(
          new fabric.Point(
            objectLeft - objectWidth / 2 + activeObjectWidth / 2,
            activeObjectTop
          ),
          "center",
          "center"
        )
      }

      // snap by the right edge
      if (
        isInRange(
          objectLeft + objectWidth / 2,
          activeObjectLeft + activeObjectWidth / 2
        )
      ) {
        verticalInTheRange = true
        verticalLines.push({
          x: objectLeft + objectWidth / 2,
          y1:
            objectTop < activeObjectTop
              ? objectTop - objectHeight / 2 - aligningLineOffset
              : objectTop + objectHeight / 2 + aligningLineOffset,
          y2:
            activeObjectTop > objectTop
              ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
              : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
        })
        activeObject.setPositionByOrigin(
          new fabric.Point(
            objectLeft + objectWidth / 2 - activeObjectWidth / 2,
            activeObjectTop
          ),
          "center",
          "center"
        )
      }

      // snap by the vertical center line
      if (isInRange(objectTop, activeObjectTop)) {
        horizontalInTheRange = true
        horizontalLines.push({
          y: objectTop,
          x1:
            objectLeft < activeObjectLeft
              ? objectLeft - objectWidth / 2 - aligningLineOffset
              : objectLeft + objectWidth / 2 + aligningLineOffset,
          x2:
            activeObjectLeft > objectLeft
              ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
              : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
        })
        activeObject.setPositionByOrigin(
          new fabric.Point(activeObjectLeft, objectTop),
          "center",
          "center"
        )
      }

      // snap by the top edge
      if (
        isInRange(
          objectTop - objectHeight / 2,
          activeObjectTop - activeObjectHeight / 2
        )
      ) {
        horizontalInTheRange = true
        horizontalLines.push({
          y: objectTop - objectHeight / 2,
          x1:
            objectLeft < activeObjectLeft
              ? objectLeft - objectWidth / 2 - aligningLineOffset
              : objectLeft + objectWidth / 2 + aligningLineOffset,
          x2:
            activeObjectLeft > objectLeft
              ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
              : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
        })
        activeObject.setPositionByOrigin(
          new fabric.Point(
            activeObjectLeft,
            objectTop - objectHeight / 2 + activeObjectHeight / 2
          ),
          "center",
          "center"
        )
      }

      // snap by the bottom edge
      if (
        isInRange(
          objectTop + objectHeight / 2,
          activeObjectTop + activeObjectHeight / 2
        )
      ) {
        horizontalInTheRange = true
        horizontalLines.push({
          y: objectTop + objectHeight / 2,
          x1:
            objectLeft < activeObjectLeft
              ? objectLeft - objectWidth / 2 - aligningLineOffset
              : objectLeft + objectWidth / 2 + aligningLineOffset,
          x2:
            activeObjectLeft > objectLeft
              ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
              : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
        })
        activeObject.setPositionByOrigin(
          new fabric.Point(
            activeObjectLeft,
            objectTop + objectHeight / 2 - activeObjectHeight / 2
          ),
          "center",
          "center"
        )
      }
    }

    if (!horizontalInTheRange) {
      horizontalLines.length = 0
    }

    if (!verticalInTheRange) {
      verticalLines.length = 0
    }
  })

  canvas.on("before:render", function () {
    canvas.clearContext(canvas.contextTop)
  })

  canvas.on("after:render", function () {
    for (var i = verticalLines.length; i--; ) {
      drawVerticalLine(verticalLines[i])
    }
    for (var i = horizontalLines.length; i--; ) {
      drawHorizontalLine(horizontalLines[i])
    }

    verticalLines.length = horizontalLines.length = 0
  })

  canvas.on("mouse:up", function () {
    verticalLines.length = horizontalLines.length = 0
    canvas.renderAll()
  })
}
const compareTwoFabricObject = (
  obj1?: fabric.Object | null,
  obj2?: fabric.Object | null
) => {
  if (!obj1 || !obj2) {
    return false
  }
  return obj1 === obj2
}
export const useEditorStore = defineStore("editor", () => {
  let canvas: fabric.Canvas
  const canvasRef = ref()
  const init = (canvasInstance: fabric.Canvas) => {
    initAligningGuidelines(canvasInstance)
    initCenteringGuidelines(canvasInstance)
    canvas = canvasInstance
    const controlStore = useControlStore()
  }
  const add = (element: fabric.Object) => {
    canvas.add(element)
  }
  const addEvent = () => {}
  const renderAll = () => {
    canvas?.renderAll()
  }
  const removeAllEvent = () => {
    canvas?.off()
  }
  const addAllEvent = () => {
    if (!canvas) {
      return
    }
    canvas.on("mouse:over", e => {
      const target = e.target
      target?.set({
        borderColor: "red",
        cornerColor: "green",
        hasControls: true,
        hasBorders: true,
        cornerSize: 6,
        transparentCorners: true
      })
      canvas?.requestRenderAll()
    })
    canvas.on("mouse:out", e => {
      const target = e.target
      if (compareTwoFabricObject(target, canvas?.getActiveObject())) {
        return
      }
      target?.set("stroke", "transparent")
      canvas?.requestRenderAll()
    })

    canvas.on("mouse:down", e => {
      const target = e.target
      if (compareTwoFabricObject(target, canvas?.getActiveObject())) {
        target?.set({
          borderColor: "red",
          cornerColor: "green",
          hasControls: true,
          hasBorders: true,
          cornerSize: 6,
          transparentCorners: true
        })
      }
    })
    canvas.on("mouse:up", e => {
      const target = e.target
      if (compareTwoFabricObject(target, canvas?.getActiveObject())) {
        target?.set({
          borderColor: "red",
          cornerColor: "green",
          hasControls: true,
          hasBorders: true,
          cornerSize: 6,
          transparentCorners: true
        })
      }
    })
    canvas.on("object:moving", e => {
      e.target?.set({
        hasBorders: true,
        hasControls: false
      })
    })
    // canvas.on('drop', e => {
    //   console.log(e);
    // })
  }

  const dragAddItem = (event: DragEvent, item: fabric.Object) => {
    const { left, top } = canvas.getSelectionElement().getBoundingClientRect()
    if (event.x < left || event.y < top || item.width === undefined) return

    const point = {
      x: event.x - left,
      y: event.y - top
    }
    const pointerVpt = canvas!.restorePointerVpt(point)
    item.left = pointerVpt.x - IMG_SCALE_WIDTH / 2
    item.top = pointerVpt.y
    add(item)
    canvas!.setActiveObject(item)
    canvas!.renderAll()
  }

  const saveCanvas = () => {
    const json = canvas.toJSON()
    console.log(json)
    const localJson = useLocalStorage("canvas", json)
    localJson.value = json
  }
  const loadJson = (data) => {
    const json = useLocalStorage("canvas", "")
    console.log(data)
    // canvas?.clear()
    canvas.loadFromJSON(JSON.stringify(data), () => {
      const {height, width} = data
      canvas.setHeight(data.height)
      canvas.setWidth(data.width)
      canvas.renderAll()
    })
  }

  const render = (data) => {
    const { objects, ...y} = data
    const instance = new fabric.Canvas(canvasRef.value, {
      ...y
      // backgroundImage: 'http://i.imgur.com/8rmMZI3.jpg'
    })
    canvas = instance
    canvas.loadFromJSON(data, () => {

      canvas.renderAll()
    })
  }
  return {
    // @ts-ignore
    canvas,
    canvasRef,
    loadJson,
    saveCanvas,
    renderAll,
    dragAddItem,
    removeAllEvent,
    addAllEvent,
    add,
    init
  }
})

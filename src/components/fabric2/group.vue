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
// import from './text.class.js'
import { data } from "./gradient"
const editorStore = useEditorStore()
const canvasRef = ref()
const inputRef = ref()

const getLineHeightFromCtx = (ctx, text) => {
  const metrics = ctx.measureText(text)
  console.log(metrics)

  const fontHeight =
    metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
  return fontHeight
}

const getOffsetByAngelDistance = (angle, distance) => {
  const radian = (angle * Math.PI) / 180
  const offsetX = Math.cos(radian) * distance
  const offsetY = Math.sin(radian) * distance
  return {
    offsetX,
    offsetY
  }
}
fabric.Object.prototype._setShadow = function (ctx) {
  if (!this.shadows) {
    return
  }
  console.log(this.shadows)
  const list = this.shadows
  list.forEach(shadow => {
    if (!shadow.enabled) {
      return
    }
    const { r, g, b } = shadow.color
    ctx.shadowColor = `rgb(${r}, ${g}, ${b})`
    ctx.shadowBlur = shadow.size.value
    ctx.shadowOffsetX =
      shadow.distance.value * Math.cos(((180 - shadow.angle) * Math.PI) / 180)
    ctx.shadowOffsetY =
      shadow.distance.value * Math.sin(((180 - shadow.angle) * Math.PI) / 180)
    // ctx.globalAlpha = 1 / list.length
    this.type === "image" ? this._renderFill(ctx) : this._renderTextFill(ctx)

    console.log(shadow.angle, ctx.shadowOffsetX, ctx.shadowOffsetY, "shadow")
  })
}
fabric.Textbox.prototype._renderChar = function (
  method,
  ctx,
  lineIndex,
  charIndex,
  _char,
  left,
  top
) {
  let decl = this._getStyleDeclaration(lineIndex, charIndex),
    fullDecl = this.getCompleteStyleDeclaration(lineIndex, charIndex),
    shouldFill = method === "fillText" && fullDecl.fill,
    shouldStroke = this.strokes && this.strokes.length,
    fillOffsets,
    strokeOffsets

  if (!shouldStroke && !shouldFill) {
    return
  }
  ctx.save()

  shouldFill && (fillOffsets = this._setFillStyles(ctx, fullDecl))
  shouldStroke && (strokeOffsets = this._setStrokeStyles(ctx, fullDecl))

  ctx.font = this._getFontDeclaration(fullDecl)

  if (decl && decl.textBackgroundColor) {
    this._removeShadow(ctx)
  }
  if (decl && decl.deltaY) {
    top += decl.deltaY
  }

  shouldFill &&
    ctx.fillText(_char, left - fillOffsets.offsetX, top - fillOffsets.offsetY)
  if (shouldStroke) {
    // 根据strokes的size排序 线宽的先绘制 窄的后绘制 否则宽的会覆盖窄的
    if (!this.strokes) {
      return
    }
    console.log(this, "this.cacheCanvas");
    
    this.strokes
      .sort((a, b) => b.size.value - a.size.value)
      .slice(0)
      .forEach(stroke => {
        const { r, g, b } = stroke.color
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
        ctx.lineWidth = stroke.size.value
        console.log(ctx.strokeStyle, ctx.lineWidth, "ctx.strokeStyle")
        ctx.filter = "blur(4px)"
        const cacheCtx = this._cacheCanvas.getContext("2d")
        const cacheCanvas = this._cacheCanvas
        const imageData = cacheCtx.getImageData(0, 0, cacheCanvas.width, cacheCanvas.height);
        const data = imageData.data;

        // 应用自定义滤镜
        for (let i = 0; i < data.length; i += 4) {
            // 分别处理红、绿、蓝通道
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // data[i + 3] = 255

        }
        cacheCtx.putImageData(imageData, 0, 0);
        ctx.strokeText(
          _char,
          left - strokeOffsets.offsetX,
          top - strokeOffsets.offsetY
        )
      })
  }
  ctx.restore()
}
fabric.Textbox.prototype.handleFiller = function(ctx, property, filler) {
      var offsetX, offsetY;
      
      if (filler.toLive) {
        if (filler.gradientUnits === 'percentage' || filler.gradientTransform || filler.patternTransform) {
          // need to transform gradient in a pattern.
          // this is a slow process. If you are hitting this codepath, and the object
          // is not using caching, you should consider switching it on.
          // we need a canvas as big as the current object caching canvas.
          offsetX = -this.width / 2;
          offsetY = -this.height / 2;
          ctx.translate(offsetX, offsetY);

          ctx[property] = this._applyPatternGradientTransformText(filler);

          return { offsetX: offsetX, offsetY: offsetY };
        }
        else {
          // is a simple gradient or pattern
          ctx[property] = filler.toLive(ctx, this);
          return this._applyPatternGradientTransform(ctx, filler);
        }
      }
      else {
        // is a color
        ctx[property] = filler;
      }
      // console.log(ctx, property,this.text, 'xxx');

      return { offsetX: 0, offsetY: 0 };
    }
fabric.Textbox.prototype._render = function (ctx) {
  var path = this.path
  path && !path.isNotVisible() && path._render(ctx)
  this._setTextStyles(ctx)
  this._renderTextLinesBackground(ctx)
  this._renderTextDecoration(ctx, "underline")
  this._renderText(ctx)
  console.log(this, "this.fill");
  
  // if(this.fill.data) {
  //   const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
  //   gradient.addColorStop("0", "magenta");
  //   gradient.addColorStop("0.5", "blue");
  //   gradient.addColorStop("1.0", "red");
  //   ctx.fillStyle = gradient;
  //   this._renderText(ctx)

  //   const gradient2 = ctx.createLinearGradient(0, 0, this.width, this.height);
  //   gradient2.addColorStop("0", "rgba(0,0,0,0.5)");
  //   gradient2.addColorStop("0.5", "yellow");
  //   gradient2.addColorStop("1.0", "green");
  //   ctx.fillStyle = gradient2;
  //   this._renderText(ctx)

  // }
  this._renderTextDecoration(ctx, "overline")
  this._renderTextDecoration(ctx, "linethrough")
  console.log(ctx);
  
}

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
    // globalCompositeOperation: 'source-atop',
    fontWeight: 600,
    // strokeWidth: 2,
    // stroke: "blue",
    // paintFirst: 'fill',
    left: 200,
    stroke: "red",
    top: 200
  })
  const text3 = new fabric.Textbox("asdasd", {
    fontFamily: "dobeInvisFont",
    // globalCompositeOperation: 'source-atop',
    fontWeight: 600,
    cacheCanvas: true,
    // shadow: "blue 50px -50px 3px",
    stroke: "red",
    cacheProperties: ["fill", "stroke", "strokeWidth", "shadow"],
    affectStroke: false,
    // fill: {
    //   offsetX: 0,
    //   offsetY: 0,
    //   type: "linear",
    //   gradientUnits: "pixels",
    //   coords: {
    //     x1: 0,
    //     y1: 0,
    //     x2: 100,
    //     y2: 100
    //   },

    //   colorStops: [
    //     {
    //       offset: 0,
    //       color: "red"
    //     },
    //     {
    //       offset: 0,
    //       color: "rgba(0,0,0,0.1)"
    //     }
    //   ]
    // },
    paintFirst: 'fill',
    // shadows: [
    //   {
    //     enabled: true,
    //     present: true,
    //     showInDialog: true,
    //     blendMode: "normal",
    //     color: {
    //       r: 165.00000536441803,
    //       g: 84.76653546094894,
    //       b: 84.76653546094894
    //     },
    //     opacity: 1,
    //     useGlobalLight: false,
    //     angle: 179,
    //     distance: {
    //       value: 75,
    //       units: "Pixels"
    //     },
    //     choke: {
    //       value: 0,
    //       units: "Pixels"
    //     },
    //     size: {
    //       value: 7,
    //       units: "Pixels"
    //     },
    //     noise: 0,
    //     antialiased: false,
    //     contour: {
    //       name: "线性",
    //       curve: [
    //         {
    //           x: 0,
    //           y: 0
    //         },
    //         {
    //           x: 255,
    //           y: 255
    //         }
    //       ]
    //     },
    //     layerConceals: true
    //   },

    //   {
    //     enabled: true,
    //     present: true,
    //     showInDialog: true,
    //     blendMode: "normal",
    //     color: {
    //       r: 0,
    //       g: 0,
    //       b: 0
    //     },
    //     opacity: 1,
    //     useGlobalLight: true,
    //     angle: 90,
    //     distance: {
    //       value: 37,
    //       units: "Pixels"
    //     },
    //     choke: {
    //       value: 0,
    //       units: "Pixels"
    //     },
    //     size: {
    //       value: 7,
    //       units: "Pixels"
    //     },
    //     noise: 0,
    //     antialiased: false,
    //     contour: {
    //       name: "线性",
    //       curve: [
    //         {
    //           x: 0,
    //           y: 0
    //         },
    //         {
    //           x: 255,
    //           y: 255
    //         }
    //       ]
    //     },
    //     layerConceals: true
    //   }
    // ],
    strokes: [
      {
        enabled: true,
        position: "outside",
        fillType: "color",
        blendMode: "normal",
        opacity: 1,
        size: {
          value: 1,
          units: "Pixels"
        },
        present: true,
        showInDialog: true,
        overprint: false,
        color: {
          r: 240.00000089406967,
          g: 58.354084342718124,
          b: 58.354084342718124
        }
      },
      {
        enabled: true,
        position: "outside",
        fillType: "color",
        blendMode: "normal",
        opacity: 1,
        size: {
          value: 5,
          units: "Pixels"
        },
        present: true,
        showInDialog: true,
        overprint: false,
        color: {
          r: 65.5797690153122,
          g: 69.00000348687172,
          b: 10.824902839958668
        }
      }
    ],
    // styles: {
    //   0: {
    //     0: { fontSize: 16 },
    //     1: { fontSize: 20 },
    //     3: { fontSize: 80 }
    //   }
    // },
    // strokeWidth: 2,
    // stroke: "blue",
    // paintFirst: 'fill',
    left: 200,
    top: 300
  })

  const text5 = new fabric.Textbox("渐变测试", {
    left: 450,
    top: 250,
    fill: {
      data: data,
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
        },
        {
          offset: 0,
          color: "rgba(0,0,0,0.1)"
        }
      ]
    }
  })

  const line = new fabric.Line([50, 10, 200, 150], {
    stroke: "green"
    // x1: 0,
    // y1: 0,
    // x2: 50,
    // y2: 50
  })
  editorStore.add(text)
  editorStore.add(text2)
  editorStore.add(text5)
  editorStore.add(text3)
  // editorStore.add(group)
  editorStore.add(line)

  editorStore.addAllEvent()
})
</script>
<style>
* {
  font-family: "Courier New", Courier, monospace;
}
</style>

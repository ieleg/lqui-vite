<template>
  <svg ref="svgRef" class="svg-base" :width="width" :height="248">
    <g v-axis:y="axis.y" class="y1-axis" :transform="`translate(${marginLeft},0)`" />
    <g v-axis:y2="axis.y2" class="y2-axis" :transform="`translate(${width - marginRight},0)`" />
  </svg>
  <div
    ref="scrollRef"
    class="scroll-bar"
    :style="{
      overflow: needScroll ? 'auto' : 'hidden'
    }"
  >
    <svg
      class="scroll-svg"
      :height="248"
      :width="needScroll ? data.length * 80 : width"
      @mouseover="handleMouseover"
      @mousemove="handleMousemove"
      @mouseout="handleMouseot"
    >
      <g
        class="hover-bar"
        :opacity="0.7"
        :style="{
          visibility: showTip ? 'visible' : 'hidden'
        }"
      >
        <rect :height="188" :width="scale.x.bandwidth()" fill="#F5F4FF"></rect>
      </g>
      <g v-axis:x="axis.x" class="x-axis" :transform="`translate(0,${height - marginBottom + 10})`" />

      <g class="bars">
        <g v-for="(item, index) in data" :key="index" :transform="`translate(${scale.x(item.date)}, 0)`">
          <rect
            v-show="item.salesAmount !== null"
            fill="#877BF4"
            class="salesAmount"
            :x="scale.x1('salesAmount') ?? 0"
            :y="scale.y(0)"
            :rx="3"
            :width="scale.x1.bandwidth()"
            :height="0"
          ></rect>
          <rect
            v-show="item.salesTarget !== null"
            fill="#FF8B7B"
            class="salesTarget"
            :x="scale.x1('salesTarget') ?? 0"
            :y="scale.y(0)"
            :rx="3"
            :width="scale.x1.bandwidth()"
            :height="0"
          ></rect>
        </g>
      </g>
      <path class="gmv-line" fill="none" stroke="#BAB4EF" :stroke-width="1.5" :d="lines(data)" />
      <g
        class="dots"
        :style="{
          visibility: showTip ? 'visible' : 'hidden'
        }"
      >
        <g v-for="item in data" :key="item.date">
          <circle
            fill="#fff"
            stroke="#BAB4EF"
            :r="item.salesRate !== null ? '4px' : 0"
            :cx="scale.x(item.date) + scale.x.bandwidth() / 2"
            :cy="scale.y2(item.salesRate)"
          ></circle>
        </g>
      </g>
    </svg>
  </div>
  <div class="tooltip" :style="tipStyle">
    <p>
      <i class="tooltip-target"></i> <span class="tooltip-title">目标GMV</span>
      <span>￥ {{ curNode.salesTarget ?? '-' }}</span>
    </p>
    <p>
      <i class="tooltip-real"></i> <span class="tooltip-title">实际GMV</span>
      <span>￥{{ curNode.salesAmount ?? '-' }}</span>
    </p>
    <p>
      <i class="-tooltip-line"></i> <span class="tooltip-title">完成率</span>
      <span>{{ curNode.salesRate ?? '-' }}%</span>
    </p>
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch, watchEffect } from 'vue'
import {
  select,
  max,
  line,
  curveNatural,
  scaleBand,
  scaleLinear,
  axisBottom,
  axisLeft,
  axisRight,
  range,
  pointer,
  least,
  easeLinear,
  selectAll
} from 'd3'
const props = defineProps({
  targetShow: {
    type: Boolean,
    default: true
  },
  amountShow: {
    type: Boolean,
    default: true
  },
  data: {
    type: Array,
    default: () => []
  },
  width: {
    type: Number,
    default: 768
  }
})
const marginTop = 30
const marginRight = 30
const marginBottom = 30
const marginLeft = 37
// const width = 768
const height = 248
const rangY = [height - marginBottom, marginTop]
const keys = computed(() => {
  if (!props.targetShow && props.amountShow) {
    return ['salesAmount']
  }
  if (props.targetShow && !props.amountShow) {
    return ['salesTarget']
  }
  return ['salesAmount', 'salesTarget']
})
const curNode = reactive({
  salesAmount: null,
  salesTarget: null,
  salesRate: null,
  date: null
})

// 判断是否要scroll的条件是data.length * 100 < width 如果需要scroll其宽度默认为768
const needScroll = computed(() => props.data.length * 75 > props.width)
const computedWidth = computed(() => (needScroll.value ? 768 : props.width))

const rangX = computed(() => {
  return props.data.length > 10
    ? [0, (props.data.length / 10) * (computedWidth.value - marginRight - marginLeft)]
    : [0, computedWidth.value - marginRight - marginLeft]
})
const domainX = computed(() => props.data.map((item) => item?.date))
const maxY = computed(() => max(props.data, (d) => max(['salesAmount', 'salesTarget'], (key) => d[key])))
const maxLineRate = computed(() => max(props.data, (d) => d.salesRate))

const scale = computed(() => {
  const x = scaleBand().domain(domainX.value).range(rangX.value).paddingInner(0.65)
  const x1 = scaleBand().domain(keys.value).rangeRound([0, x.bandwidth()]).padding(0.25)
  const y = scaleLinear([0, maxY.value], rangY)
  const y2 = scaleLinear([0, maxLineRate.value], rangY)
  return {
    x,
    x1,
    y,
    y2
  }
})

const axis = computed(() => {
  const x = axisBottom(scale.value.x)
    .tickSize(0)
    .tickFormat((d) => d.slice(5))
  const y = axisLeft(scale.value.y)
    .tickValues(range(0, maxY.value, maxY.value / 5).map((item) => Math.round(item)))
    .tickFormat((d) => {
      if (d === 0) {
        return 0
      }
      if (maxY.value >= 10e7) {
        return Math.round(d / 10e7) + '亿'
      }
      if (maxY.value > 10e3) {
        return Math.round(d / 10e3) + '万'
      }
      return d
    })
  const y2 = axisRight(scale.value.y2)
    .ticks(2)
    // .tickValues([0, 50])
    .tickFormat((d) => d + '%')
    .tickSize(0)
  return {
    x,
    y,
    y2
  }
})

// line的绘制
const lines = computed(() =>
  line()
    .defined((d) => d.salesRate !== null)
    .curve(curveNatural)
    .x((d) => scale.value.x(d.date) + scale.value.x.bandwidth() / 2)
    .y((d) => scale.value.y2(d.salesRate))
)

const showTip = ref(false)
const scrollRef = ref(null)
const tipStyle = computed(() => {
  return {
    visibility: showTip.value ? 'visible' : 'hidden'
  }
})
const handleMouseover = () => {
  showTip.value = true
}
const handleMousemove = (event) => {
  const [xm, ym] = pointer(event)
  const i = least(range(props.data.length), (i) => {
    return Math.abs(scale.value.x(props.data[i].date) - xm)
  })
  curNode.ym = ym
  curNode.salesRate = props.data[i].salesRate
  curNode.date = props.data[i].date
  curNode.salesTarget = props.data[i].salesTarget
  curNode.salesAmount = props.data[i].salesAmount
  select('.hover-bar')
    .transition()
    .duration(80)
    .ease(easeLinear)
    .attr('transform', `translate(${scale.value.x(curNode.date) ?? 0},${marginTop})`)
  select('.tooltip')
    .transition()
    .duration(80)
    .ease(easeLinear)
    .style(
      'transform',
      `translate(${
        scale.value.x(curNode.date) - (scrollRef.value?.scrollLeft ?? 0) + scale.value.x.bandwidth() + marginLeft
      }px, ${curNode.ym - height - 30}px)`
    )
}
const handleMouseot = () => {
  showTip.value = false
}

// 指令形式绘制坐标轴
const vAxis = (el, binding) => {
  const arg = binding.arg
  const method = binding.value
  const selection = select(el)
    .call(method)
    .call((g) => g.select('.domain').remove())

  selection.selectAll('text').style('fill', '#9594A5')
  if (arg === 'y') {
    selection.call((g) =>
      g
        .selectAll('.tick line')
        .attr('class', 'y-line')
        // .clone()
        .attr('x2', props.width - marginLeft - marginRight)
        .attr('stroke-opacity', 0.1)
    )
  }
}

// FIXME: 未生效的动画函数
const update = () => {
  selectAll('.salesAmount')
    .data(props.data)
    .transition()
    .ease(easeLinear)
    .delay((d, i) => {
      return i * 150
    })
    .duration(300)
    .attr('y', (d) => {
      return scale.value.y(d.salesAmount ?? 0)
    })
    .attr('height', (d) => {
      return (scale.value.y(0) || 0) - (scale.value.y(d.salesAmount) || scale.value.y(0) || 0)
    })
  selectAll('.salesTarget')
    .data(props.data)
    .transition()
    .ease(easeLinear)
    .delay((d, i) => {
      return i * 150
    })
    .duration(300)
    .attr('y', (d) => {
      return scale.value.y(d.salesTarget ?? 0)
    })
    .attr('height', (d) => {
      return (scale.value.y(0) || 0) - (scale.value.y(d.salesTarget) || scale.value.y(0) || 0)
    })
}
watch(
  () => props.data,
  () => {
    nextTick(() => {
      console.log(123);
      update()
    })
  },
  {
    immediate: true
  }
)
watchEffect(() => {
  console.log(computedWidth.value, props.width, needScroll.value)
})
</script>
<style lang="scss" scoped>
.scroll-bar {
  margin-top: -248px;
  z-index: 12;
  transform: translateX(60px);
  margin-right: 54px;
}
.scroll-svg {
  display: block;
}
.hover-bar {
  opacity: 0.7;
}
.gmv-line {
  transition: all 0.3s;
}
.tooltip {
  position: absolute;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 6px 10px;
  width: fit-content;
  background: rgba(63, 61, 88, 0.75);
  border-radius: 4px;
  z-index: 0;
  pointer-events: none;
  gap: 4px;
  &::after {
    position: absolute;
    top: 27px;
    left: -4px;
    content: '';
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 4px solid rgba(63, 61, 88, 0.75);
  }
  &-title {
    color: rgba(255, 255, 255, 0.8);
  }
  &-target {
    width: 6px;
    height: 6px;
    margin-right: 6px;
    background: #ff8b7b;
    border-radius: 2px;
    transform: translateX(2px);
  }
  &-real {
    width: 6px;
    height: 6px;
    margin-right: 6px;
    background: #877bf4;
    border-radius: 2px;
    transform: translateX(2px);
  }
  &-line {
    width: 12px;
    height: 2px;
    background: #bab4ef;
    border-radius: 2px;
  }
  &-title {
    width: 53px;
  }
  & > p {
    color: #fff;
    display: flex;
    flex-wrap: nowrap;
    margin: 0;
    gap: 5px;
    font-size: 12px;
    align-items: center;
  }
}
</style>

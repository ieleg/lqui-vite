<template>
  <svg :width="width" :height="height">
    <g v-axis:y="axis.y" class="y1-axis" :transform="`translate(${marginLeft},0)`" />

    <path ref="line1Ref" class="line1" fill="none" stroke="#FF8B7B" :stroke-width="1.5" />
    <path ref="area1Ref" class="area1" :stroke-width="1.5" fill="url(#areaGradient2)" />
    <path ref="line2Ref" class="line2" fill="none" stroke="#877BF4" :stroke-width="1.5" />
    <path ref="area2Ref" class="area2" :stroke-width="1.5" fill="url(#areaGradient)" />
    <defs>
      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0.01" stop-color="rgb(135, 123, 244)" stop-opacity="0.1"></stop>
        <stop offset="0.99" stop-color="rgba(135, 123, 244, 0)" stop-opacity="0"></stop>
      </linearGradient>
    </defs>
    <defs>
      <linearGradient id="areaGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0.01" stop-color="#FF8B7B" stop-opacity="0.1"></stop>
        <stop offset="0.99" stop-color="rgba(135, 123, 244, 0)" stop-opacity="0"></stop>
      </linearGradient>
    </defs>
  </svg>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { curveBasis, area, select, max, line, scaleUtc, scaleLinear, axisLeft, range, extent, easeLinear } from 'd3'
const props = defineProps({
  start: {
    type: String,
    default: ''
  },
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
  keys: {
    type: Array,
    default: () => []
  },
  width: {
    type: Number,
    default: 314
  }
})
const marginTop = 20
const marginRight = 20
const marginBottom = 20
const marginLeft = 50
const height = 140

const domainX = computed(() => extent(_data.value.map((item) => new Date(item.date))))
const maxY = computed(() => max(_data.value, (d) => max(props.keys, (key) => +d[key])))

const scale = computed(() => {
  const x = scaleUtc()
    .domain(domainX.value)
    .range([marginLeft, props.width - marginRight])
  const y = scaleLinear()
    .domain([0, maxY.value])
    .range([height - marginBottom, marginTop])
  return {
    x,
    y
  }
})
const _data = computed(() =>
  [
    {
      [props.keys[0]]: 0,
      [props.keys[1]]: 0,
      date: dayjs(props.start).subtract(1, 'day').format('YYYY-MM-DD')
    }
  ].concat(props.data)
)
const axis = computed(() => {
  const y = axisLeft(scale.value.y)
    .tickSize(0)
    .tickValues(range(0, maxY.value, maxY.value / 3).map((item) => Math.round(item)))
    .tickFormat((d) => {
      if (d === 0) {
        return 0
      }
      if (maxY.value >= 10e7) {
        return (d / 10e7).toFixed(2) + '亿'
      }
      if (maxY.value > 10e3) {
        return (d / 10e3).toFixed(2) + '万'
      }
      return d
    })

  return {
    y
  }
})

// line的绘制
const lines = (key, bol) =>
  line()
    .defined((d) => {
      return d[key] !== null
    })
    .curve(curveBasis)
    .x((d) => (bol ? scale.value.x(new Date(d.date)) : 0))
    .y((d) => (bol ? scale.value.y(d[key]) : scale.value.y(0)))
const _area = (key, bol = false) =>
  area()
    .defined((d) => {
      return d[key] !== null
    })
    .curve(curveBasis)
    .x((d) => {
      return bol ? scale.value.x(new Date(d.date)) : 0
    })

    .y0(scale.value.y(0))
    .y1((d) => {
      return bol ? scale.value.y(d[key]) : scale.value.y(0)
    })
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
const area1Ref = ref(null)
const area2Ref = ref(null)
const line1Ref = ref(null)
const line2Ref = ref(null)
const update = () => {
  select(area1Ref.value)
    .attr('d', _area(props.keys[0], false)(_data.value))
    .transition()
    .ease(easeLinear)
    .duration(300)
    .attr('d', _area(props.keys[0], true)(_data.value))

  select(area2Ref.value)
    .attr('d', _area(props.keys[1], false)(_data.value))
    .transition()
    .ease(easeLinear)
    .duration(300)
    .attr('d', _area(props.keys[1], true)(_data.value))

  select(line1Ref.value)
    .attr('d', lines(props.keys[0], false)(_data.value))
    .transition()
    .ease(easeLinear)
    .duration(300)
    .attr('d', lines(props.keys[0], true)(_data.value))
  select(line2Ref.value)
    .attr('d', lines(props.keys[1], false)(_data.value))
    .transition()
    .ease(easeLinear)
    .duration(300)
    .attr('d', lines(props.keys[1], true)(_data.value))
}
const timer = ref(null)
watch(
  () => props.data,
  () => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
    timer.value = setTimeout(() => {
      update()
    }, 500)
  },
  {
    immediate: true
  }
)
</script>
<style lang="scss" scoped>
.scroll-bar {
  margin-top: -251px;
  z-index: 12;
  transform: translateX(60px);
  margin-right: 90px;
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

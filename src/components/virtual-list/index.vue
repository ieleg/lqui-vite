<template>
  <div ref="root" class="list-container" @scroll.passive="handleScroll" >
    <div class="list-scroll" :style="`height: ${scrollHeight}px;padding-top: ${paddingTop}px`">
      <div
        v-for="item in pool"
        :key="item[dataKey]"
        class="list-item-container"
        :style="`height: ${itemSize}px`"
      >
        <slot :item="item" >
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, toRefs, defineComponent, onMounted, watch, computed } from 'vue'
export default defineComponent({
  name: 'VirtualList',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: 500
    },
    dataKey: {
      type: String,
      default: () => 'id'
    },
    itemSize: {
      type: Number,
      default: 40
    },
    poolBuffer: {
      type: Number,
      default: () => 15
    },
  },
  setup(props) {
    const { data, poolBuffer, itemSize } = toRefs(props)
    const root = ref(null)
    const pool = ref([])
    const hide = ref(false)
    const scrollHeight = computed(() => data.value.length * itemSize.value)
    const scrollRef = ref(null)
    watch(() =>props.data, () => {
      init()
    })
    watch(itemSize, (cItemSize) => {
      scrollHeight.value = data.value.length * cItemSize
    })
    let containerSize = 0
    const paddingTop = ref(0)
    let isScrollBusy = false
    const handleScroll = () => {
      if (!root.value) return
      if (isScrollBusy) return
      isScrollBusy = true
      requestAnimationFrame(() => {
        isScrollBusy = false
        if (!root.value) return
        const range = []
        range[0] = Math.floor(root.value.scrollTop / itemSize.value) - Math.floor(poolBuffer.value / 2)
        range[0] = Math.max(range[0], 0)
        range[1] = range[0] + Math.floor(root.value.clientHeight / itemSize.value) + poolBuffer.value
        range[1] = Math.min(range[1], data.value.length)
        pool.value = data.value.slice(range[0], range[1])
        paddingTop.value = range[0] * itemSize.value
      })
    }
    const init = () => {
      if (!root.value) return
      containerSize = root.value.clientHeight
      const contentLines = Math.floor(containerSize / itemSize.value)
      const totalLines = contentLines + poolBuffer.value
      const range = [0, totalLines]
      pool.value = data.value.slice(range[0], range[0] + range[1])
    }

    const resetScroll = () => {
      if(root.value) {
        root.value.scrollTop = 0
      }
    }
    onMounted(() => {
      init()
    })
    return { pool, scrollHeight, root, handleScroll, paddingTop, hide, resetScroll, scrollRef }
  }
})
</script>

<style scoped lang="scss">
.hide {
  display: none;
}
.list-container {
  width: 100%;
  height: 100%;
  min-width: 100px;
  min-height: 100px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 1px;
  }
}
.list-scroll {
  box-sizing: border-box;
}
.flip-list-move,
.flip-list-enter-active,
.flip-leave-active {
  transition: transform 0.3s;
}

.flip-list-leave-active {
  position: absolute;
}

.flip-list-enter-from,
.flip-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>

// 砌墙式布局
import { computed, onMounted, onBeforeUnmount } from "vue"
export const useMasonry = ref => {
  let _colAmount = 0
  let _height = 0
  const doLayout = () => {
    try {
      const gridItems = [...ref.value.childNodes].filter(d => d.nodeType === 1)
      // 列的数量
      const colAmount = getComputedStyle(ref.value).gridTemplateColumns.split(
        " "
      ).length
      const gap =  +getComputedStyle(ref.value).gap.replace(/px/i, '')
      const height = ref.value.getBoundingClientRect().height
      if (_colAmount !== colAmount || _height !== height) {
        _height = height
        _colAmount = colAmount
        gridItems.forEach(d => d.style.removeProperty("margin-top"))
        if (colAmount > 1) {
          gridItems.slice(colAmount).forEach((d, i) => {
            const topBottom = gridItems[i].getBoundingClientRect().bottom
            const bottomTop = d.getBoundingClientRect().top
            d.style.marginTop = `${topBottom + gap - bottomTop}px`
            console.log(d.style.marginTop, topBottom ,bottomTop);
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  onMounted(() => {
    doLayout()
    addEventListener('resize', doLayout)
  })
  onBeforeUnmount(() => {
    removeEventListener('resize', doLayout)
    
  })
}

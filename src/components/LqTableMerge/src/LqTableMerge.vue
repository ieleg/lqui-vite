<script>
export default {
  props: {},
  methods: {
    mergeTableRow(data, merge) {
      if (!merge || merge.length === 0) {
        return data
      }
      let _data
      merge.forEach(m => {
        const mList = {}
        _data = data.map((v, index) => {
          const rowVal = v[m]
          if (mList[rowVal] && mList[rowVal].newIndex === index) {
            mList[rowVal]["num"]++
            mList[rowVal]["newIndex"]++
            data[mList[rowVal]["index"]][m + "-span"].rowspan++
            v[m + "-span"] = {
              rowspan: 0,
              colspan: 0
            }
          } else {
            mList[rowVal] = { num: 1, index: index, newIndex: index + 1 }
            v[m + "-span"] = {
              rowspan: 1,
              colspan: 1
            }
          }
          return v
        })
      })
      console.log(_data)
      return _data
    },
    objSpanMethod({ row, column }) {
      const span = column["property"] + "-span"
      if (row[span]) {
        return row[span]
      }
    }
  },
  render() {
    return this.$scopedSlots.default({
      objSpanMethod: this.objSpanMethod,
      mergeTableRow: this.mergeTableRow
    })
  }
}
</script>

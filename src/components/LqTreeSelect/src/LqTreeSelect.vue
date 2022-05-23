<template>
  <div>
    <el-select
      slot="reference"
      ref="select"
      v-model="selectedData"
      collapse-tags=""
      :filterable="true"
      reserve-keyword
      :multiple="multiple"
      clearable=""
      :filter-method="filterNode"
      class="tree-select"
      @visible-change="$refs.tree.filter('')"
      @clear="clear"
    >
      <el-option class="options" :value="1">
        <el-tree
          ref="tree"
          class="common-tree"
          :style="style"
          :data="data"
          :filter-node-method="_filterNode"
          :props="defaultProps"
          :show-checkbox="multiple"
          :node-key="nodeKey"
          :check-strictly="checkStrictly"
          default-expand-all
          :expand-on-click-node="false"
          :default-checked-keys="defaultCheckedKeys"
          :highlight-current="true"
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
        />
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "TreeSelect",
  props: {
    // 树结构数据
    data: {
      type: Array,
      default() {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default() {
        return {}
      }
    },
    // 配置是否可多选
    multiple: {
      type: Boolean,
      default() {
        return false
      }
    },
    nodeKey: {
      type: String,
      default: "id"
    },
    // 显示复选框情况下，是否严格遵循父子不互相关联
    checkStrictly: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 默认选中的节点key数组
    value: {
      require: true
    },
    width: {
      type: Number,
      default() {
        return 250
      }
    },
    height: {
      type: Number,
      default() {
        return 300
      }
    },
    /**
     * 选中父节点是否保留其值
     */
    justCheckLeaf: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultCheckedKeys: [],
      options: [],
      selectedData: [], // 选中的节点
      style: "width:" + this.width + "px;" + "height:" + this.height + "px;",
      selectStyle: "width:" + (this.width + 24) + "px;",
      checkedIds: [],
      checkedData: []
    }
  },
  watch: {
    options: {
      handler(val) {
        this.$emit(
          "input",
          this.multiple
            ? val.map(item => item.value)
            : val.map(item => item.value)[0]
        )
      }
    },
    selectedData: {
      handler(arr) {
        if (Array.isArray(arr)) {
          let keys = []
          this.options.forEach(item => {
            if (arr.indexOf(item.label) > -1) {
              keys.push(item.value)
            }
          })
          this.$refs.tree.setCheckedKeys(keys)
        } else {
          this.$refs.tree.setCheckedKeys([arr], true)
        }
      }
    }
  },
  mounted() {
    if (this.value.length > 0) {
      if (this.multiple) {
        this.defaultCheckedKeys = this.value
        this.selectedData = this.value.map(item => {
          let node = this.$refs.tree.getNode(item)
          return node?.label
        })
      } else {
        let item = this.value
        this.$refs.tree.setCurrentKey(item)
        let node = this.$refs.tree.getNode(item)
        this.selectedData = node.label
      }
    }
  },
  methods: {
    clear() {
      this.$refs.tree.setCheckedKeys([])
      // this.$refs.tree.setCurrentKey(null)
    },
    filterNode(value) {
      this.$refs.tree.filter(value)
    },
    _filterNode(value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    // 节点被点击时的回调,返回被点击的节点数据
    handleNodeClick(data, node) {
      if (!this.multiple) {
        let tmpMap = {}
        tmpMap.value = node.key
        tmpMap.label = node.label
        this.options = []
        this.options.push(tmpMap)
        this.selectedData = node.label
        this.$refs.select.blur()
      }
    },
    // 节点选中状态发生变化时的回调
    handleCheckChange() {
      let checkedKeys = this.$refs.tree.getCheckedKeys(this.justCheckLeaf) // 所有被选中的节点的 key 所组成的数组数据
      this.options = checkedKeys.map(item => {
        let node = this.$refs.tree.getNode(item) // 所有被选中的节点对应的node
        let tmpMap = {}
        tmpMap.value = node.key
        tmpMap.label = node.label
        return tmpMap
      })
      this.selectedData = this.options.map(item => {
        return item.label
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.options {
  display: contents;
}
</style>

<template>
  <div class="allselect">
    <el-select
      v-model="bindValue"
      :size="size"
      multiple
      collapse-tags
      :clearable="clearable"
      :filterable="filterable"
      :placeholder="placeholder"
    >
      <el-option v-if="options.length" style="padding: 0" value="all">
        <span class="option" style="font-size: 12px" @click.stop="setAll">
          {{ allFlag }}
        </span>
      </el-option>
      <el-option
        v-for="item in options"
        :key="valueCompute(item)"
        :label="labelCompute(item)"
        :value="valueCompute(item)"
      />
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    options: {
      type: Array,
      default: () => []
    },
    clearable: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ""
    },
    // 传入item的label，若为item本身则不需传
    labelKey: {
      type: String,
      default: ""
    },
    // 传入item的value，若为item本身则不需传
    valueKey: {
      type: String,
      default: ""
    },
    multipleLimit: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      bindValue: this.value,
      allFlag: "全选"
    }
  },
  computed: {
    valueCompute() {
      return item => {
        const map = {
          object: JSON.stringify(item)
        }
        if (this.valueKey) {
          return item[this.valueKey]
        } else {
          return map[typeof item] ?? item
        }
      }
    },
    labelCompute() {
      return item => {
        if (this.labelKey) {
          return item[this.labelKey]
        } else {
          return item
        }
      }
    }
  },
  watch: {
    bindValue(val) {
      if (val.length === 0) {
        this.allFlag = "全选"
      }
      if (val.length === this.options.length) {
        this.allFlag = "全不选"
      }
      this.$emit("input", val)
    }
  },
  methods: {
    setAll() {
      if (this.allFlag === "全选") {
        this.allFlag = "全不选"
        this.bindValue = this.valueKey
          ? this.options.map(item => item[this.valueKey])
          : this.options
      } else {
        this.allFlag = "全选"
        this.bindValue = []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.option {
  position: relative;
  display: inline-block;
  overflow: hidden;
  width: 100%;
  height: 34px;
  box-sizing: border-box;
  padding: 0 20px;
  color: #606266;
  cursor: pointer;
  font-size: 14px;
  line-height: 34px;
  text-overflow: ellipsis;
  user-select: none;
  white-space: nowrap;

  &:hover {
    background: #f5f7fa;
  }
}

 .el-select__tags-text {
  display: inline-block;
  overflow: hidden;
  max-width: 55px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

 .el-tag.el-tag--info .el-tag__close {
  top: -5px;
  right: -4px;
}

.el-select-dropdown__item {
  overflow: hidden;
  max-width: 305px;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::after {
    right: 10px !important;
  }
}
</style>

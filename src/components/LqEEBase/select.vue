<template>
  <div :class="['base']">
    <div ref="textRef" class="base-text" @click="handleInitClick">
      <span :class="{ 'base-text-query': status === 'query' }">
        {{ text }}
      </span>
      <i v-if="singleNoFuzzy" class="el-icon-caret-bottom" />

      <i v-if="status === 'init'" class="el-icon-caret-bottom" />
    </div>

    <div
      v-if="status === 'query'"
      key="query"
      class="base-query"
      :style="selectStyle"
    >
      <el-select
        ref="selectRef"
        v-model="bindValue"
        :class="{ cart: !multiple && !filterable }"
        v-bind="$props"
        collapse-tags
        size="mini"
        filterable
        :placeholder="placeholder"
        @clear="handleClear"
        @change="change"
        @visible-change="handleChange"
      >
        <el-option
          v-for="item in options"
          :key="valueCompute(item)"
          :label="labelCompute(item)"
          :value="valueCompute(item)"
        />
      </el-select>
    </div>
    <div
      v-if="status === 'tag'"
      key="tag"
      class="base-tag"
      @click="handleTag"
    >
      <el-tag
        closable
        :class="{ select: !clearable }"
        type="info"
        size="mini"
        @close="handleClear"
      >
        {{ checkValue }}
      </el-tag>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    ...[
      "clearable",
      "value-key",
      "disabled",
      "multiple",
      "remote",
      "remote-method",
      "loading"
    ].reduce((pre, cur) => {
      pre[cur] = {}
      return pre
    }, {}),
    filterable: {
      type: Boolean,
      default: true
    },
    value: {
      requied: true
    },
    text: {
      type: String,
      default: "",
      requied: true
    },
    options: {
      type: Array,
      default: () => []
    },
    labelKey: {
      type: String,
      default: ""
    },
    valueKey: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "请选择"
    }
  },
  data() {
    return {
      status: "init",
      bindValue: this.multiple ? [] : null,
      // 单选且无模糊搜索的标识
      singleNoFuzzy: false,
      checkValue: ""
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
    },
    selectStyle() {
      if (!this.multiple && this.singleNoFuzzy) {
        return {
          opacity: 0,
          width: "0px"
        }
      } else {
        return {}
      }
    }
  },

  watch: {
    bindValue(val) {
      this.$emit("input", val)
    },
    value(e) {
      this.bindValue = e
      if ((!this.multiple && e) || ~[false, 0].indexOf(e))
        if (this.valueKey && this.options.length) {
          this.checkValue = this.options.find(
            item => e === item[this.valueKey]
          )[this.labelKey]
        } else {
          this.checkValue = e
        }
      /* 单选绑定数据若为空或null需将组件状态置init */
      if (!this.multiple) {
        if ((!e && !~[false, 0].indexOf(e)) || e.length === 0) {
          this.singleNoFuzzy = false
          this.status = "init"
        } else {
          this.status = "tag"
        }
      } else {
        /* 多选组件非focus状态置空绑定数据 因将其组件状态置为init */
        if (!e.length && this.status === "query") {
          this.status = "init"
        }
      }
    }
  },
  methods: {
    change(e) {
      this.$nextTick(() => {
        if (this.$refs.selectRef && this.$refs.selectRef.$children.length > 2) {
          const width = this.$refs.selectRef.$children[2].$el.clientWidth
          this.$refs.selectRef.$children[0].$el.style.width = width + 100 + "px"
        }
      })
      this.$emit("change", e)
    },
    /**
     * 下拉显隐
     * 如果单选不带filterable blur时若绑定值为空回归init
     */
    handleChange(e) {
      console.log("ddd", e, this.bindValue, this.multiple)
      if (this.filterable) {
        !e &&
          (!this.bindValue || this.bindValue.length === 0) &&
          this.handleClearForce()
        !e &&
          (this.bindValue || this.bindValue === 0) &&
          !this.multiple &&
          this.handleQuery()
      } else {
        !e &&
          !this.multiple &&
          (this.bindValue || this.bindValue === 0) &&
          this.handleQuery()
        !e &&
          !this.multiple &&
          !this.bindValue &&
          this.bindValue !== 0 &&
          this.handleClear()
      }
    },
    handleInitClick() {
      if (this.status === "init") {
        this.status = "query"
        if (!this.multiple && !this.filterable) {
          this.singleNoFuzzy = true
          setTimeout(() => {
            const offect = this.$refs.textRef.clientWidth
            console.log(offect, this.$refs.selectPrentRef)
            this.$refs.selectRef.$children[1].$el.style.transform = `translateX(-${offect}px)`
          }, 150)
        }
        setTimeout(() => {
          this.$refs.selectRef.focus()
        }, 150)
      }
    },
    handleQuery() {
      if (this.status === "query") {
        this.status = "tag"
        this.singleNoFuzzy = false
      }
    },
    handleTag() {
      if (this.status === "tag") {
        this.status = "query"
        this.singleNoFuzzy = false
        setTimeout(() => {
          this.$refs.selectRef.focus()
        }, 150)
      }
    },
    handleClear() {
      console.log(2)
      if (!this.clearable) {
        this.handleTag()
        return
      }
      this.handleClearForce()
    },
    handleClearForce() {
      if (~["query", "tag"].indexOf(this.status)) {
        this.bindValue = this.multiple ? [] : null
        this.status = "init"
        this.singleNoFuzzy = false
        if (this.remote) {
          this.options.splice(0)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.base {
  display: flex;
  height: 28px;
  align-items: center;
  color: #586278;
  font-size: 12px;

  &-text {
    position: relative;
    z-index: 34;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    cursor: pointer;
    gap: 5px;

    & > span {
      transition: all 0.3s;
    }

    &-query {
      color: #172fae;
    }

    &::after {
      position: absolute;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      transition: all 0.3s;
    }

    &:hover {
      &::after {
        background: #f5f7fe;
        border-radius: 2px;
      }
    }
  }

  &-query {
    margin-left: 5px;
    transition: all 3s;
  }

  &-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
    cursor: pointer;
  }
}

 .el-input {
  // width: 135px;
  transition: width 0.3s;
}

 .el-input__inner {
  border: 1px solid transparent;
}

 .el-select:hover .el-input__inner {
  border-color: #dae5fd;
}

 .el-input__suffix-inner {
  transition: all 1s;
  // position: absolute;
}

 .el-icon-arrow-up::before {
  content: "\e78f";
}

 .el-icon-circle-close::before {
  content: "\e6db";
}

 .el-select__tags {
  flex-wrap: nowrap;
}

 .el-tag.el-tag {
  background: #eff1f9;
  border-radius: 2px;
  color: #252e40;

  &:hover {
    background: #e8ecff;

    .el-tag__close.el-icon-close::before {
      background: #e8ecff;
    }
  }
}

 .el-tag.el-tag--info:nth-child(1) {
  position: relative;
  overflow: hidden;
  max-width: 90px;
  padding: 0 16px 0 5px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

 .el-tag.el-tag--info.select {
  i::before {
    content: "\e6df";
  }
}

 .el-tag__close.el-icon-close {
  position: absolute;
  top: 2px;
  right: 0;
  transition: all 0.3s;

  &::before {
    border: none;
    background: #eff1f9;
    border-radius: 0;
    transform: translate(0, 0);
  }

  &:hover {
    color: rgb(100, 93, 93);
    transform: scale(0.76);
  }
}

 .el-select .el-input.is-focus .el-input__inner {
  border: 1px solid #dae5fd;
  border-radius: 2px;
}

.cart {
   input {
    caret-color: #fff;
    color: #333;
  }
}
</style>

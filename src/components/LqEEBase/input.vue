<template>
  <div :class="['base']">
    <div ref="textRef" class="base-text" @click="handleInitClick">
      <span :class="{ 'base-text-query': status === 'query' }">
        {{ text }}
      </span>
      <i v-if="status === 'init'" class="el-icon-caret-bottom" />
    </div>
    <div v-if="status === 'query'" key="query" class="base-query">
      <el-input
        ref="inputRef"
        v-model="bindValue"
        size="mini"
        v-bind="$props"
        class="query-input"
        @keyup.enter.native="handleQuery"
        @blur="handleQuery"
      />
    </div>
    <div
      v-if="status === 'tag'"
      key="tag"
      class="base-tag"
      @click="handleTag"
    >
      <el-tag
        closable
        type="info"
        size="mini"
        @close="handleClear"
      >
        {{ bindValue }}
      </el-tag>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    ...["disabled", "placeholder", "maxlength"].reduce((pre, cur) => {
      pre[cur] = {}
      return pre
    }, {}),
    value: {
      type: String,
      default: "",
      requied: true
    },
    text: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      status: "init",
      bindValue: "",
      // 单选且无模糊搜索的标识
      singleNoFuzzy: false
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
    value(e) {
      this.bindValue = e
      if (!e) {
        this.status = "init"
      } else {
        this.status = "tag"
      }
    }
  },
  methods: {
    handleChange(e) {
      if (this.multiple) {
        !e &&
          (!this.bindValue || this.bindValue.length === 0) &&
          this.handleClear()
      } else {
        !e &&
          !this.multiple &&
          (this.bindValue || this.bindValue === 0) &&
          this.handleQuery()
      }
    },
    handleInitClick() {
      if (this.status === "init") {
        this.status = "query"
        setTimeout(() => {
          this.$refs.inputRef.focus()
        }, 150)
      }
    },
    handleQuery() {
      if (this.status === "query") {
        if (this.bindValue) {
          this.status = "tag"
          this.bindValue && this.$emit("input", this.bindValue)
        } else {
          this.handleClear()
        }
      }
    },
    handleTag() {
      if (this.status === "tag") {
        this.singleNoFuzzy = false
        this.status = "query"
        setTimeout(() => {
          this.$refs.inputRef.focus()
        }, 150)
      }
    },
    handleClear() {
      if (~["query", "tag"].indexOf(this.status)) {
        this.bindValue = ""
        this.status = "init"
        this.$emit("input", this.bindValue)
      }
    }
  }
}
</script>

<style lang="scss">
.query-input {
  .el-input__inner {
    border: 1px solid #dae5fd;

    &:focus {
      border: 1px solid #dae5fd;
    }
  }

  .el-select:hover .el-input__inner {
    border-color: #dae5fd;
  }
}
</style>
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

 .el-input__suffix-inner {
  transition: all 1s;
  // position: absolute;
}

 .el-icon-arrow-up::before {
  transition: all 1s;
}

 .el-icon-close::before {
  content: "\e78c";
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
  padding: 0 20px 0 5px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
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

    &::before {
      content: "\e6db";
    }
  }
}

 .el-select .el-input.is-focus .el-input__inner {
  border: 1px solid #dae5fd;
  border-radius: 2px;
}

 .el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  background-color: #f6f8ff;
}

 .el-select-dropdown.is-multiple,
.el-select-dropdown {
  font-size: 12px;

  .el-select-dropdown__empty {
    font-size: 12px;
  }

  .el-select-dropdown__item {
    padding: 0 12px;
    font-size: 12px;
  }

  .el-select-dropdown__item.selected {
    background-color: #f6f8ff;
    font-weight: normal;
  }
}

.cart {
   input {
    caret-color: #fff;
    color: #333;
  }
}
</style>

<template>
  <el-pagination
    v-if="total"
    class="table-page"
    background
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    layout="total, sizes, next, slot, prev"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
    <div class="custom">
      <i
        v-if="!isInput"
        style="color: #213182; cursor: pointer"
        @click="handleInput"
      >
        {{ currentPage }}
      </i>
      <el-input-number
        v-else
        ref="inputRef"
        v-model="inputNum"
        :controls="false"
        size="mini"
        style="width: 50px"
        :max="pageNumTotal"
        :min="1"
        step-strictly
        @blur="handleBlur"
        @keyup.enter.native="handleBlur"
      />
      <i style="margin: 0 5px; color: #99a2b4">/</i>
      <i style="color: #99a2b4">{{ pageNumTotal }}</i>
    </div>
  </el-pagination>
</template>
<script>
export default {
  props: {
    pageSize: {
      default: 10,
      type: Number
    },
    currentPage: {
      default: 1,
      type: Number
    },
    total: {
      default: 0,
      type: Number
    },
    pageSizes: {
      default: () => {
        return [10, 20, 40, 100, 200, 300, 400]
      },
      type: Array
    }
  },
  data() {
    return {
      inputNum: this.currentPage,
      isInput: false
    }
  },
  computed: {
    pageNumTotal() {
      return Math.ceil(this.total / this.pageSize)
    }
  },
  watch: {
    currentPage(e) {
      this.inputNum = e
    }
  },
  mounted() {},
  methods: {
    handleInput() {
      this.isInput = true

      this.$nextTick(() => {
        this.$refs.inputRef.$refs.input.focus()
      })
    },
    handleBlur() {
      this.isInput = false
      this.inputNum !== this.currentPage &&
        this.$emit("paginate", {
          currentPage: this.inputNum,
          pageSize: this.pageSize
        })
    },
    handleSizeChange(data) {
      this.$emit("paginate", {
        currentPage: 1,
        pageSize: data
      })
    },
    handleCurrentChange(data) {
      this.$emit("paginate", {
        currentPage: data,
        pageSize: this.pageSize
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.custom {
  // color: red;
  display: flex;
  height: 28px;
  align-items: center;
  justify-content: center;
  margin: 0 15px;
  float: right;
}
</style>
<style lang="scss">
.el-pagination.is-background .btn-prev:disabled,
.el-pagination.is-background .btn-next:disabled {
  color: #e4e7ed;
}

.el-pagination.is-background .btn-prev,
.el-pagination.is-background .btn-next {
  background-color: transparent;
  color: #252e40;

  i {
    font-size: 16px;
  }
}

.el-pagination span:not([class*="suffix"]),
.el-pagination button {
  font-size: 12px;
}

.el-pagination__total {
  font-size: 12px;
}

.table-page {
  //input-number
  .el-input-number.is-without-controls .el-input__inner {
    padding-left: 8px;
    text-align: left;
  }

  .el-pagination .el-pagination__jump {
    margin-right: 10px;
    font-size: 12px;
  }

  .el-pagination__sizes .el-input .el-input__inner {
    padding-right: 5px;
    border-color: transparent;
    font-size: 12px;

    &:hover {
      border-color: transparent;
    }

    &:focus {
      border-color: transparent;
    }
  }

  .btn-next,
  .btn-prev {
    display: flex;
    align-items: center;
    justify-content: center;
    float: right;
  }
}
</style>

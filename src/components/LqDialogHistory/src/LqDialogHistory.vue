<template>
  <el-dialog :visible.sync="modal" title="操作日志" custom-class="history">
    <el-table
      v-loading="loading"
      size="small"
      :data="historyTable"
      :height="300"
      border
    >
      <el-table-column label="操作人" prop="realName" min-width="50" />
      <el-table-column label="操作时间" prop="createTime" min-width="100" />
      <el-table-column label="操作内容" prop="content" min-width="150" />
    </el-table>
    <template slot="footer" />
  </el-dialog>
</template>

<script>
export default {
  name: "MasterHistory",
  props: {
    /**
     * 查询数据时loading状态
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * v-model 或者value 绑定的值,控制弹窗显隐
     */
    value: {
      type: Boolean,
      default: false
    },
    /**
     * 表格数据
     */
    historyTable: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      modal: this.value
    }
  },
  watch: {
    value(val) {
      this.modal = val
    },
    modal(val) {
      if (val === false) {
        this.$emit("input", val)
      }
    }
  },
  mounted() {
    console.log(this)
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>

<template>
  <div>
    <el-dialog :visible.sync="modal" :title="title" :mask-closable="false">
      <el-upload
        style="width: 100%"
        :headers="headers"
        :with-credentials="true"
        drag
        auto-upload
        :show-file-list="false"
        :action="uploadUrl"
        :name="uploadName"
        :on-success="uploadSuccess"
        :format="['xlsx', 'xls']"
      >
        <div class="lq-upload">
          <i class="el-icon-upload" size="52" style="color: #39f" />
          <p class="text">
            点击选择或者拖拽要上传的文件
          </p>
        </div>
      </el-upload>
      <span class="lq-template" @click="exportTemplate">
        {{ templateTitle }}.xls
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="modal = false">取 消</el-button>
        <el-button type="primary" size="small" @click="modal = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "LqUpload",
  props: {
    headers: {
      type: Object,
      default: () => ({
        "x-platform": "ep"
      })
    },
    /* 标题文案 */
    title: {
      type: String,
      default: "批量导入"
    },
    /* 下载模板文案 */
    templateTitle: {
      type: String,
      default: "批量导入模板"
    },
    value: {
      type: Boolean,
      default: false
    },
    uploadUrl: {
      type: String,
      default: ""
    },
    uploadName: {
      type: String,
      default: ""
    },
    /* 下载模板文件回调 */
    exportTemplate: {
      type: Function,
      default: () => {}
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
  mounted() {},

  methods: {
    uploadSuccess(response) {
      if (response.code === 200) {
        this.$Message.success({
          content: response.message,
          duration: 1.5,
          closable: true
        })
        this.modal = false
        this.$emit("upload-success", true)
      } else {
        this.$Message.error({
          content: response.message,
          duration: 1.5,
          closable: true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lq-upload {
  width: 100%;
}

.lq-template {
  color: #3299ff;
  transition: all 0.3s;

  &:hover {
    color: #8fc7ff;
    cursor: pointer;
    font-size: 12px;
  }
}

 .el-upload {
  width: 100%;

  &-dragger {
    width: inherit;
  }
}

 .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}

 .el-dialog__header {
  & > span {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>

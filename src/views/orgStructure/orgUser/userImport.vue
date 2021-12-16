<template>
  <el-dialog
    class="excel-import"
    :visible.sync="visible"
    title="数据上传"
    @closed="close"
  >
    <excel-import
      v-if="visible"
      :example-url="`${baseApi}/downloadExample`"
      :upload-url="`${baseApi}/upload`"
      :preview-url="`${baseApi}/preview`"
      :preview-save-url="`${baseApi}/previewSave`"
      :fields-required="fieldsRequired"
      @finishedUpload="handleFinishedUpload"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ExcelImport from '@/components/diboot/components/excel/import'

export default {
  name: 'IamUserImport',
  components: {
    ExcelImport
  },
  props: {
    currentNodeId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      baseApi: '/iam/user/excel',
      visible: false
    }
  },
  computed: {
    /**
     * 后端需要的固定参数
     * @returns {{}}
     */
    fieldsRequired: function() {
      return { orgId: this.currentNodeId }
    }
  },
  methods: {
    open() {
      this.visible = true
    },
    /**
     * 刷新数据
     */
    handleFinishedUpload() {
      this.$emit('complete')
      this.visible = false
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

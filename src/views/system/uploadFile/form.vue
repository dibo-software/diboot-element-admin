<template>
  <el-dialog
    :visible.sync="state.visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :close-on-click-modal="false"
    :show-close="false"
    @closed="close"
  >
    <el-row slot="title" type="flex">
      <el-col :span="20">{{ title }}</el-col>
      <el-col :span="4" style="text-align: right">
        <svg-icon
          :icon-class="!fullscreen ? 'fullscreen': 'exit-fullscreen'"
          style="cursor: pointer; margin-right: 10px"
          @click="() => {fullscreen = !fullscreen}"
        />
        <i class="el-icon-close" style="cursor: pointer" @click="close" />
      </el-col>
    </el-row>
    <el-form ref="dataForm" :model="form" label-position="right" label-width="100px">
      <el-row :gutter="18">
        <el-col :span="24">
          <el-form-item
            label="备注"
          >
            <el-input
              v-model="form.description"
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入备注"
              :maxlength="100"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit" @click="onSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import form from '@/components/diboot/mixins/form'

export default {
  name: 'UploadFileForm',
  mixins: [form],
  data() {
    return {
      baseApi: '/uploadFile',
      primaryKey: 'uuid'
    }
  },
  methods: {
    async enhance(values) {
      for (const key of Object.keys(values)) {
        if (key !== 'description' && key !== this.primaryKey) {
          delete values[key]
        }
      }
    }
  }
}
</script>

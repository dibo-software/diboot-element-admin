<template>
  <el-dialog
    :visible.sync="visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
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
    <el-form label-position="left" inline class="detail-item-container">
      <el-row :gutter="18">
        <el-col :span="24">
          <el-form-item label="模版编码">
            <span>{{ model.code }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模版标题">
            <span>{{ model.title }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模版内容">
            <span>{{ model.content }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="创建人">
            <span>{{ model.createByName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="创建时间">
            <span>{{ model.createTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="更新时间">
            <span>{{ model.updateTime }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'

export default {
  name: 'MessageTemplateDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/messageTemplate'
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

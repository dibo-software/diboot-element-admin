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
          <el-form-item label="上级部门">
            <span>{{ parentName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="编码">
            <span>{{ model.code }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="简称">
            <span>{{ model.shortName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="全称">
            <span>{{ model.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="类型">
            <span>{{ model.typeLabel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="负责人">
            <span>{{ model.managerName || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <span>{{ model.orgComment || '-' }}</span>
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
  name: 'OrgDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/iam/org'
    }
  },
  computed: {
    parentName: function() {
      if (this.model == null || !this.model.parentShortName) {
        return '-无-'
      }
      return this.model.parentShortName
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

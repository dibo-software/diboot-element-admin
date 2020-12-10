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
          <el-form-item label="名称">
            <span>{{ model.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="编码">
            <span>{{ model.code }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="数据权限">
            <span>{{ model.dataPermissionTypeLabel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否虚拟岗">
            <span>{{ model.isVirtual === true ? '是' : '否' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="职级头衔">
            <span>{{ model.gradeName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="职级">
            <span>{{ model.gradeValue }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="创建时间">
            <span>{{ model.createTime }}</span>
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
  name: 'IamPositionDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/iam/position'
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

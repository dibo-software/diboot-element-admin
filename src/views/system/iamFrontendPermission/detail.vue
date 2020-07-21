<template>
  <el-dialog
    class="detailModal"
    :visible.sync="visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
  >
    <el-row slot="title" type="flex">
      <el-col :span="20">查看详情</el-col>
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
      <el-form-item label="上级菜单">
        <span>{{ model.parentDisplayName ? model.parentDisplayName : '无' }}</span>
      </el-form-item>
      <el-form-item label="菜单名称">
        <span>{{ model.displayName }}</span>
      </el-form-item>
      <el-form-item label="菜单编码">
        <span>{{ model.frontendCode }}</span>
      </el-form-item>
      <el-form-item label="按钮/权限">
        <template v-if="model.permissionList && model.permissionList.length > 0">
          <el-tag
            v-for="(permission,i) in model.permissionList"
            :key="i"
            type="success"
          >
            {{ `${permission.displayName}[${permission.frontendCode}]` }}
          </el-tag>
        </template>
        <template v-else>
          无
        </template>
      </el-form-item>
      <el-form-item label="接口列表">
        <template v-if="model.apiSetList && model.apiSetList.length > 0">
          <el-tag
            v-for="(api,i) in model.apiSetList"
            :key="i"
            type="primary"
          >
            {{ api }}
          </el-tag>
        </template>
        <template v-else>
          无
        </template>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" @click="close">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import detail from '@/components/diboot/mixins/detail'

export default {
  name: 'IamFrontendPermissionDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/iam/frontendPermission'
    }
  }
}
</script>
<style lang="scss">
</style>

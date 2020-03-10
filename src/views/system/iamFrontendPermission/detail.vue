<template>
  <el-dialog class="detailModal" :visible.sync="visible" title="查看详情" @closed="close">
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
            :key="i"
            v-for="(permission,i) in model.permissionList"
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
            :key="i"
            v-for="(api,i) in model.apiSetList"
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

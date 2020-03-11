<template>
  <el-dialog class="detailModal" :visible.sync="visible" title="查看详情" @closed="close">
    <el-form label-position="right" class="detail-item-container" label-width="120px">
      <el-form-item label="角色名称">
        <span>{{ model.name }}</span>
      </el-form-item>
      <el-form-item label="角色编码">
        <span>{{ model.code }}</span>
      </el-form-item>
      <el-form-item label="角色描述">
        <span>{{ model.description || '-' }}</span>
      </el-form-item>
      <el-form-item label="已授权权限">
        <el-tree
          v-if="permissionTreeList && permissionTreeList.length > 0"
          class="filter-tree"
          node-key="id"
          :data="permissionTreeList"
          :props="{label: 'label', children: 'children'}"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree">
        </el-tree>
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
import { permissionTreeListFormatter } from '@/utils/treeDataUtil'

export default {
  name: 'IamRoleDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/iam/role',
      permissionTreeList: []
    }
  },
  methods: {
    async afterOpen(id) {
      if (this.model && this.model.permissionVOList) {
        this.permissionTreeList = permissionTreeListFormatter(this.model.permissionVOList, 'id', 'displayName')
      }
    },
    afterClose() {
      this.permissionTreeList = []
    }
  }
}
</script>
<style lang="scss">
</style>

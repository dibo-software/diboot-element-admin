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
        <el-row>
          <el-col :span="24">
            <el-input v-model="filterText" size="small" placeholder="请输入节点内容开始搜索" class="input-with-select">
            </el-input>
          </el-col>
        </el-row>
        <el-tree
          v-if="permissionTreeList && permissionTreeList.length > 0"
          ref="tree"
          class="filter-tree"
          node-key="id"
          :data="permissionTreeList"
          :props="{label: 'label', children: 'children'}"
          :filter-node-method="filterNode"
          default-expand-all
        />
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
      permissionTreeList: [],
      filterText: ''
    }
  },
  methods: {
    async afterOpen(id) {
      if (this.model && this.model.permissionVOList) {
        this.permissionTreeList = permissionTreeListFormatter(this.model.permissionVOList, 'id', 'displayName')
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data && data.label && data.label.indexOf(value) !== -1
    },
    afterClose() {
      this.permissionTreeList = []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>
<style lang="scss">
</style>

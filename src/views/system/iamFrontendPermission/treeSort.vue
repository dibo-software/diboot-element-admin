<template>
  <el-dialog class="detailModal" :visible.sync="visible" title="拖拽排序" @closed="close">
    <el-tree
      v-if="treeList && treeList.length > 0"
      ref="tree"
      class="filter-tree"
      node-key="id"
      :data="treeList"
      :props="{label: 'label', children: 'children'}"
      default-expand-all
      :filter-node-method="filterNode"
      draggable
      :allow-drop="allowDrop"
      @node-drop="onNodeDrop"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">
        关闭
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import treeSort from '@/components/diboot/mixins/treeSort'
import { permissionTreeListFormatter } from '@/utils/treeDataUtil'

export default {
  name: 'IamFrontendPermissionSort',
  mixins: [treeSort],
  data() {
    return {
      baseApi: '/iam/frontendPermission'
    }
  },
  methods: {
    treeListFormatter(treeList, valueField, titleField) {
      return permissionTreeListFormatter(treeList, 'id', 'displayName')
    }
  }
}
</script>
<style lang="scss">
</style>

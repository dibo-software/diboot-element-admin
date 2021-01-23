<template>
  <div class="orgIndex">
    <el-row :gutter="16">
      <el-col :span="8">
        <org-tree
          ref="orgTree"
          :can-change="true"
          @changeCurrentNode="node => currentNodeId = `${node.value ? node.value : '0'}`"
          @change="onTreeChange"
        />
      </el-col>
      <el-col :span="16">
        <current-detail :current-node-id="currentNodeId" />
        <el-tabs :value="'1'">
          <el-tab-pane :label="orgTabTitle" name="1">
            <org-list ref="orgList" :current-node-id="currentNodeId" @formComplete="$refs.orgTree.loadTree()" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import orgTree from '@/views/orgStructure/org/orgTree'
import orgList from './list'
import currentDetail from '@/views/orgStructure/org/currentDetail'

export default {
  name: 'OrgIndex',
  components: {
    orgTree,
    orgList,
    currentDetail
  },
  data() {
    return {
      currentNodeId: '0'
    }
  },
  computed: {
    orgTabTitle: function() {
      return this.currentNodeId === '0' ? '组织列表' : '子部门列表'
    }
  },
  methods: {
    onOrgTreeSortComplete() {
      this.$refs.orgTree.loadTree()
      this.$refs.orgList.getList()
    },
    onTreeChange() {
      this.$refs.orgTree.loadTree()
      this.$refs.orgList.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .orgIndex {
    padding: 15px;
  }
</style>

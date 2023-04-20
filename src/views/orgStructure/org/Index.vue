<template>
  <div class="orgIndex">
    <el-row :gutter="16">
      <el-col :span="8">
        <org-tree
          ref="orgTree"
          :can-change="true"
          @changeCurrentNode="node => currentNodeId = `${node.value ? node.value : '0'}`"
          @change="onTreeChange"
          @cancelSelectNode="cancelSelectNode"
        />
      </el-col>
      <el-col :span="16">
        <current-detail :current-node-id="currentNodeId" @currentDetailChange="currentDetailChange" />
        <el-tabs :value="'1'">
          <el-tab-pane :label="orgTabTitle" name="1" :style="{height: tableHeight}">
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
      currentNodeId: '0',
      tableHeight: ''
    }
  },
  computed: {
    orgTabTitle: function() {
      return this.currentNodeId === '0' ? '组织列表' : '子部门列表'
    }
  },
  mounted() {
    this.tableHeight = `calc(100vh - 139px)`
  },
  methods: {
    onOrgTreeSortComplete() {
      this.$refs.orgTree.loadTree()
      this.$refs.orgList.getList()
    },
    onTreeChange() {
      this.$refs.orgTree.loadTree()
      this.$refs.orgList.getList()
    },
    cancelSelectNode() {
      this.tableHeight = `calc(100vh - 139px)`
    },
    currentDetailChange(detailHeight) {
      this.tableHeight = `calc(100vh - 139px - ${detailHeight}px)`
    }
  }
}
</script>

<style lang="scss" scoped>
  .orgIndex {
    padding: 15px;
  }
</style>

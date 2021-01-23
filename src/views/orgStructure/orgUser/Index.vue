<template>
  <div class="OrgUserIndex">
    <el-row :gutter="16">
      <el-col :span="8">
        <org-tree ref="orgTree" @changeCurrentNode="node => currentNodeId = `${node.value ? node.value : '0'}`" />
      </el-col>
      <el-col :span="16">
        <el-tabs :value="'1'">
          <el-tab-pane :label="tabTitle" name="1">
            <user-list ref="userList" :current-node-id="currentNodeId" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import orgTree from '@/views/orgStructure/org/orgTree'
import userList from './userList'
export default {
  name: 'OrgUserIndex',
  components: {
    orgTree,
    userList
  },
  data() {
    return {
      currentNodeId: '0'
    }
  },
  computed: {
    tabTitle: function() {
      if (!this.currentNodeId || this.currentNodeId === '0' || this.currentNodeId === 0) {
        return '所有人员列表'
      } else {
        return '部门人员列表'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .OrgUserIndex {
    padding: 15px;
  }
</style>


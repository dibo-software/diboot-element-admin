<template>
  <div class="app-container">
    <el-row v-if="showTreeNode">
      <el-col :span="6">
        <org-tree
          ref="orgTree"
          @changeCurrentNode="node => currentNodeId = `${node.value ? node.value : '0'}`"
        />
      </el-col>
      <el-col :span="18">
        <user-list ref="userList" :current-node-id="currentNodeId" />
      </el-col>
    </el-row>
    <user-list v-else ref="userList" :current-node-id="currentNodeId" />
  </div>
</template>

<script>
import orgTree from '@/views/orgStructure/org/orgTree'
import userList from './list'
import { hasPermissions } from '@/utils/helper/checkPermission'

export default {
  name: 'OrgUserList',
  components: {
    orgTree,
    userList
  },
  data() {
    return {
      currentNodeId: ''
    }
  },
  computed: {
    showTreeNode() {
      return this.hasPermissions(['orgTree'], this)
    }
  },
  methods: {
    hasPermissions
  }

}
</script>
<style lang="less" scoped>
</style>

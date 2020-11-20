<template>
  <div class="app-container">
    <el-row v-permission="['orgTree']">
      <el-col :span="6">
        <org-tree ref="orgTree" @changeCurrentNode="onChangeCurrentNode" />
      </el-col>
      <el-col :span="18">
        <user-list ref="userList" :current-node-id="currentNodeId" />
      </el-col>
    </el-row>
    <user-list ref="userList" v-permission-missing="['orgTree']" :current-node-id="currentNodeId" />
  </div>
</template>

<script>
import orgTree from '@/views/system/iamOrg/orgTree'
import userList from './list'

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
  methods: {
    onChangeCurrentNode(value) {
      // 事件处理代码
      this.currentNodeId = value
    }
  }

}
</script>
<style lang="less" scoped>
</style>

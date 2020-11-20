<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6">
        <org-tree ref="orgTree" :can-change="true" @changeCurrentNode="onChangeCurrentNode" />
      </el-col>
      <el-col :span="18">
        <el-tabs value="orgInfo">
          <el-tab-pane label="部门信息" name="orgInfo">
            <detail-info ref="detailInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import orgTree from '@/views/system/iamOrg/orgTree'
import detailInfo from '@/views/system/iamOrg/detailInfo'

export default {
  name: 'OrgUserList',
  components: {
    orgTree,
    detailInfo
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
      this.$refs.detailInfo.getInfo(value)
    }
  }

}
</script>
<style lang="less" scoped>
</style>

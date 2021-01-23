<template>
  <el-dialog
    class="detailModal"
    :visible.sync="visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
    append-to-body
  >
    <el-row slot="title" type="flex">
      <el-col :span="20">人员选择</el-col>
      <el-col :span="4" style="text-align: right">
        <svg-icon
          :icon-class="!fullscreen ? 'fullscreen': 'exit-fullscreen'"
          style="cursor: pointer; margin-right: 10px"
          @click="() => {fullscreen = !fullscreen}"
        />
        <i class="el-icon-close" style="cursor: pointer" @click="close" />
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="8">
        <readonly-org-tree ref="readonlyOrgTree" @changeCurrentNode="node => currentNodeId = `${node.value ? node.value : '0'}`" />
      </el-col>
      <el-col :span="16">
        <user-select-list ref="userSelectList" :current-node-id="currentNodeId" @select="record => selectUser(record)" />
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import readonlyOrgTree from '@/views/orgStructure/org/readonlyOrgTree'
import userSelectList from '@/views/orgStructure/orgUser/userSelectList'
export default {
  name: 'UserSelectModal',
  components: {
    readonlyOrgTree,
    userSelectList
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      currentNodeId: '0',
      // 当前组件全屏控制
      fullscreen: false
    }
  },
  methods: {
    open() {
      this.visible = true
    },
    selectUser(record) {
      this.$emit('select', record)
      this.close()
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>

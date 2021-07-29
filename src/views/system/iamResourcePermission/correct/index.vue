<template>
  <el-dialog
    v-loading="loading"
    title="权限纠错"
    :visible.sync="visible"
    :fullscreen="fullscreen"
    class="frontend-permission-form"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="true"
    @close="close"
  >
    <div v-if="diffDataIdList.length > 0" :key="refresh">
      <div class="color-tip">仅检索已配置的无效权限接口。<span class="red" />表示权限接口不存在，需要调整；<span class="blue" />表示权限接口存在</div>
      <div class="operate">
        <el-button type="danger" size="mini" @click="handleBatchDelete">全部删除</el-button>
      </div>
      <div v-for="(item, index) in diffDataList" :key="`${_uid}_${index}`">
        <h4>{{ item.parentDisplayName }}</h4>
        <correct-permission-item :permission-item="item" :api-tree-list="apiTreeList" @refresh="handleRefresh" />
      </div>
    </div>
    <div v-else class="empty">
      已配置的权限接口均有效，无需调整。
    </div>
  </el-dialog>
</template>

<script>
import { dibootApi } from '@/utils/request'
import correctPermissionItem from './correctPermissionItem'
import { apiListFormatter, treeList2IndentList } from '@/utils/treeDataUtil'
export default {
  name: 'CorrectPermissionIndex',
  components: {
    correctPermissionItem
  },
  data() {
    return {
      visible: false,
      loading: false,
      // 当前组件全屏控制
      fullscreen: false,
      baseUrl: '/iam/resourcePermission',
      diffDataList: [],
      diffDataIdList: [],
      apiTreeList: [],
      refresh: true
    }
  },
  methods: {
    open() {
      this.visible = true
      this.getDiffPermissions()
      this.getApiList()
    },
    handleRefresh() {
      this.getDiffPermissions()
    },
    /**
       * 获取有问题的权限
       */
    async getDiffPermissions() {
      this.loading = true
      try {
        const res = await dibootApi.get(`${this.baseUrl}/apiDiff`)
        if (res.code === 0) {
          this.diffDataList = res.data.diffDataList || []
          this.diffDataIdList = res.data.diffDataIdList || []
          this.refresh = !this.refresh
        } else {
          this.$notification.error({
            message: '获取权限失败',
            description: res.msg
          })
        }
      } finally {
        this.loading = false
      }
    },
    async getApiList() {
      const resApiList = await dibootApi.get(`${this.baseUrl}/apiList`)
      if (resApiList.code === 0) {
        this.apiTreeList = treeList2IndentList(apiListFormatter(resApiList.data))
      } else {
        this.$message.error(resApiList.msg)
      }
    },
    async handleBatchDelete() {
      const _this = this
      _this.$confirm('删除将删除所有错误权限及其子权限，您确定删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        dibootApi.post(`${_this.baseUrl}/batchDeleteInvalidPermissionList`, _this.diffDataIdList).then(async(res) => {
          if (res.code === 0) {
            _this.$notify.success({
              title: '删除成功',
              message: '已批量删除权限'
            })
            _this.close()
            _this.$emit('complete')
          } else {
            _this.$notify.error({
              title: '删除失败',
              message: res.msg
            })
          }
        }).catch(err => {
          console.log(err)
          _this.$notify.error({
            title: '删除失败'
          })
        })
      })
    },
    close() {
      this.visible = false
      this.diffDataList = []
      this.diffDataIdList = []
      this.apiTreeList = []
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
.color-tip {
  line-height: 20px;
  background-color: rgba(21, 133, 255, 0.2);
  border-radius: 5px;
  padding: 10px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin: 0 10px;
  }
  .red {
    background-color: red;
  }
  .blue {
    background-color: blue;
  }
}
.operate {
  display: flex;
  margin-top: 10px;
  justify-content: flex-end;
}
  .empty {
    text-align: center;
    font-size: 20px;
  }
</style>

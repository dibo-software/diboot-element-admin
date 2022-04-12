<template>
  <div v-if="currentNodeId !== '0' && model">
    <el-descriptions>
      <el-descriptions-item label="简称">{{ model.shortName }}</el-descriptions-item>
      <el-descriptions-item label="全称">{{ model.name }}</el-descriptions-item>
      <el-descriptions-item label="编码">{{ model.code }}</el-descriptions-item>
      <el-descriptions-item label="上级部门">{{ parentName }}</el-descriptions-item>
      <el-descriptions-item label="类型">{{ model.typeLabel }}</el-descriptions-item>
      <el-descriptions-item label="负责人">{{ model.managerName || '-' }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { dibootApi } from '@/utils/request'

export default {
  name: 'OrgDetail',
  props: {
    currentNodeId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      baseApi: '/iam/org',
      model: undefined
    }
  },
  computed: {
    parentName: function() {
      if (this.model == null || !this.model.parentShortName) {
        return '-无-'
      }
      return this.model.parentShortName
    }
  },
  watch: {
    currentNodeId: function(val) {
      this.getDetail(val)
    }
  },
  methods: {
    getDetail(id) {
      if (id === '0') {
        return
      }
      dibootApi.get(`${this.baseApi}/${id}`).then(res => {
        if (res.code === 0) {
          this.model = res.data
        } else {
          this.$message.error('获取当前部门详情失败')
        }
      })
    }
  }
}
</script>

<style scoped>
</style>

<template>
  <el-form label-position="left" inline class="detail-item-container">
    <el-row v-if="model.id" :gutter="18">
      <el-col :span="24">
        <el-form-item label="上级部门">
          <span>{{ model.parentName }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="名称">
          <span>{{ model.name }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="简称">
          <span>{{ model.shortName }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注">
          <span>{{ model.orgComment }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="创建时间">
          <span>{{ model.createTime }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-alert
      v-else
      title="请选择部门"
      type="info"
    />
  </el-form>
</template>

<script>
import { dibootApi } from '@/utils/request'

export default {
  name: 'OrgDetailInfo',
  data() {
    return {
      model: {}
    }
  },
  methods: {
    async getInfo(id) {
      if (id === undefined || id === 0 || id === '0') {
        this.model = {}
      } else {
        const res = await dibootApi.get(`/iam/org/${id}`)
        if (res.code === 0) {
          this.model = res.data
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

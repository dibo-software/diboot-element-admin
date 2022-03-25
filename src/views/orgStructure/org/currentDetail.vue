<template>
  <div v-if="currentNodeId !== '0' && model">
    <el-form ref="form" label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item style="margin-bottom: 0;" label="简称">
            {{ model.shortName }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item style="margin-bottom: 0;" label="全称">
            {{ model.name }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item style="margin-bottom: 0;" label="编码">
            {{ model.code }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item style="margin-bottom: 0;" label="上级部门">
            {{ parentName }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item style="margin-bottom: 0;" label="类型">
            {{ model.typeLabel }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item style="margin-bottom: 0;" label="负责人">
            {{ model.managerName || '-' }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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

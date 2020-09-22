<template>
  <el-dialog
    class="detailModal"
    :visible.sync="visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
  >
    <el-row slot="title" type="flex">
      <el-col :span="20">查看详情</el-col>
      <el-col :span="4" style="text-align: right">
        <svg-icon
          :icon-class="!fullscreen ? 'fullscreen': 'exit-fullscreen'"
          style="cursor: pointer; margin-right: 10px"
          @click="() => {fullscreen = !fullscreen}"
        />
        <i class="el-icon-close" style="cursor: pointer" @click="close" />
      </el-col>
    </el-row>
    <el-form label-position="left" inline class="detail-item-container">
      <el-row>
        <el-col>
          <el-form-item label="用户姓名">
            <span>{{ model.userRealname }}</span>
          </el-form-item>
          <el-form-item label="用户类型:ID">
            <span>{{ model.userType }} : {{ model.userId }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="业务对象">
            <span>{{ model.businessObj }}</span>
          </el-form-item>
          <el-form-item label="操作事项">
            <span>{{ model.operation }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="请求URL">
            <span>{{ model.requestMethod }} : {{ model.requestUri }}</span>
          </el-form-item>
          <el-form-item label="IP">
            <span>{{ model.requestIp }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="请求参数">
            <span>{{ model.requestParams }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="状态码">
            <span>
              <el-tag v-if="model.statusCode === 0" type="success">成功</el-tag>
              <el-tag v-else type="danger">失败</el-tag>
            </span>
          </el-form-item>
          <el-form-item label="创建时间">
            <span>{{ model.createTime }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="异常信息" v-if="model.statusCode != 0">
            <span>{{ model.errorMsg }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" @click="close">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import detail from '@/components/diboot/mixins/detail'
import { dibootApi } from '@/utils/request'

export default {
  name: 'IamOperationLogDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/iam/operationLog',
      username: ''
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">
</style>

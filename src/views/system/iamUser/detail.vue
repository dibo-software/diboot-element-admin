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
      <el-form-item label="用户名">
        <span>{{ username }}</span>
      </el-form-item>
      <el-form-item label="用户编号">
        <span>{{ model.userNum }}</span>
      </el-form-item>
      <el-form-item label="姓名">
        <span>{{ model.realname }}</span>
      </el-form-item>
      <el-form-item label="性别">
        <span>{{ model.genderLabel || '-' }}</span>
      </el-form-item>
      <el-form-item label="角色">
        <div v-if="model.roleList && model.roleList.length > 0" class="tag-group">
          <el-tag
            v-for="item in model.roleList"
            :key="item.name"
            type="success"
            effect="dark"
          >
            {{ item.name }}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item label="状态">
        <span>{{ model.statusLabel || '-' }}</span>
      </el-form-item>
      <el-form-item label="电话">
        <span>{{ model.mobilePhone || '-' }}</span>
      </el-form-item>
      <el-form-item label="邮箱">
        <span>{{ model.email || '-' }}</span>
      </el-form-item>
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
  name: 'IamUserDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/iam/user',
      username: ''
    }
  },
  methods: {
    async afterOpen(id) {
      // 获取account的username信息到表单中
      const res = await dibootApi.get(`${this.baseApi}/getUsername/${id}`)
      if (res.code === 0) {
        this.username = res.data
      }
    }
  }
}
</script>
<style lang="scss">
</style>

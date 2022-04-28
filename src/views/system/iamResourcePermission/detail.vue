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
    <el-descriptions class="permission-detail" :column="1">
      <el-descriptions-item label="上级菜单">{{ model.parentDisplayName ? model.parentDisplayName : '无' }}</el-descriptions-item>
      <el-descriptions-item label="菜单名称">{{ model.displayName }}</el-descriptions-item>
      <el-descriptions-item label="菜单编码">{{ model.resourceCode }}</el-descriptions-item>
      <el-descriptions-item label="菜单编码">
        <template v-if="model.permissionCodes && model.permissionCodes.length > 0">
          <template v-for="permissionCode in model.permissionCodes">
            <template v-if="permissionCodeApiMap[permissionCode] && permissionCodeApiMap[permissionCode].length > 0">
              <el-tag
                v-for="(apiUri, i) in permissionCodeApiMap[permissionCode]"
                :key="`menu_permission_${i}_${apiUri.method}${apiUri.uri}`"
                size="small"
                type="primary">
                {{apiUri.method}}:{{apiUri.uri}}（{{apiUri.label}}）
              </el-tag>
            </template>
          </template>
        </template>
        <template v-else>
          无
        </template>
      </el-descriptions-item>
    </el-descriptions>
    <el-tabs v-if="model.permissionList && model.permissionList.length > 0" type="border-card">
      <el-tab-pane
        v-for="(p,i) in model.permissionList"
        :key="i"
        :label="p.displayName"
      >
        <el-descriptions :column="1">
          <el-descriptions-item label="名称">{{ p.displayName }}</el-descriptions-item>
          <el-descriptions-item label="编码">{{ p.resourceCode }}</el-descriptions-item>
          <el-descriptions-item label="接口列表" content-class-name="flex-wrap">
            <template v-if="p.permissionCodes && p.permissionCodes.length > 0">
              <template v-for="permissionCode in p.permissionCodes">
                <template v-if="permissionCodeApiMap[permissionCode] && permissionCodeApiMap[permissionCode].length > 0">
                  <el-tag
                    v-for="(apiUri, i) in permissionCodeApiMap[permissionCode]"
                    :key="`permission_${p.resourceCode}_${i}_${apiUri.method}${apiUri.uri}`"
                    size="small"
                    type="primary">
                    {{apiUri.method}}:{{apiUri.uri}}（{{apiUri.label}}）
                  </el-tag>
                </template>
              </template>
            </template>
            <template v-else>
              无
            </template>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
    </el-tabs>

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
  name: 'IamResourcePermissionDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/iam/resourcePermission',
      originApiList: []
    }
  },
  computed: {
    permissionCodeApiMap() {
      const map = {}
      this.originApiList.forEach(item => {
        const apiPermissionList = item.apiPermissionList
        if (apiPermissionList && apiPermissionList.length > 0) {
          apiPermissionList.forEach(apiPermission => {
            const permissionCode = apiPermission.code
            map[permissionCode] = apiPermission.apiUriList
          })
        }
      })
      return map
    }
  },
  methods: {
    afterOpen() {
      dibootApi.get(`${this.baseApi}/apiList`).then(res => {
        if (res.code === 0) {
          this.originApiList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }

}
</script>
<style lang="scss">
.el-tag + .el-tag {
  margin-left: 5px;
  margin-bottom: 5px;
}
.flex-wrap {
  flex-wrap: wrap;
}
</style>

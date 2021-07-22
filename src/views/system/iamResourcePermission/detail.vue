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
    <el-form label-position="left" label-width="100px" inline class="detail-item-container">
      <el-row :gutter="18">
        <el-col :span="12">
          <el-form-item label="上级菜单">
            <span>{{ model.parentDisplayName ? model.parentDisplayName : '无' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称">
            <span>{{ model.displayName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单编码">
            <span>{{ model.resourceCode }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="页面接口列表">
            <div v-if="model.apiSetList && model.apiSetList.length > 0" class="tag-group">
              <el-tag
                v-for="(api,i) in model.apiSetList"
                :key="i"
                type="primary"
              >
                {{ api }}
              </el-tag>
            </div>
            <template v-else>
              无
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="页面资源权限">
            <template v-if="!model.permissionList || model.permissionList.length === 0">
              无
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-if="model.permissionList && model.permissionList.length > 0" type="border-card">
      <el-tab-pane
        v-for="(p,i) in model.permissionList"
        :key="i"
        :label="p.displayName"
      >
        <el-form label-position="left" inline class="detail-item-container">
          <el-form-item label="名称">
            <span>{{ p.displayName }}</span>
          </el-form-item>
          <el-form-item label="编码">
            <span>{{ p.resourceCode }}</span>
          </el-form-item>
          <el-form-item label="接口列表">
            <div v-if="p.apiSetList && p.apiSetList.length > 0" class="tag-group">
              <el-tag
                v-for="(api,j) in p.apiSetList"
                :key="j"
                type="primary"
              >
                {{ api }}
              </el-tag>
            </div>
            <template v-else>
              无
            </template>
          </el-form-item>
        </el-form>
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

export default {
  name: 'IamResourcePermissionDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/iam/resourcePermission'
    }
  }
}
</script>
<style lang="scss">
</style>

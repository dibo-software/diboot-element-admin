<template>
  <el-descriptions class="permission-group" :title="`${permissionGroup.name}（${permissionGroup.code}）`" border :column="1" size="small">
    <el-descriptions-item v-for="(apiPermission, index) in permissionGroup.apiPermissionList" :key="`group-item-${_uid}_${index}`">
      <div :id="apiPermission.code" slot="label" class="permission-group-code permission-group-text-overflow" @click.stop.prevent="() => changeCheck(apiPermission.code)">
        <el-checkbox :value="permissionCodeList.includes(apiPermission.code)">
          <el-tooltip placement="top">
            <template slot="content">
              {{ apiPermission.code }} （{{ apiPermission.label }}）
            </template>
            <span>{{ apiPermission.code }}</span>
          </el-tooltip>
        </el-checkbox>
      </div>
      <template v-if="apiPermission.apiUriList && apiPermission.apiUriList.length > 0">
        <div @click.stop.prevent="changeCheck(apiPermission.code)">
          <div v-for="(apiUri, i) in apiPermission.apiUriList" :key="`${apiPermission.code}_api-uri-${i}`" class="permission-group-api permission-group-text-overflow">
            <el-tooltip placement="top">
              <template slot="content">
                {{ apiUri.method }}:{{ apiUri.uri }}（{{ apiUri.label }}）
              </template>
              <span>{{ apiUri.method }}:{{ apiUri.uri }}（{{ apiUri.label }}）</span>
            </el-tooltip>
          </div>
        </div>
      </template>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  name: 'PermissionGroup',
  props: {
    permissionGroup: {
      type: Object,
      required: true
    },
    permissionCodeList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    changeCheck(code) {
      this.$emit('changePermissionCode',
        this.permissionCodeList.includes(code) ? 'remove' : 'add',
        code
      )
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.permission-group {
  ::v-deep .el-descriptions__body > table {
    table-layout: fixed;
    .el-descriptions-item__content {
      padding: 0;
    }
  }
  &-text-overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    .ant-checkbox-wrapper {
      width: 100%;
    }
  }
  .light-high {
    background-color: #e2f6fe;
    border-radius: 5px;
    transition: 2s;
  }
  &-api {
    border-bottom: 1px solid #e8e8e8;
    padding: 8px 16px;
    &:last-child {
      border-bottom: 0;
    }
  }
}

</style>

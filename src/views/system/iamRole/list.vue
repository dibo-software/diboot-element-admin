<template>
  <div class="app-container">
    <el-row>
      <el-col :lg="20" :md="24">
        <div class="filter-container">
          <el-input v-model="queryParam.name" placeholder="角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
          <el-input v-model="queryParam.code" placeholder="编码" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
            查询
          </el-button>
          <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="reset">
            重置
          </el-button>
        </div>
      </el-col>
      <el-col :lg="4" :md="24" style="text-align: right;">
        <el-button v-permission="['create']" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="$refs.form.open(undefined)">
          新建
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loadingData"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      row-key="id"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-item-expand">
            <el-form-item v-if="props.row.superAdmin === true" label="">
              <el-tag type="primary" effect="dark">拥有所有权限</el-tag>
            </el-form-item>
            <template v-else>
              <el-form-item v-for="(per, index) in props.row.permissions" :key="index" :label="per.name">
                <div v-if="per.children && per.children.length > 0" class="tag-group">
                  <el-tag
                    v-for="(p, k) in per.children"
                    :key="k"
                    type="success"
                  >
                    {{ p.operationName }}
                  </el-tag>
                </div>
              </el-form-item>
            </template>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="编码">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <div v-if="row.superAdmin === true">
            -
          </div>
          <div v-else>
            <el-button
              v-permission="['update']"
              type="text"
              @click="$refs.form.open(row.id)"
            >
              更新
            </el-button>
            <span
              v-permission="['detail']"
              v-permission-again="['delete']"
            >
              <el-divider
                direction="vertical"
              />
            </span>
            <el-dropdown
              v-permission="['delete']"
              @command="command => menuCommand(command, row)"
            >
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-permission="['delete']"
                  command="delete"
                  icon="el-icon-delete"
                >
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span v-permission-missing="['update', 'delete']">
              -
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pagination.total>0"
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.pageSize"
      :style="{textAlign: 'right'}"
      @pagination="handlePaginationChanged"
    />
    <form-modal
      ref="form"
      :more="more"
      @refreshList="getList"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import list from '@/components/diboot/mixins/list'
import formModal from './form'
import _ from 'lodash'

export default {
  name: 'IamRoleList',
  components: {
    formModal
  },
  directives: { waves },
  mixins: [list],
  data() {
    return {
      baseApi: '/iam/role',
      getMore: false
    }
  },
  methods: {
    afterLoadList(list) {
      list.forEach(role => {
        if (role.permissionList && role.permissionList.length > 0) {
          const childrenListMap = {}
          role.permissionList.forEach(per => {
            if (per.parentId !== 0) {
              if (childrenListMap[per.parentId] === undefined) {
                childrenListMap[per.parentId] = []
              }
              childrenListMap[per.parentId].push(per)
            }
          })
          // 合并childrenListMap为permissions
          const permissions = []
          _.forEach(childrenListMap, (values, key) => {
            if (values && values.length > 0) {
              const per = { name: values[0]['name'] }
              per.children = values
              permissions.push(per)
            }
          })
          role.permissions = permissions
        }
      })
    }
  }
}
</script>

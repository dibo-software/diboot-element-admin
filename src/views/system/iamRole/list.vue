<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.realname" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-select v-model="queryParam.status" placeholder="请选择" style="width: 200px;" class="filter-item">
        <el-option
          v-for="(item, index) in more.userStatusKvList"
          :key="index"
          :value="item.v"
          :label="item.k">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        查询
      </el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="reset">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="$refs.form.open(undefined)">
        新建
      </el-button>
    </div>
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
              <el-form-item :label="per.name"  v-for="(per, index) in props.row.permissions" :key="index">
                <div class="tag-group" v-if="per.children && per.children.length > 0">
                  <el-tag
                    v-for="(p, k) in per.children"
                    :key="k"
                    type="success"
                    effect="dark">
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
          <el-button size="mini" type="success" @click="$refs.form.open(row.id)">
            更新
          </el-button>
          <el-button size="mini" type="danger" @click="remove(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pagination.total>0"
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.pageSize"
      @pagination="handlePaginationChanged"
      :style="{textAlign: 'right'}"
    />
    <form-modal
      ref="form"
      :more="more"
      @refreshList="getList" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import list from '@/components/diboot/mixins/list'
import formModal from './form'
import forEach from 'lodash.foreach'

export default {
  name: 'IamRoleList',
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
          forEach(childrenListMap, (values, key) => {
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
  },
  components: {
    formModal
  },
  directives: { waves },
  mixins: [list]
}
</script>

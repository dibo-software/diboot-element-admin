<template>
  <div class="app-container">
    <el-row>
      <el-col :lg="20" :md="24">
        <div class="filter-container">
          <el-input
            v-model="queryParam.name"
            clearable
            placeholder="岗位名称"
            @keyup.enter.native="onSearch"
          />
          <el-input
            v-model="queryParam.code"
            clearable
            placeholder="岗位编码"
            @keyup.enter.native="onSearch"
          />
          <el-button v-waves type="primary" icon="el-icon-search" @click="onSearch">
            查询
          </el-button>
          <el-button type="info" icon="el-icon-refresh" @click="reset">
            重置
          </el-button>
        </div>
      </el-col>
      <el-col :lg="4" :md="24" style="text-align: right;">
        <el-button v-permission="['create']" type="primary" icon="el-icon-plus" @click="$refs.form.open(undefined)">
          新建岗位
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loadingData"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      row-key="id"
      @sort-change="appendSorterParam"
    >
      <el-table-column label="岗位名称" prop="name" />
      <el-table-column label="岗位编码" prop="code" />
      <el-table-column label="职级" prop="gradeValue" />
      <el-table-column label="职级头衔" prop="gradeName" />
      <el-table-column label="数据权限" width="150" align="center" prop="dataPermissionTypeLabel" sortable />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            v-permission="['detail']"
            type="text"
            @click="$refs.detail.open(row.id)"
          >
            详情
          </el-button>
          <span
            v-permission="['detail']"
            v-permission-again="['update', 'delete']"
          >
            <el-divider
              direction="vertical"
            />
          </span>
          <el-dropdown
            v-permission="['update', 'delete']"
            @command="command => menuCommand(command, row)"
          >
            <el-button type="text">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-permission="['update']"
                command="update"
                icon="el-icon-edit"
              >
                更新
              </el-dropdown-item>
              <el-dropdown-item
                v-permission="['delete']"
                command="delete"
                icon="el-icon-delete"
              >
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span v-permission-missing="['detail', 'update', 'delete']">
            -
          </span>
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
      @complete="getList"
    />
    <detail-modal ref="detail" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import list from '@/components/diboot/mixins/list'
import formModal from './form'
import detailModal from './detail'

export default {
  name: 'IamPositionList',
  components: {
    formModal,
    detailModal
  },
  directives: { waves },
  mixins: [list],
  data() {
    return {
      baseApi: '/iam/position'
    }
  }
}
</script>

<template>
  <div class="app-container">
    <el-row>
      <el-col :lg="16" :md="24">
        <div class="filter-container">
          <el-input
            v-model="queryParam.displayName"
            clearable
            placeholder="菜单名称"
            @keyup.enter.native="onSearch"
          />
          <el-input
            v-model="queryParam.resourceCode"
            clearable
            placeholder="菜单编码"
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
      <el-col :lg="8" :md="24" style="text-align: right;">
        <el-button v-if="canCorrectPermission" type="default" icon="sync" @click="$refs.correct.open()">
          权限纠错
        </el-button>
        <el-button v-permission="['sort']" type="default" icon="el-icon-rank" @click="$refs.sort.open()">
          排序
        </el-button>
        <el-button v-permission="['create']" type="primary" icon="el-icon-plus" @click="create">
          新建
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loadingData"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      :default-expand-all="true"
      :tree-props="{children: '_children', hasChildren: 'hasChildren'}"
      row-key="id"
    >
      <el-table-column
        prop="displayName"
        label="菜单名称"
      />
      <el-table-column
        prop="resourceCode"
        label="菜单编码"
      />
      <el-table-column label="页面按钮/权限">
        <template slot-scope="scope">
          <div v-if="scope.row.permissionList && scope.row.permissionList.length > 0" class="tag-group">
            <el-tag
              v-for="(item, index) in scope.row.permissionList"
              :key="index"
              type="success"
            >
              {{ `${item.displayName}[${item.resourceCode}]` }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
        align="center"
      />
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
                v-permission="['create']"
                command="createSubMenu"
                icon="el-icon-plus"
              >
                添加子菜单
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
    <detail-modal ref="detail" />
    <form-modal
      ref="form"
      :init-parent-id="formParentId"
      @complete="getList"
      @close="formParentId = null"
    />
    <permission-tree-sort ref="sort" @complete="getList" />
    <correct-permission ref="correct" @complete="getList" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import list from '@/components/diboot/mixins/list'
import detailModal from './detail'
import formModal from './form'
import permissionTreeSort from './treeSort'
import { listPageTreeFormatter } from '@/utils/treeDataUtil'
import CorrectPermission from './correct'

export default {
  name: 'IamResourcePermissionList',
  components: {
    CorrectPermission,
    detailModal,
    formModal,
    permissionTreeSort
  },
  directives: { waves },
  mixins: [list],
  data() {
    return {
      baseApi: '/iam/resourcePermission',
      customQueryParam: { displayType: 'MENU' },
      allowCanceledDelete: false,
      formParentId: null,
      listFormatter: false,
      canCorrectPermission: process.env.ENV !== 'production'
    }
  },
  methods: {
    afterLoadList(list) {
      this.list = listPageTreeFormatter(list)
    },
    create() {
      this.createSubMenu({
        id: '0'
      })
    },
    createSubMenu(row) {
      this.formParentId = `${row.id}`
      setTimeout(() => {
        this.$refs.form.open(undefined)
      }, 300)
    }
  }
}
</script>

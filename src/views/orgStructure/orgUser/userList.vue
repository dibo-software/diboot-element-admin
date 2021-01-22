<template>
  <div class="orgUserList">
    <el-row>
      <el-col :lg="20" :md="24">
        <div class="filter-container">
          <el-input v-model="queryParam.realname" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="onSearch" />
          <el-select v-model="queryParam.status" placeholder="状态" style="width: 200px;" class="filter-item" @keyup.enter.native="onSearch">
            <el-option
              v-for="(item, index) in more.userStatusKvList"
              :key="index"
              :value="item.v"
              :label="item.k"
            />
          </el-select>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="onSearch">
            查询
          </el-button>
          <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="reset">
            重置
          </el-button>
        </div>
      </el-col>
      <el-col :lg="4" :md="24" style="text-align: right;">
        <el-button v-permission="['create']" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="$refs.form.open(undefined)">
          新建
        </el-button>
        <el-button v-permission="['import']" class="filter-item" style="margin-left: 10px;" type="default" icon="el-icon-plus" @click="$refs.form.open(undefined)">
          批量导入
        </el-button>
        <el-button v-permission="['export']" class="filter-item" style="margin-left: 10px;" type="default" icon="el-icon-plus" @click="$refs.form.open(undefined)">
          导出
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
      <el-table-column label="部门">
        <template slot-scope="scope">
          {{ scope.row.orgShortName }}
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.realname }}
        </template>
      </el-table-column>
      <el-table-column label="用户编号">
        <template slot-scope="scope">
          {{ scope.row.userNum }}
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          {{ scope.row.genderLabel }}
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobilePhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
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
            v-permission-again="['position', 'update', 'delete']"
          >
            <el-divider
              direction="vertical"
            />
          </span>
          <el-button
            v-permission="['position']"
            type="text"
            @click="this.$refs.userPositionRefForm.open(row.id)"
          >
            岗位
          </el-button>
          <span
            v-permission="['position']"
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
    <user-position-ref-form ref="userPositionRefForm" />
    <user-detail ref="detail" />
    <user-form
      ref="form"
      :current-node-id="currentNodeId"
      @complete="getList"
    />
  </div>
</template>
<script>
import userDetail from './userDetail'
import userForm from './userForm'
import waves from '@/directive/waves'
import list from '@/components/diboot/mixins/list'
import userPositionRefForm from '@/views/orgStructure/orgUser/userPositionRefForm'

export default {
  name: 'OrgUserList',
  components: {
    userDetail,
    userForm,
    userPositionRefForm
  },
  directives: { waves },
  mixins: [list],
  props: {
    currentNodeId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      baseApi: '/iam/user',
      exportApi: '/excel/export',
      getMore: true
    }
  },
  watch: {
    currentNodeId: function(val) {
      if (!val || val === '0' || val === 0) {
        this.customQueryParam = {}
      } else {
        this.customQueryParam = { orgId: val }
      }
      this.getList()
    }
  },
  methods: {
    openUserPositionRefForm(record) {
      this.$refs.userPositionRefForm.open(record)
    }
  }
}
</script>

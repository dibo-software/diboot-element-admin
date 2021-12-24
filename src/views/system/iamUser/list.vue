<template>
  <div class="app-container">
    <el-row>
      <el-col :lg="20" :md="24">
        <div class="filter-container">
          <el-input
            v-model="queryParam.realname"
            clearable
            placeholder="姓名"
            @keyup.enter.native="onSearch"
          />
          <el-select
            v-model="queryParam.status"
            clearable
            placeholder="状态"
            @change="onSearch"
          >
            <el-option
              v-for="(item, index) in more.userStatusOptions || []"
              :key="index"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
          <el-button v-waves type="primary" icon="el-icon-search" @click="onSearch">
            查询
          </el-button>
          <el-button type="info" icon="el-icon-refresh" @click="reset">
            重置
          </el-button>
        </div>
      </el-col>
      <el-col :lg="4" :md="24" style="text-align: right; padding: 20px">
        <el-button v-permission="['create']" type="primary" icon="el-icon-plus" @click="$refs.form.open(undefined)">
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
      row-key="id"
      @sort-change="appendSorterParam"
    >
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.realname }}
        </template>
      </el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          <div v-if="scope.row.roleList && scope.row.roleList.length > 0" class="tag-group">
            <el-tag
              v-for="item in scope.row.roleList"
              :key="item.name"
              type="success"
            >
              {{ item.name }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobilePhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.statusLabel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150" align="center" prop="createTime" sortable>
        <template slot-scope="scope">
          {{ scope.row.createTime }}
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
    <detail-modal ref="detail" />
    <form-modal
      ref="form"
      :current-node-id="currentNodeId"
      @complete="getList"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import list from '@/components/diboot/mixins/list'
import detailModal from './detail'
import formModal from './form'

export default {
  name: 'IamUserList',
  components: {
    detailModal,
    formModal
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
      allowCanceledDelete: false,
      attachMoreList: [
        {
          target: 'USER_STATUS'
        }
      ]
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
  }
}
</script>

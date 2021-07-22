<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParam.authAccount"
        clearable
        placeholder="用户名"
        @keyup.enter.native="onSearch"
      />
      <el-input
        v-model="queryParam.ipAddress"
        clearable
        placeholder="IP地址"
        @keyup.enter.native="onSearch"
      />
      <el-select v-model="queryParam.success" clearable placeholder="登录状态">
        <el-option
          :value="true"
          label="成功"
        />
        <el-option
          :value="false"
          label="失败"
        />
      </el-select>
      <el-button v-waves type="primary" icon="el-icon-search" @click="onSearch">
        查询
      </el-button>
      <el-button type="info" icon="el-icon-refresh" @click="reset">
        重置
      </el-button>
    </div>
    <el-table
      v-loading="loadingData"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      row-key="id"
      @sort-change="appendSorterParam"
    >
      <el-table-column label="用户类型">
        <template slot-scope="scope">
          {{ scope.row.userType }}
        </template>
      </el-table-column>
      <el-table-column label="用户ID">
        <template slot-scope="scope">
          {{ scope.row.userId }}
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{ scope.row.authAccount }}
        </template>
      </el-table-column>
      <el-table-column label="登录IP">
        <template slot-scope="scope">
          {{ scope.row.ipAddress }}
        </template>
      </el-table-column>
      <el-table-column label="登录方式">
        <template slot-scope="scope">
          {{ scope.row.authTypeLabel }}
        </template>
      </el-table-column>
      <el-table-column label="登录状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.success === true" type="success">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="登录时间" width="150" align="center" prop="createTime" sortable>
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        -
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
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import list from '@/components/diboot/mixins/list'

export default {
  name: 'LoginTraceList',
  components: {
  },
  directives: { waves },
  mixins: [list],
  data() {
    return {
      baseApi: '/iam/loginTrace'
    }
  },
  methods: {
  }
}
</script>

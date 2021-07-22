<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParam.userType"
        clearable
        placeholder="用户类型"
        @keyup.enter.native="onSearch"
      />
      <el-input
        v-model="queryParam.userId"
        clearable
        type="Number"
        placeholder="用户ID"
        @keyup.enter.native="onSearch"
      />
      <el-input
        v-model="queryParam.businessObj"
        clearable
        placeholder="业务对象"
        @keyup.enter.native="onSearch"
      />
      <el-select
        v-model="queryParam.requestMethod"
        clearable
        placeholder="请求方式"
        @change="onSearch"
      >
        <el-option value="GET" label="GET" />
        <el-option value="POST" label="POST" />
        <el-option value="PUT" label="PUT" />
        <el-option value="DELETE" label="DELETE" />
      </el-select>
      <el-select
        v-model="queryParam.status"
        clearable
        placeholder="状态"
        @change="onSearch"
      >
        <el-option value="0" label="成功" />
        <el-option value="1" label="失败" />
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
      <el-table-column label="用户姓名">
        <template slot-scope="scope">
          {{ scope.row.userRealname }}
        </template>
      </el-table-column>
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
      <el-table-column label="业务对象">
        <template slot-scope="scope">
          {{ scope.row.businessObj }}
        </template>
      </el-table-column>
      <el-table-column label="操作事项">
        <template slot-scope="scope">
          {{ scope.row.operation }}
        </template>
      </el-table-column>
      <el-table-column label="请求方式">
        <template slot-scope="scope">
          {{ scope.row.requestMethod }}
        </template>
      </el-table-column>
      <el-table-column label="请求URI">
        <template slot-scope="scope">
          {{ scope.row.requestUri }}
        </template>
      </el-table-column>
      <el-table-column label="状态码">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statusCode === 0" type="success">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="150" align="center" prop="createTime" sortable>
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
          <span v-permission-missing="['detail']">
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
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import list from '@/components/diboot/mixins/list'
import detailModal from './detail'

export default {
  name: 'OperationLogList',
  components: {
    detailModal
  },
  directives: { waves },
  mixins: [list],
  data() {
    return {
      baseApi: '/iam/operationLog'
    }
  }
}
</script>

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.name" placeholder="权限名称" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model="queryParam.code" placeholder="编码" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        查询
      </el-button>
      <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="reset">
        重置
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
      <el-table-column label="权限名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="编码">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="可操作权限">
        <template slot-scope="scope">
          <div v-if="scope.row._children && scope.row._children.length > 0" class="tag-group">
            <el-tag
              v-for="(permission, index) in scope.row._children"
              :key="index"
              type="success"
            >
              {{ permission.operationName }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150" align="center">
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
  name: 'IamRoleList',
  components: {
  },
  directives: { waves },
  mixins: [list],
  data() {
    return {
      baseApi: '/iam/permission',
      customQueryParam: { parentId: 0 },
      getMore: false
    }
  },
  methods: {
  }
}
</script>

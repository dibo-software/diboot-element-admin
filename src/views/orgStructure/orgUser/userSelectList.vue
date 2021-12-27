<template>
  <div class="orgUserList">
    <el-row>
      <el-col :lg="20" :md="24">
        <div class="filter-container">
          <el-input v-model="queryParam.realname" clearable placeholder="姓名" @keyup.enter.native="onSearch" />
          <el-select
            v-model="queryParam.status"
            clearable
            placeholder="状态"
            @change="onSearch"
          >
            <el-option
              v-for="(item, index) in more.userStatusOptions"
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
            type="text"
            @click="$emit('select', row)"
          >
            选择
          </el-button>
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
  </div>
</template>
<script>
import waves from '@/directive/waves'
import list from '@/components/diboot/mixins/list'

export default {
  name: 'UserSelectList',
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

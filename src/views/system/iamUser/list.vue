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
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.realname }}
        </template>
      </el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          <div class="tag-group" v-if="scope.row.roleList && scope.row.roleList.length > 0">
            <el-tag
              v-for="item in scope.row.roleList"
              :key="item.name"
              type="success"
              effect="dark">
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
      <el-table-column label="创建时间" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="$refs.detail.open(row.id)">
            详情
          </el-button>
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
    <detail-modal ref="detail" />
    <form-modal
      ref="form"
      :more="more"
      @refreshList="getList" />
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
  data() {
    return {
      baseApi: '/iam/user',
      deleteApiPrefix: '/delete',
      getMore: true
    }
  }
}
</script>

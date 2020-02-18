<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParam.itemName" placeholder="类型名称" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model="queryParam.type" placeholder="类型编码" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="$refs.form.open(undefined)">
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
            <el-form-item label="子项列表">
              <div class="tag-group" v-if="props.row._children && props.row._children.length > 0">
                <el-tag
                  v-for="item in props.row._children"
                  :key="item.itemValue"
                  type="success"
                  effect="dark">
                  {{ item.itemName }}
                </el-tag>
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="类型名称">
        <template slot-scope="scope">
          {{ scope.row.itemName }}
        </template>
      </el-table-column>
      <el-table-column label="类型编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
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
    <form-modal ref="form" @refreshList="getList" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import list from '@/components/diboot/mixins/list'
import detailModal from './detail'
import formModal from './form'

export default {
  name: 'DictList',
  components: {
    detailModal,
    formModal
  },
  directives: { waves },
  mixins: [list],
  data() {
    return {
      baseApi: '/dictionary',
      queryParam: { parentId: 0 },
      getMore: false,
      listLoading: true
    }
  }
}
</script>

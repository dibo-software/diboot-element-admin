<template>
  <div class="app-container">
    <el-row>
      <el-col :lg="16" :md="24">
        <div class="filter-container">
          <el-input
            v-model="queryParam.itemName"
            clearable
            placeholder="类型名称"
            @keyup.enter.native="onSearch"
          />
          <el-input
            v-model="queryParam.type"
            clearable
            placeholder="类型编码"
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
      height="100%"
      @sort-change="appendSorterParam"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-item-expand">
            <el-form-item label="子项列表">
              <div v-if="props.row._children && props.row._children.length > 0" class="tag-group">
                <el-tag
                  v-for="item in props.row._children"
                  :key="item.itemValue"
                  type="success"
                >
                  {{ item.itemName }}({{ item.itemValue }})
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
      <el-table-column label="类型编码">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150" prop="createTime" sortable>
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" class-name="small-padding fixed-width">
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
    <form-modal ref="form" @complete="getList" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import list from '@/components/diboot/mixins/list'
import detailModal from './detail'
import formModal from './form'

export default {
  name: 'DictionaryList',
  components: {
    detailModal,
    formModal
  },
  directives: { waves },
  mixins: [list],
  data() {
    return {
      baseApi: '/dictionary',
      customQueryParam: { parentId: 0 },
      allowCanceledDelete: false,
      listLoading: true
    }
  },
  methods: {
    /**
     * 更新或者删除
     * @param command update/delete
     * @param row     操作的行内容
     */
    menuCommand(command, row) {
      if (command === 'update') {
        if (row.isEditable) {
          this.$refs.form.open(row[this.primaryKey])
        } else {
          this.$message.warning('当前数据字典不可编辑')
        }
      } else if (command === 'delete') {
        if (row.isDeletable) {
          this.remove(row[this.primaryKey])
        } else {
          this.$message.warning('当前数据字典不可删除')
        }
      }
    }

  }
}
</script>

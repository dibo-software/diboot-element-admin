<template>
  <div class="app-container">
    <div class="table-page-search-wrapper">
      <el-form :inline="true" label-width="100px">
        <el-row :gutter="18">
          <el-col :md="8" :sm="24">
            <el-form-item label="名称">
              <el-input
                v-model="queryParam.name"
                clearable
                placeholder=""
                @keyup.enter.native="onSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-form-item label="类型">
              <el-input
                v-model="queryParam.type"
                clearable
                placeholder=""
                @keyup.enter.native="onSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <el-button v-waves type="primary" icon="el-icon-search" @click="onSearch">
                查询
              </el-button>
              <el-button type="info" icon="el-icon-refresh" @click="reset">
                重置
              </el-button>
            </span>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-operator">
      <el-button v-permission="['create']" type="default" plain icon="el-icon-plus" @click="$refs.form.open(undefined)">
        新建部门
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
      <el-table-column align="center" label="简称">
        <template slot-scope="scope">
          <span>{{ scope.row.shortName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="全称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.typeLabel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人">
        <template slot-scope="scope">
          <span>{{ scope.row.managerName }}</span>
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
                编辑
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
    <diboot-form ref="form" :current-node-id="currentNodeId" @complete="formComplete" />
    <diboot-detail ref="detail" />
  </div>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import waves from '@/directive/waves'
import dibootForm from './form'
import dibootDetail from './detail'

export default {
  name: 'OrgList',
  directives: { waves },
  components: {
    dibootForm,
    dibootDetail
  },
  mixins: [list],
  props: {
    currentNodeId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      baseApi: '/iam/org',
      customQueryParam: { parentId: '0' }
    }
  },
  watch: {
    currentNodeId: function(val) {
      this.customQueryParam = { parentId: val }
      this.getList()
    }
  },
  methods: {
    removeItem(id) {
      this.remove(id).then(() => {
        this.$emit('formComplete')
      })
    },
    formComplete() {
      this.getList()
      this.$emit('formComplete')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

<template>
  <div class="app-container">
    <div class="table-page-search-wrapper">
      <el-form :inline="true" label-width="100px">
        <el-row :gutter="18">
          <el-col :md="8" :sm="24">
            <el-form-item label="模版编码">
              <el-input
                v-model="queryParam.code"
                clearable
                placeholder=""
                @keyup.enter.native="onSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-form-item label="模版标题">
              <el-input
                v-model="queryParam.title"
                clearable
                placeholder=""
                @keyup.enter.native="onSearch"
              />
            </el-form-item>
          </el-col>
          <template v-if="advanced">
            <el-col :md="8" :sm="24">
              <el-form-item label="创建人">
                <el-select
                  v-model="queryParam.createBy"
                  placeholder=""
                  filterable
                  clearable
                  remote
                  :loading="attachMoreLoading"
                  :remote-method="value => attachMoreFilter(value, 'iamUser')"
                  @change="onSearch"
                >
                  <el-option
                    v-for="(item, index) in more.iamUserOptions || []"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <el-col :md="!advanced && 8 || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
            >
              <el-button v-waves type="primary" icon="el-icon-search" @click="onSearch">
                查询
              </el-button>
              <el-button type="info" icon="el-icon-refresh" @click="reset">
                重置
              </el-button>
              <el-link type="primary" :underline="false" @click="toggleAdvanced">
                {{ advanced ? '收起' : '展开' }}
                <i :class="advanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
              </el-link>
            </span>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="table-operator">
      <el-button v-permission="['create']" type="primary" icon="el-icon-plus" @click="$refs.form.open(undefined)">
        新建
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
      <el-table-column align="center" label="模版编码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="模版标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createByName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
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
    <diboot-form ref="form" @complete="getList" />
    <diboot-detail ref="detail" />
  </div>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import waves from '@/directive/waves'
import dibootForm from './form'
import dibootDetail from './detail'

export default {
  name: 'MessageTemplateList',
  directives: { waves },
  components: {
    dibootForm,
    dibootDetail
  },
  mixins: [list],
  data() {
    return {
      baseApi: '/messageTemplate',
      attachMoreLoader: {
        iamUser: {
          target: 'IamUser',
          label: 'realname',
          value: 'id'
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

<template>
  <div class="app-container">
    <div class="table-page-search-wrapper">
      <el-form :inline="true" label-width="100px">
        <el-row :gutter="18">
          <el-col :md="8" :sm="24">
            <el-form-item label="文件名">
              <el-input
                v-model="queryParam.fileName"
                clearable
                placeholder=""
                @keyup.enter.native="onSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-form-item label="创建人">
              <el-select
                v-model="queryParam.createBy"
                placeholder="上传者筛选"
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
          <template v-if="advanced">
            <el-col :md="8" :sm="24">
              <el-form-item label="创建时间">
                <date-range
                  v-model="dateRangeQuery.createTime"
                  @change="onSearch"
                />
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

    <el-table
      v-loading="loadingData"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      row-key="uuid"
      @sort-change="appendSorterParam"
    >
      <el-table-column align="center" label="关联对象类">
        <template slot-scope="scope">
          <span>{{ scope.row.relObjType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文件名">
        <template slot-scope="scope">
          <span>{{ scope.row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文件类型">
        <template slot-scope="scope">
          <span>{{ scope.row.fileType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据量">
        <template slot-scope="scope">
          <span>{{ scope.row.dataCount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createByName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            v-permission="['detail']"
            type="text"
            @click="$refs.detail.open(row.uuid)"
          >
            详情
          </el-button>
          <span
            v-permission="['detail']"
            v-permission-again="['update']"
          >
            <el-divider
              direction="vertical"
            />
          </span>
          <el-button
            v-permission="['detail']"
            type="text"
            @click="$refs.form.open(row.uuid)"
          >
            编辑
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

    <diboot-form ref="form" @complete="getList" />
    <diboot-detail ref="detail" />
  </div>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import waves from '@/directive/waves'
import dateRange from '@/components/diboot/components/dateRange'
import dibootForm from './form'
import dibootDetail from './detail'

export default {
  name: 'UploadFileList',
  directives: { waves },
  components: {
    dateRange,
    dibootForm,
    dibootDetail
  },
  mixins: [list],
  data() {
    return {
      baseApi: '/uploadFile',
      primaryKey: 'uuid',
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

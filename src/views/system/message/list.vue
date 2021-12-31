<template>
  <div class="app-container">
    <div class="table-page-search-wrapper">
      <el-form :inline="true" label-width="100px">
        <el-row :gutter="18">
          <el-col :md="8" :sm="24">
            <el-form-item label="信息模版">
              <el-select
                v-model="queryParam.templateId"
                clearable
                placeholder="请选择信息模版"
                @change="onSearch"
              >
                <el-option
                  v-for="(item, index) in more.messageTemplateOptions || []"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-form-item label="发送通道">
              <el-select
                v-model="queryParam.channel"
                clearable
                placeholder="请选择发送通道"
                @change="onSearch"
              >
                <el-option
                  v-for="item in more.messageChannelOptions || []"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="advanced">
            <el-col :md="8" :sm="24">
              <el-form-item label="消息状态">
                <el-select
                  v-model="queryParam.status"
                  clearable
                  placeholder="请选择消息状态"
                  @change="onSearch"
                >
                  <el-option
                    v-for="item in more.messageStatusOptions || []"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="queryParam.createTime"
                  clearable
                  type="date"
                  value-format="yyyy-MM-dd"
                  @change="onSearch"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="更新时间">
                <el-date-picker
                  v-model="queryParam.updateTime"
                  clearable
                  type="date"
                  value-format="yyyy-MM-dd"
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

    <div class="table-operator" />

    <el-table
      v-loading="loadingData"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      row-key="id"
      @sort-change="appendSorterParam"
    >
      <el-table-column align="center" label="业务类型">
        <template slot-scope="scope">
          <span>{{ scope.row.businessType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送方">
        <template slot-scope="scope">
          <span>{{ scope.row.sender }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="接收方">
        <template slot-scope="scope">
          <span>{{ scope.row.receiver }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送状态">
        <template slot-scope="scope">
          <span>{{ scope.row.statusLabel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送通道">
        <template slot-scope="scope">
          <span>{{ scope.row.channelLabel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
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
    <diboot-detail ref="detail" />
  </div>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import waves from '@/directive/waves'

import dibootDetail from './detail'

export default {
  name: 'MessageList',
  directives: { waves },
  components: {

    dibootDetail
  },
  mixins: [list],
  data() {
    return {
      baseApi: '/message',
      attachMoreList: [
        {
          target: 'messageTemplate',
          label: 'title',
          value: 'id'
        },
        {
          target: 'MESSAGE_CHANNEL'
        },
        {
          target: 'MESSAGE_STATUS'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

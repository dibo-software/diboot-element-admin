<template>
  <div class="app-container">
    <div class="table-page-search-wrapper">
      <el-form :inline="true" label-width="100px">
        <el-row :gutter="18">
          <el-col :md="8" :sm="24">
            <el-form-item label="信息模版" style="width: 100%;">
              <el-select v-model="queryParam.templateId" placeholder="请选择信息模版" style="width: 100%;">
                <el-option
                  v-if="more.messageTemplateKvList"
                  v-for="(item, index) in more.messageTemplateKvList"
                  :key="index"
                  :value="item.v"
                  :label="item.k"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-form-item label="发送通道" style="width: 100%;">
              <el-select v-model="queryParam.channel" placeholder="请选择发送通道" style="width: 100%;">
                <el-option
                  v-for="kv in more.messageChannelKvList"
                  v-if="more.messageChannelKvList"
                  :key="kv.v"
                  :value="kv.v"
                  :label="kv.k"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="advanced">
            <el-col :md="8" :sm="24">
              <el-form-item label="消息状态" style="width: 100%;">
                <el-select v-model="queryParam.status" placeholder="请选择消息状态" style="width: 100%;">
                  <el-option
                    v-for="kv in more.messageStatusKvList"
                    v-if="more.messageStatusKvList"
                    :key="kv.v"
                    :value="kv.v"
                    :label="kv.k"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="创建时间" style="width: 100%;">
                <el-date-picker
                  v-model="queryParam.createTime"
                  type="date"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="更新时间" style="width: 100%;">
                <el-date-picker
                  v-model="queryParam.updateTime"
                  type="date"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
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
              <el-button style="margin-left: 8px" type="info" icon="el-icon-refresh" @click="reset">
                重置
              </el-button>
              <el-link type="primary" :underline="false" style="margin-left: 8px" @click="toggleAdvanced">
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
      getListFromMixin: true,
      attachMoreList: [
        {
          type: 'T',
          target: 'message_template',
          key: 'title',
          value: 'id'
        },
        {
          type: 'D',
          target: 'MESSAGE_CHANNEL'
        },
        {
          type: 'D',
          target: 'MESSAGE_STATUS'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

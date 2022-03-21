<template>
  <el-dialog
    class="detailModal"
    :visible.sync="listState.visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
    width="80%"
  >
    <div class="app-container">
      <div class="table-page-search-wrapper">
        <el-row :gutter="18">
          <el-col :lg="24" :md="24" class="filter-container">
            <el-input v-model="queryParam.jobName" placeholder="任务名称" clearable @keyup.enter.native="onSearch" />
            <el-select
              v-model="queryParam.runStatus"
              clearable
              placeholder="请选择执行状态"
              @change="onSearch"
            >
              <el-option value="S" label="成功" />
              <el-option value="F" label="失败" />
            </el-select>
            <el-button v-waves type="primary" icon="el-icon-search" @click="onSearch">
              查询
            </el-button>
            <el-button type="info" icon="el-icon-refresh" @click="reset">
              重置
            </el-button>
          </el-col>
        </el-row>
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
        <el-table-column align="center" label="任务名称">
          <template slot-scope="scope">
            <span>{{ scope.row.jobName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="定时表达式">
          <template slot-scope="scope">
            <span>{{ scope.row.cron }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开始时间">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束时间">
          <template slot-scope="scope">
            <span>{{ scope.row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="耗时(s)">
          <template slot-scope="scope">
            <span>{{ scope.row.elapsedSeconds }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.runStatusLabel }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="执行结果信息" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.executeMsg }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button v-permission="['detail']" type="text" @click="$refs.detail.open(row.id)">
              详情
            </el-button>
            <el-divider direction="vertical" />
            <el-button v-permission="['update']" type="text" href="javascript:;" @click="handleExecuteOnce(row.jobId)">运行一次</el-button>
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
  </el-dialog>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import dibootDetail from './detail'
import { dibootApi } from '@/utils/request'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'ScheduleJobLogList',
  components: {
    dibootDetail
  },
  directives: { waves },
  mixins: [list],
  data() {
    return {
      baseApi: '/scheduleJob/log',
      getListFromMixin: false,
      listState: {
        visible: false
      },
      fullscreen: false
    }
  },
  methods: {
    open() {
      this.listState.visible = true
      this.getList()
    },
    handleCancel() {
      this.listState.visible = false
    },
    /**
     * 执行一次任务
     * @param id
     * @returns {Promise<void>}
     */
    async handleExecuteOnce(id) {
      try {
        const res = await dibootApi.put(`/scheduleJob/executeOnce/${id}`)
        if (res.code === 0) {
          this.$message.success('发送执行任务成功！')
        } else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        console.log(e)
        this.$message.error('发送执行任务失败！')
      }
      this.getList()
    }
  }

}
</script>
<style lang="less" scoped>
</style>

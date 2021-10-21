<template>
  <div class="app-container">
    <div class="table-page-search-wrapper">
      <el-row>
        <el-col :lg="16" :md="24" class="filter-container">
          <el-input v-model="queryParam.jobName" placeholder="任务名称" clearable @keyup.enter.native="onSearch" />
          <el-select
            v-model="queryParam.jobStatus"
            clearable
            placeholder="请选择状态"
            @change="onSearch"
          >
            <el-option value="A" label="启用" />
            <el-option value="I" label="停用" />
          </el-select>
          <el-button v-waves type="primary" icon="el-icon-search" @click="onSearch">
            查询
          </el-button>
          <el-button type="info" icon="el-icon-refresh" @click="reset">
            重置
          </el-button>
        </el-col>
        <el-col :lg="8" :md="24" style="text-align: right; position: relative; top: 20px;">
          <el-button v-permission="['create']" type="primary" icon="el-icon-plus" @click="$refs.form.open(undefined)">
            新建
          </el-button>
          <el-button v-permission="['logList']" type="default" icon="el-icon-tickets" @click="$refs.logList.open()">
            日志记录
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
      <el-table-column align="center" label="初始化策略">
        <template slot-scope="scope">
          <span>{{ initStrategyEnum[scope.row.initStrategy] || '周期执行' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-switch
            :key="loadingData"
            v-model="scope.row.jobStatus"
            v-permission="['update']"
            active-value="A"
            inactive-value="I"
            active-text="启用"
            inactive-text="停用"
            @change="handleSwitchChange(scope.row)"
          />
          <span v-permission-missing="['update']">
            <el-tag
              v-if="scope.row.jobStatus === 'A'"
              :key="scope.row.jobStatusLabel"
              effect="dark"
            >
              {{ scope.row.jobStatusLabel }}
            </el-tag>
            <el-tag
              v-else
              :key="scope.row.jobStatusLabel"
              type="info"
              effect="dark"
            >
              {{ scope.row.jobStatusLabel }}
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="记录日志">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.saveLog" type="success">开启</el-tag>
          <el-tag v-else type="info">关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建者" prop="createByName" />
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
            v-permission-again="['executeOnce', 'update', 'delete']"
          >
            <el-divider
              direction="vertical"
            />
          </span>
          <el-button v-permission="['executeOnce']" type="text" href="javascript:;" @click="handleExecuteOnce(row.id)">运行一次</el-button>
          <span
            v-permission="['executeOnce']"
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
    <diboot-log-list ref="logList" />
  </div>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import dibootForm from './form'
import dibootDetail from './detail'
import dibootLogList from './log/list'
import { dibootApi } from '@/utils/request'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'ScheduleJobList',
  components: {
    dibootForm,
    dibootDetail,
    dibootLogList
  },
  directives: { waves },
  mixins: [list],
  data() {
    return {
      baseApi: '/scheduleJob',
      initStrategyEnum: {
        DO_NOTHING: '周期执行',
        FIRE_AND_PROCEED: '立即执行一次，并周期执行',
        IGNORE_MISFIRES: '超期立即执行，并周期执行'
      }
    }
  },
  methods: {
    /**
     * 改变状态
     * @param value
     * @returns {Promise<void>}
     */
    async handleSwitchChange(value) {
      try {
        const res = await dibootApi.put(`/scheduleJob/${value.id}/${value.jobStatus}`)
        if (res.code === 0) {
          this.$message.success('修改任务状态成功！')
        } else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        console.log(e)
        this.$message.error('修改任务状态失败！')
      }
      this.getList()
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

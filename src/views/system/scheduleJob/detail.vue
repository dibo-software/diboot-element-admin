<template>
  <el-dialog
    class="detailModal"
    :visible.sync="visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
  >
    <el-row slot="title" type="flex">
      <el-col :span="20">查看详情</el-col>
      <el-col :span="4" style="text-align: right">
        <svg-icon
          :icon-class="!fullscreen ? 'fullscreen': 'exit-fullscreen'"
          style="cursor: pointer; margin-right: 10px"
          @click="() => {fullscreen = !fullscreen}"
        />
        <i class="el-icon-close" style="cursor: pointer" @click="close" />
      </el-col>
    </el-row>
    <el-form label-position="left" inline class="detail-item-container">
      <el-row :gutter="18">
        <el-col :span="12">
          <el-form-item label="任务编码">
            {{ model.jobKey }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务名称">
            <span>{{ model.jobName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="定时表达式">
            <span>{{ model.cron }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参数">
            <span>{{ model.paramJson }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="初始化策略">
            <span>{{ initStrategyEnum[model.initStrategy] || '周期执行' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <span>{{ model.jobStatusLabel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="记录日志">
            <span>{{ model.saveLog ? '开启' : '关闭' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注">
            <span>{{ model.jobComment }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            {{ model.createTime }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建者">
            {{ model.createByName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="更新时间">
            {{ model.updateTime }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" @click="close">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'

export default {
  name: 'ScheduleJobDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/scheduleJob',
      initStrategyEnum: {
        DO_NOTHING: '周期执行',
        FIRE_AND_PROCEED: '立即执行一次，并周期执行',
        IGNORE_MISFIRES: '超期立即执行，并周期执行'
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>

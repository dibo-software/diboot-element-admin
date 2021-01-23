<template>
  <el-dialog
    class="detailModal"
    :visible.sync="visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
    append-to-body
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
      <el-form-item label="任务名称">
        <span>{{ model.jobName }}</span>
      </el-form-item>
      <el-form-item label="定时表达式">
        <span>{{ model.cron }}</span>
      </el-form-item>
      <el-form-item label="状态">
        <span>{{ statusEnum[model.runStatus]}}</span>
      </el-form-item>
      <el-form-item label="开始时间">
        {{ model.startTime }}
      </el-form-item>
      <el-form-item label="结束时间">
        {{ model.endTime }}
      </el-form-item>
      <el-form-item label="耗时(s)">
        {{ model.elapsedSeconds }}
      </el-form-item>
      <el-form-item label="结果信息">
        {{ model.executeMsg }}
      </el-form-item>
      <el-form-item label="创建时间">
        {{ model.createTime }}
      </el-form-item>
      <el-form-item label="更新时间">
        {{ model.createTime }}
      </el-form-item>
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
  name: 'ScheduleJobLogDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/scheduleJob/log',
      statusEnum: {
        S: '成功',
        F: '失败'
      }
    }
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
</style>

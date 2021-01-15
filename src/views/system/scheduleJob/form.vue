<template>
  <el-dialog
    :visible.sync="state.visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
  >
    <el-row slot="title" type="flex">
      <el-col :span="20">{{ title }}</el-col>
      <el-col :span="4" style="text-align: right">
        <svg-icon
          :icon-class="!fullscreen ? 'fullscreen': 'exit-fullscreen'"
          style="cursor: pointer; margin-right: 10px"
          @click="() => {fullscreen = !fullscreen}"
        />
        <i class="el-icon-close" style="cursor: pointer" @click="close" />
      </el-col>
    </el-row>
    <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="120px">
      <el-form-item label="任务" prop="jobName">
        <el-select
          @change="handleJobSelectChange"
          v-model="form.jobName"
          placeholder="请选择任务"
          style="width: 100%;"
        >
          <el-option
            v-for="(item, index) in jobList"
            :key="index"
            :value="item.jobName"
            :label="item.jobName"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="cron">
        <template slot="label">
              <span>定时表达式
                 <el-tooltip class="item" effect="dark" placement="right-start">
                  <template slot="content">
                    格式：<br>
                    * * 1 * * ?<br>
                    含义:<br>
                    秒 分 时 日 月 星期 年
                  </template>
                  <i class="el-icon-question" style="cursor: pointer"></i>
                </el-tooltip>
                </span>
        </template>
        <el-input
          placeholder="* * 1 * * ? (秒 分 时 日 月 星期 年)"
          v-model="form.cron"
        />
      </el-form-item>
      <el-form-item label="参数" prop="paramJson">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入参数"
          v-model="form.paramJson">
        </el-input>
      </el-form-item>
      <el-form-item label="初始化策略" prop="initStrategy">
        <el-select v-model="form.initStrategy" placeholder="请选择初始化策略" style="width:100%">
          <el-option value="DO_NOTHING" label="周期执行"/>
          <el-option value="FIRE_AND_PROCEED" label="立即执行一次，并周期执行"/>
          <el-option value="IGNORE_MISFIRES" label="超期立即执行，并周期执行"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="jobStatus">
        <el-radio-group v-model="form.jobStatus"  size="mini">
          <el-radio-button label="A">启用</el-radio-button>
          <el-radio-button label="I">停用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="jobComment">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入备注"
          v-model="form.jobComment">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit" @click="onSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
export default {
  name: 'ScheduleJobForm',
  mixins: [form],
  data() {
    return {
      baseApi: '/scheduleJob',
      jobList: [],
      jobExample: {},
      jobCron: {},
      rules: {
        'jobName': [{ required: true, message: '任务名称不能为空', trigger: 'change' }],
        'cron': [{ required: true, message: '表达式不能为空', trigger: 'blur' }],
        'paramJson': [{ validator: this.checkJson, trigger: 'blur' }],
        'initStrategy': [{ required: true, message: '初始化策略不能为空', trigger: 'change' }],
        'jobStatus': [{ required: true, message: '状态不能为空', trigger: 'change' }]
      }
    }
  },
  methods: {
    afterOpen(id) {
      this.loadJobs()
    },
    /**
     * 检查json数据格式
     */
    checkJson(rule, value, callback) {
      if (!value) {
        callback()
        return
      } else {
        try {
          JSON.parse(value)
          callback()
        } catch (err) {
          callback(new Error('请输入正确的JSON格式'))
        }
      }
    },
    /**
     * 加载job
     * @returns {Promise<void>}
     */
    async loadJobs() {
      const res = await dibootApi.get('/scheduleJob/allJobs')
      if (res.code === 0) {
        this.jobList = res.data || []
        this.jobList.forEach(value => {
          this.jobExample[value.jobName] = value.paramJsonExample
          this.jobCron[value.jobName] = value.jobCron
        })
      } else {
        this.$message.error('无可执行定时任务！')
      }
    },
    handleJobSelectChange(value) {
      this.$set(this.form, 'paramJson', this.jobExample[value])
      this.$set(this.form, 'cron', this.jobCron[value])
    }
  }
}
</script>
<style lang="less" scoped>
</style>

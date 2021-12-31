<template>
  <div class="app-container">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="120px">
          <el-form-item label="姓名" prop="realname">
            <el-input v-model="form.realname" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select
              v-model="form.gender"
              placeholder="性别"
            >
              <el-option
                v-for="(item, index) in more.genderOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="mobilePhone">
            <el-input v-model="form.mobilePhone" placeholder="请输入电话" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="xxx@xxx.com" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'

export default {
  name: 'AccountSetting',
  mixins: [form],
  data() {
    return {
      baseApi: '/iam/user',
      attachMoreList: [
        {
          target: 'GENDER'
        }
      ],
      initFormData: {
        realname: '',
        gender: '',
        mobilePhone: '',
        email: []
      },
      rules: {
        'realname': [{ required: true, message: '姓名不能为空', trigger: 'change' }],
        'gender': [{ required: true, message: '性别不能为空', trigger: 'change' }]
      }
    }
  },
  async mounted() {
    await this.getCurrentUserInfo()
  },
  methods: {
    async getCurrentUserInfo() {
      const res = await dibootApi.get('/iam/user/getCurrentUserInfo')
      if (res.code === 0) {
        this.form = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    /**
     * 更新记录的提交
     * @param values
     * @returns {Promise<string>}
     */
    async update(values) {
      const res = await dibootApi.post(`${this.baseApi}/updateCurrentUserInfo`, values)
      if (res.code === 0) {
        return { data: res.data, msg: '保存成功' }
      } else {
        throw new Error(res.msg)
      }
    },
    /**
     * 提交成功之后的处理
     * @param msg
     */
    submitSuccess(result) {
      this.$notify.success({
        title: '操作成功',
        message: result.msg
      })
      this.$store.commit('SET_NAME', this.form.realname)
    }
  }
}
</script>

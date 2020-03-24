<template>
  <div class="app-container">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="120px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码" />
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="请输入确认密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">更改密码</el-button>
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
      more: {},
      initFormData: {
        oldPassword: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        'oldPassword': [{ required: true, message: '旧密码不能为空', trigger: 'change' }],
        'password': [{ required: true, message: '新密码不能为空', trigger: 'change' }],
        'confirmPassword': [{ required: true, message: '确认密码不能为空', trigger: 'change' }, { validator: this.confirmPwdValidator, trigger: 'blur' }]
      }
    }
  },
  methods: {
    /**
     * 新建记录的提交
     * @param values
     * @returns {Promise<string>}
     */
    async add(values) {
      const res = await dibootApi.post(`${this.baseApi}/changePwd`, values)
      if (res.code === 0) {
        return { data: res.data, msg: '更改密码成功' }
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
      this.$refs['dataForm'].resetFields()
      this.$store.dispatch('user/logout').then(res => {
        window.location.reload()
      })
        .catch(err => {
          console.log(err)
          window.location.reload()
        })
    },
    confirmPwdValidator(rule, value, callback) {
      if (!value) {
        callback()
      }
      if (value === this.form.password) {
        callback()
      }
      callback(new Error('确认密码与新密码不一致'))
    }
  }
}
</script>

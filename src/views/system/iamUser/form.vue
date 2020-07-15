<template>
  <el-dialog
    :visible.sync="state.visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
  >
    <el-row slot="title" type="flex">
      <el-col :span="20">{{title}}</el-col>
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
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="用户编号" prop="userNum">
        <el-input v-model="form.userNum" placeholder="请输入用户编号" />
      </el-form-item>
      <el-form-item label="姓名" prop="realname">
        <el-input v-model="form.realname" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="角色" prop="roleIdList">
        <el-select
          v-if="more.iamRoleKvList"
          v-model="form.roleIdList"
          multiple
          placeholder="请选择角色"
          style="width: 100%;"
        >
          <el-option
            v-for="(item, index) in more.iamRoleKvList"
            :key="index"
            :value="item.v"
            :label="item.k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select
          v-if="more.genderKvList"
          v-model="form.gender"
          placeholder="请选择性别"
          style="width: 100%;"
        >
          <el-option
            v-for="(item, index) in more.genderKvList"
            :key="index"
            :value="item.v"
            :label="item.k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-if="more.userStatusKvList"
          v-model="form.status"
          placeholder="请选择状态"
          style="width: 100%;"
        >
          <el-option
            v-for="(item, index) in more.userStatusKvList"
            :key="index"
            :value="item.v"
            :label="item.k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-button
          v-if="setPassword === false"
          type="primary"
          @click="setPassword = true"
        >
          重设密码
        </el-button>
        <el-input
          v-if="setPassword === true"
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item label="电话" prop="mobilePhone">
        <el-input v-model="form.mobilePhone" placeholder="请输入电话" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="xxx@xxx.com" />
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
  name: 'IamUserForm',
  mixins: [form],
  data() {
    return {
      baseApi: '/iam/user',
      setPassword: false,
      initFormData: {
        username: '',
        userNum: '',
        realname: '',
        roleIdList: [],
        roleList: [],
        gender: '',
        status: '',
        mobilePhone: '',
        email: ''
      },
      rules: {
        'username': [{ required: true, message: '用户名不能为空', trigger: 'blur' }, { validator: this.checkUsernameDuplicate, trigger: 'blur' }],
        'userNum': [{ required: true, message: '用户编号不能为空', trigger: 'blur' }, { validator: this.checkUserNumDuplicate, trigger: 'blur' }],
        'realname': [{ required: true, message: '姓名不能为空', trigger: 'change' }],
        'password': [{ validator: this.checkPassword, trigger: 'blur' }],
        'roleIdList': [{ required: true, message: '角色不能为空', trigger: 'change' }],
        'gender': [{ required: true, message: '性别不能为空', trigger: 'change' }],
        'status': [{ required: true, message: '用户状态不能为空', trigger: 'change' }]
      },
      attachMoreList: [
        {
          type: 'D',
          target: 'GENDER'
        },
        {
          type: 'D',
          target: 'USER_STATUS'
        },
        {
          type: 'T',
          target: 'iamRole',
          key: 'name',
          value: 'id'
        }
      ]
    }
  },
  methods: {
    async afterOpen(id) {
      if (id === undefined) {
        this.setPassword = true
      } else {
        this.setPassword = false
      }
      // 将roleList设置到表单中
      if (this.form.roleList && this.form.roleList.length > 0) {
        const roleIdList = this.form.roleList.map(role => {
          return role.id
        })
        this.$set(this.form, 'roleIdList', roleIdList)
      }
      // 获取account的username信息到表单中
      if (id !== undefined) {
        const res = await dibootApi.get(`${this.baseApi}/getUsername/${id}`)
        if (res.code === 0) {
          this.$set(this.form, 'username', res.data)
        }
      }
    },
    checkUsernameDuplicate(rule, value, callback) {
      if (!value) {
        callback()
        return
      } else {
        const params = { id: this.form.id, username: value }
        dibootApi.get(`${this.baseApi}/checkUsernameDuplicate`, params).then(res => {
          if (res.code === 0) {
            callback()
          } else {
            callback(new Error(res.msg.split(':')[1]))
          }
        }).catch(err => {
          callback(new Error(err))
        })
      }
    },
    async checkUserNumDuplicate(rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.form.id, userNum: value }
      try {
        const res = await dibootApi.get(`${this.baseApi}/checkUserNumDuplicate`, params)
        if (res.code === 0) {
          callback()
        } else {
          callback(res.msg.split(':')[1])
        }
      } catch (err) {
        callback(new Error(err))
      }
    },
    checkPassword(rule, value, callback) {
      if (!this.setPassword) {
        callback()
        return
      }
      if (!value) {
        callback('密码不能为空')
        return
      }
      callback()
    },
    async enhance(values) {
      values.orgId = 0
    }
  }
}
</script>

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
      <el-form-item label="所属部门" prop="orgId">
        <el-select
          v-model="form.orgId"
          placeholder="请选择所属部门"
          filterable
        >
          <template
            v-if="orgIndentList.length > 0"
          >
            <el-option
              v-for="(item, index) in orgIndentList"
              :key="index"
              :value="`${item.value}`"
              :label="item.label"
            />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="系统用户">
        <el-switch
          v-model="systemUser"
          active-color="#13ce66"
          inactive-color="#c6c6c6"
        />
      </el-form-item>
      <el-form-item v-if="systemUser" label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item v-if="systemUser" label="角色" prop="roleIdList">
        <el-select
          v-model="form.roleIdList"
          multiple
          placeholder="请选择角色"
        >
          <el-option
            v-for="(item, index) in more.iamRoleOptions"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="systemUser" label="密码" prop="password">
        <el-button
          v-if="setPassword === false"
          type="primary"
          @click="setPassword = true"
        >重设密码</el-button>
        <el-input
          v-else
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="realname">
        <el-input v-model="form.realname" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="用户编号" prop="userNum">
        <el-input v-model="form.userNum" placeholder="请输入用户编号" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select
          v-model="form.gender"
          placeholder="请选择性别"
        >
          <el-option
            v-for="(item, index) in more.genderOptions"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
        >
          <el-option
            v-for="(item, index) in more.userStatusOptions"
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
      <el-form-item label="生日" prop="birthdate">
        <el-date-picker v-model="form.birthdate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
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
import { treeListFormatter, treeList2IndentList } from '@/utils/treeDataUtil'
import _ from 'lodash'

export default {
  name: 'OrgUserForm',
  mixins: [form],
  props: {
    currentNodeId: {
      type: String,
      default: () => {
        return '0'
      }
    }
  },
  data() {
    return {
      baseApi: '/iam/user',
      initFormData: {
        orgId: '0',
        positionIdList: [],
        reportManagerId: '',
        username: '',
        roleIdList: [],
        roleList: [],
        password: '',
        userNum: '',
        realname: '',
        gender: '',
        status: '',
        mobilePhone: '',
        email: ''
      },
      rules: {
        'orgId': [{ required: true, message: '请选择上级部门', trigger: 'blur' }],
        'username': [{ required: true, message: '用户名不能为空', trigger: 'blur' }, { validator: this.checkUsernameDuplicate, trigger: 'blur' }],
        'password': [{ validator: this.checkPassword, trigger: 'blur' }],
        'realname': [{ required: true, message: '姓名不能为空', trigger: 'change' }],
        'userNum': [{ required: true, message: '用户编号不能为空', trigger: 'blur' }, { validator: this.checkUserNumDuplicate, trigger: 'blur' }],
        'gender': [{ required: true, message: '性别不能为空', trigger: 'change' }],
        'status': [{ required: true, message: '用户状态不能为空', trigger: 'change' }]
      },
      orgList: [],
      systemUser: false,
      setPassword: false,
      attachMoreList: [
        {
          target: 'USER_STATUS'
        },
        {
          target: 'GENDER'
        },
        {
          target: 'IamRole',
          label: 'name',
          value: 'id'
        }
      ]
    }
  },
  computed: {
    orgTreeList: function() {
      if (this.orgList == null || this.orgList.length === 0) {
        return []
      }
      const orgTreeList = treeListFormatter(_.cloneDeep(this.orgList), 'id', 'shortName', true)
      orgTreeList.unshift({ label: '无', value: '0', key: '0' })
      return orgTreeList
    },
    orgIndentList: function() {
      if (this.orgTreeList.length === 0) {
        return []
      }
      return treeList2IndentList(this.orgTreeList)
    }
  },
  methods: {
    async afterOpen(id) {
      // 加载部门树数据
      this.loadOrgTree()
      // 获取account的username信息到表单中
      this.loadUsername()
      // 回显岗位配置数据
      this.showPositionConfig()
      // 新建显示密码填写，更新隐藏密码填写
      if (id == null) {
        this.setPassword = true
      } else {
        this.setPassword = false
      }
      // 将orgId转为String类型
      if (this.form.orgId) {
        this.form.orgId = `${this.form.orgId}`
      }
      // 将roleList设置到表单中
      if (this.form.roleList && this.form.roleList.length > 0) {
        const roleIdList = this.form.roleList.map(role => {
          return role.id
        })
        this.$set(this.form, 'roleIdList', roleIdList)
      }
      // 如果orgId为空，则将当前节点设置到表单中
      console.log('formOrgid', this.form.orgId)
      if (!this.form.orgId || this.form.orgId === 0 || this.form.orgId === '0') {
        this.form.orgId = this.currentNodeId
      }
    },
    async loadOrgTree() {
      const res = await dibootApi.get(`/iam/org/tree`)
      if (res.code === 0) {
        this.orgList = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    showPositionConfig() {
      if (this.form.positionList == null || this.form.positionList.length === 0) {
        return undefined
      }
      const positionIdList = this.form.positionList.map(item => {
        return item.id.toString()
      })
      setTimeout(() => {
        this.$set(this.form, 'positionIdList', positionIdList)
      }, 200)
    },
    async loadUsername() {
      const id = this.form.id
      if (id != null) {
        const res = await dibootApi.get(`${this.baseApi}/getUsername/${id}`)
        if (res.code === 0 && res.data) {
          this.systemUser = true
          setTimeout(() => {
            this.$set(this.form, 'username', res.data)
          }, 200)
        }
      }
    },
    selectReportManager(user) {
      this.form.reportManagerName = user.realname
      this.$set(this.form, 'reportManagerId', user.id)
    },
    async checkUserNumDuplicate(rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.form.id, userNum: value }
      const res = await dibootApi.get(`${this.baseApi}/checkUserNumDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
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
    afterClose() {
      this.systemUser = false
      this.setPassword = false
    }
  }
}
</script>

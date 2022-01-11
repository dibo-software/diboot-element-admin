<template>
  <el-dialog
    :visible.sync="state.visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
  >
    <el-row slot="title" type="flex">
      <el-col :span="20">岗位列表设置</el-col>
      <el-col :span="4" style="text-align: right">
        <svg-icon
          :icon-class="!fullscreen ? 'fullscreen': 'exit-fullscreen'"
          style="cursor: pointer; margin-right: 10px"
          @click="() => {fullscreen = !fullscreen}"
        />
        <i class="el-icon-close" style="cursor: pointer" @click="close" />
      </el-col>
    </el-row>
    <div class="table-operator">
      <el-button v-permission="['addPosition']" type="primary" icon="el-icon-plus" @click="addUserPosition">
        添加人员岗位设置
      </el-button>
      <el-button icon="el-icon-plus" @click="$refs.positionForm.open()">
        添加岗位
      </el-button>
    </div>
    <el-form ref="form" :inline="true" :rules="formRules" :model="form">
      <template v-for="(item, i) in form.userPositionList">
        <el-row :key="item.id">
          <el-form-item label="岗位" :prop="`userPositionList.${i}.positionId`">
            <el-select
              v-model="item.positionId"
              placeholder="请选择岗位列表"
              style="width: 160px;"
              filterable
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in more.iamPositionOptions"
                :key="item.value"
                :value="`${item.value}`"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="组织" :prop="`userPositionList.${i}.orgId`">
            <el-select
              v-model="item.orgId"
              placeholder="请选择组织部门"
              style="width: 160px;"
              filterable
            >
              <template v-if="orgIndentList.length > 0">
                <el-option
                  v-for="(org, index) in orgIndentList"
                  :key="index"
                  :value="`${org.value}`"
                  :label="org.label"
                />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="主岗">
            <el-switch
              v-model="item.isPrimaryPosition"
              active-color="#13ce66"
              inactive-color="#acacac"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="danger" icon="el-icon-delete" @click="removeUserPosition(i)" />
          </el-form-item>
        </el-row>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit" @click="onSubmit">
        确定
      </el-button>
    </div>
    <position-form
      ref="positionForm"
      @complete="attachMore"
    />
  </el-dialog>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
import { treeList2IndentList, treeListFormatter } from '@/utils/treeDataUtil'
import positionForm from '../position/form'
import _ from 'lodash'

const USER_POSITION_ITEM = {
  userType: 'IamUser',
  userId: '0',
  positionId: '',
  orgId: '0',
  isPrimaryPosition: false
}

export default {
  name: 'UserPositionRefForm',
  components: {
    positionForm
  },
  mixins: [form],
  data() {
    return {
      baseApi: 'iam/userPosition',
      attachMoreList: [
        {
          target: 'IamPosition',
          label: 'name'
        }
      ],
      user: {},
      orgList: [],
      form: {
        userPositionList: []
      }
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
    },
    formRules: function() {
      const rules = {}
      if (!this.form.userPositionList || this.form.userPositionList.length === 0) {
        return rules
      }
      for (let i = 0; i < this.form.userPositionList.length; i++) {
        rules[`userPositionList.${i}.positionId`] = [{ required: true, message: '请选择岗位', trigger: 'blur' }]
        rules[`userPositionList.${i}.orgId`] = [{ required: true, message: '请选择组织部门', trigger: 'blur' }]
      }
      return rules
    }
  },
  methods: {
    async open(user) {
      this.user = user
      this.state.visible = true
      this.attachMore()
      this.loadUserPositionList(user.id)
      this.loadOrgList()
    },
    addUserPosition() {
      // 复制一份用户岗位对象
      const item = _.cloneDeep(USER_POSITION_ITEM)
      // 设置用户岗位对象的组织部门为当前用户默认的部门
      item.orgId = `${this.user.orgId}`
      // 添加当前用户岗位对象
      this.form.userPositionList.push(item)
      this.$forceUpdate()
    },
    removeUserPosition(index) {
      this.form.userPositionList.splice(index, 1)
      this.$forceUpdate()
    },
    loadOrgList() {
      dibootApi.get('/iam/org/tree').then(res => {
        if (res.code === 0) {
          this.orgList = res.data
          this.$forceUpdate()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    loadUserPositionList(value) {
      if (!value) {
        return false
      }
      // 当部门改变后，需要获取当前部门已配置的岗位列表，并回显到当前表单中
      dibootApi.get(`/iam/position/listUserPositions/IamUser/${value}`).then(res => {
        const data = res.data
        if (data && data.length > 0) {
          data.forEach(item => {
            // 转为String类型
            item.positionId = `${item.positionId}`
            item.orgId = `${item.orgId}`
            // 组织部门为0时，默认设置当前用户orgId
            if (item.orgId === '0' || !item.orgId) {
              item.orgId = `${this.user.orgId}`
            }
            this.form.userPositionList = res.data
          })
        } else {
          this.form.userPositionList = []
        }
        this.$forceUpdate()
      }).catch(() => {
        this.form.userPositionList = []
      })
    },
    async onSubmit() {
      try {
        this.state.confirmSubmit = true
        try {
          await this.formModelValidate()
        } catch (e) {
          this.$message.error('请完善岗位信息')
          return false
        }
        const values = {
          userType: 'IamUser',
          userId: this.user.id,
          userPositionList: this.form.userPositionList
        }
        const res = await dibootApi.post('/iam/position/batchUpdateUserPositionRelations', values)
        this.state.confirmSubmit = false
        if (res.code === 0) {
          // 执行提交失败后的一系列后续操作
          this.submitSuccess(res)
        } else {
          // 执行一系列后续操作
          this.submitFailed(res.msg)
        }
      } catch (error) {
        this.state.confirmSubmit = false
      }
    },
    /**
     * 提交前的验证流程
     * @returns {Promise<any>}
     */
    formModelValidate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject(new Error('请完善表单'))
          }
          setTimeout(() => {
            this.state.confirmSubmit = false
          }, 600)
        })
      })
    },
    afterClose() {
      this.user = {}
      this.more.iamPositionOptions = []
      this.orgList = []
      this.form.userPositionList = []
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <el-dialog :title="title" :visible.sync="state.visible" @closed="close">
    <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="120px">
      <el-form-item label="编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入编码" />
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          placeholder="请输入描述"
        />
      </el-form-item>
      <el-form-item label="拥有权限" prop="permissionList">
        <el-row>请配置该角色权限</el-row>
        <el-row
          v-for="(permission, idx) in permissionList"
          :key="idx"
          :gutter="16"
        >
          <template v-if="isAdmin">
            <el-col :span="4">
              {{ permission.name }}：
            </el-col>
            <el-cole :span="20">
              <el-tag>所有权限</el-tag>
            </el-cole>
          </template>
          <template v-else>
            <el-col :span="4">
              <el-checkbox
                :indeterminate="permission.indeterminate"
                @change="checked => onCheckAllChange(checked, permission)"
                v-model="permission.checked"
              >
                {{ permission.name }}：
              </el-checkbox>
            </el-col>
            <el-col :span="20">
              <el-checkbox-group
                @change="checked => changePermission(checked, permission, idx)"
                v-model="permissionIdsMap[permission.id]"
              >
                <el-checkbox
                  v-for="(item, index) in permission.children"
                  :key="index"
                  :label="item.id"
                >
                  {{ item.operationName }}
                </el-checkbox>
              </el-checkbox-group>
            </el-col>
          </template>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" :loading="state.submitBtn" :disabled="state.submitBtn" @click="onSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
import forEach from 'lodash.foreach'

export default {
  name: 'IamUserForm',
  mixins: [form],
  props: {
    more: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      baseApi: '/iam/role',
      initFormData: {
        code: '',
        name: '',
        description: '',
        permissionList: []
      },
      rules: {
        'code': [{ required: true, message: '编码不能为空', trigger: 'blur' }, { validator: this.checkCodeDuplicate, trigger: 'blur' }],
        'name': [{ required: true, message: '角色名称不能为空', trigger: 'change' }]
      },
      isAdmin: false,
      permissionList: [],
      permissionIdsMap: {}
    }
  },
  methods: {
    /** *
     * 新建记录的提交
     * @param values
     * @returns {Promise<string>}
     */
    async add(values) {
      const res = await dibootApi.post(`${this.baseApi}/create`, values)
      if (res.code === 0) {
        return { data: res.data, msg: '添加记录成功' }
      } else {
        throw new Error(res.msg)
      }
    },
    /** *
     * 更新记录的提交
     * @param values
     * @returns {Promise<string>}
     */
    async update(values) {
      const res = await dibootApi.put(`${this.baseApi}/update/${this.form.id}`, values)
      if (res.code === 0) {
        return { data: res.data, msg: '更新记录成功' }
      } else {
        throw new Error(res.msg)
      }
    },
    async afterOpen(id) {
      // 是否为超级管理员
      if (this.form && this.form.code && this.form.code.toUpperCase() === 'SUPER_ADMIN') {
        this.isAdmin = true
      }

      // 获取系统中所有的permissionList
      const res = await dibootApi.get(`/iam/permission/list`, { parentId: 0 })
      if (res.code === 0) {
        this.permissionList = res.data
      }
      // 获取所有已设置的权限
      let allSelectedIds = []
      if (this.form && this.form.permissionList && this.form.permissionList.length > 0) {
        allSelectedIds = this.form.permissionList.map(per => {
          return per.id
        })
      }
      this.permissionList.forEach((per, index) => {
        const selectIds = []
        if (per.children && per.children.length > 0) {
          per.children.forEach(item => {
            if (allSelectedIds.includes(item.id)) {
              selectIds.push(item.id)
            }
          })
        } else {
          per.children = []
        }
        this.$set(this.permissionIdsMap, per.id, selectIds)
        // 对全选按钮的选中状态进行处理
        per.indeterminate = !!selectIds.length && selectIds.length < per.children.length
        per.checked = per.children.length === 0 ? allSelectedIds.includes(per.id) : selectIds.length === per.children.length
        this.$set(this.permissionList, index, per)
      })
    },
    onCheckAllChange(checked, permission) {
      if (checked) {
        if (permission.children && permission.children.length > 0) {
          this.permissionIdsMap[permission.id] = permission.children.map(per => {
            return per.id
          })
        }
      } else {
        this.permissionIdsMap[permission.id] = []
      }
      // 改变全选按钮状态
      Object.assign(permission, {
        indeterminate: false,
        checked
      })
      this.$forceUpdate()
    },
    changePermission(checked, permission, idx) {
      this.permissionIdsMap[permission.id] = checked
      const indeterminate = !!this.permissionIdsMap[permission.id].length && this.permissionIdsMap[permission.id].length < permission.children.length
      const allChecked = this.permissionIdsMap[permission.id].length === permission.children.length
      Object.assign(permission, {
        indeterminate,
        checked: allChecked
      })
      this.$forceUpdate()
    },
    close() {
      this.state.visible = false
      this.permissionIdsMap = {}
      this.permissionList = []
      this.isAdmin = false
      this.clearForm()
    },
    async checkCodeDuplicate(rule, value, callback) {
      const params = { id: this.form.id, code: value }
      const res = await dibootApi.get(`${this.baseApi}/checkCodeDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
    },
    enhance(values) {
      const permissionIds = []
      forEach(this.permissionIdsMap, (value, key) => {
        if (value && value.length > 0) {
          permissionIds.push(parseInt(key))
          permissionIds.push(...value)
        }
      })
      values.permissionIdList = permissionIds
    }
  }
}
</script>

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
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入编码" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          placeholder="请输入描述"
        />
      </el-form-item>
      <el-form-item label="拥有权限" prop="permissionList">
        <el-tree
          v-if="permissionTreeList && permissionTreeList.length > 0"
          ref="tree"
          class="filter-tree"
          node-key="id"
          show-checkbox
          check-strictly
          :data="permissionTreeList"
          :props="{label: 'label', children: 'children'}"
          default-expand-all
          :filter-node-method="filterNode"
          @check="onNodeCheck"
        />
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
import { permissionTreeListFormatter, treeList2list, list2childrenMap } from '@/utils/treeDataUtil'
import _ from 'lodash'

export default {
  name: 'IamRoleForm',
  mixins: [form],
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
      checkedKeys: [],
      permissionTreeList: [],
      getMore: []
    }
  },
  computed: {
    permissionList: function() {
      if (!this.permissionTreeList || this.permissionTreeList.length === 0) {
        return []
      }
      return treeList2list(_.cloneDeep(this.permissionTreeList))
    },
    childrenMap: function() {
      return list2childrenMap(this.permissionList)
    }
  },
  methods: {
    async afterOpen(id) {
      // 是否为超级管理员
      if (this.form && this.form.code && this.form.code.toUpperCase() === 'SUPER_ADMIN') {
        this.isAdmin = true
      }

      // 获取系统中所有的permissionList
      const res = await dibootApi.get(`/iam/frontendPermission/list`)
      if (res.code === 0) {
        if (!res.data || res.data.length === 0) {
          this.$message.error('请先添加菜单及权限')
        } else {
          this.permissionTreeList = permissionTreeListFormatter(res.data, 'id', 'displayName')
        }
      } else {
        this.$message.error(res.msg)
      }

      // 设置checkedKeys初值
      if (this.form && this.form.permissionList) {
        this.checkedKeys = this.form.permissionList.map(item => {
          return item.id
        })
        setTimeout(() => {
          this.$refs.tree.setCheckedKeys(this.checkedKeys)
        }, 200)
      }
    },
    /**
     * 节点选中时的处理事件
     * 当选中的是父节点时，全选所有子节点
     * 当取消选中的是父节点时，取消所有子节点选择
     * @param checkedKeys
     * @param e
     */
    onNodeCheck(currentNode, data) {
      console.log('currentNode', currentNode)
      console.log('data', data)
      const { value } = currentNode
      const checked = data.checkedKeys.includes(value)
      if (checked === true) {
        // 如果具有上级节点，则自动选择所有的父级节点（上级菜单必选，否则设置无效）
        if (!this.checkedKeys.includes(value)) {
          this.checkedKeys.push(value)
        }
        this.deepCheckParentNode(value)
        // 如果具有下级权限节点，则自动选择所有权限列表（默认操作，可去除）
        const children = this.childrenMap[value]
        if (this.withoutMenuChildren(children)) {
          children.forEach(item => {
            this.autoCheckNode(item.value)
          })
        }
      } else {
        // 如果具有下级权限节点，则自动取消选择所有的父级节点（下级菜单必须取消，否则设置无效）
        if (this.checkedKeys.includes(value)) {
          _.pull(this.checkedKeys, value)
        }
        this.deepUnCheckChildrenNode(value)
      }
    },
    /**
     * 逐级选中所有父节点
     * @param value
     */
    deepCheckParentNode(value) {
      const currentPermission = this.permissionList.find(item => {
        return item.value === value
      })
      if (currentPermission !== undefined && currentPermission.parentId && currentPermission.parentId !== 0) {
        this.autoCheckNode(currentPermission.parentId)
        this.deepCheckParentNode(currentPermission.parentId)
      }
    },
    /**
     * 逐级取消选中所有子节点
     * @param value
     */
    deepUnCheckChildrenNode(value) {
      const children = this.childrenMap[value]
      if (children !== undefined && children.length > 0) {
        children.forEach(item => {
          this.autoUnCheckNode(item.value)
          this.deepUnCheckChildrenNode(item.value)
        })
      }
    },
    autoCheckNode(value) {
      const checkedIdList = this.checkedKeys
      if (!checkedIdList.includes(value)) {
        checkedIdList.push(value)
      }
      this.$refs.tree.setCheckedKeys(checkedIdList)
    },
    autoUnCheckNode(value) {
      const checkedIdList = this.checkedKeys
      if (checkedIdList.includes(value)) {
        _.pull(checkedIdList, value)
      }
      this.$refs.tree.setCheckedKeys(checkedIdList)
    },
    withoutMenuChildren(children) {
      if (children === undefined || children.length === 0) {
        return false
      }
      const permission = children.find(item => {
        return item.type === 'MENU'
      })
      return permission === undefined
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
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
      const checkedIdList = this.checkedKeys
      // 自动选择没有选到的父级
      checkedIdList.forEach(id => {
        const permission = this.permissionList.find(item => {
          return item.value === id
        })
        if (permission !== undefined && permission.parentId !== undefined && !checkedIdList.includes(permission.parentId)) {
          checkedIdList.push(permission.parentId)
        }
      })
      values.permissionIdList = checkedIdList
    },
    afterClose() {
      this.isAdmin = false
      this.checkedKeys = []
    }
  }
}
</script>

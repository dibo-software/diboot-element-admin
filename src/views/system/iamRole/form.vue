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
        <flat-tree
          :key="visible"
          v-if="permissionTreeList && permissionTreeList.length > 0"
          ref="tree"
          class="filter-tree"
          node-key="id"
          show-checkbox
          check-strictly
          :data="permissionTreeList"
          :props="{label: 'displayName', children: 'children'}"
          default-expand-all
          :filter-node-method="filterNode"
          @check="checkNode"
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
import FlatTree from '@/components/FlatTree'
import { dibootApi } from '@/utils/request'
import { tree2List } from '@/utils/treeDataUtil'
import _ from 'lodash'
/**
 * 收集树节点上所有父节点
 * @param parentId 父节点
 * @param dataList 子节点
 * @param result 存储结果
 * @param transformField 字段转化
 */
const collectDeepParent = (parentId, dataList, result, transformField) => {
  if (parentId === '0') return
  const data = (dataList.find(val => collectField(val, transformField.value) === parentId) || {})
  data && result.push(data)
  collectDeepParent((data[transformField.parentId] || '0'), dataList, result, transformField)
}
/**
 * 收集对象中的指定字段
 * @param data 对象
 * @param fieldName 对象的属性名
 * @param defaultValue 属性默认值，不设置默认值，表示对象中一定可以获取到非null、非undefined值
 */
const collectField = (data, fieldName, defaultValue) => {
  const val = data[fieldName]
  return defaultValue ? (val || defaultValue) : val
}
/**
 * 收集指定字段列表
 * @param dataList 对象列表
 * @param fieldName 对象的名称
 * @param defaultValue 属性默认值
 */
const collectFieldList = (dataList, fieldName, defaultValue) => {
  return dataList.map(val => collectField(val, fieldName, defaultValue))
}
export default {
  name: 'IamRoleForm',
  components: { FlatTree },
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
      optionsTransformField: {
        value: 'id',
        children: 'children',
        parentId: 'parentId',
        label: 'label'
      }
    }
  },
  computed: {
    permissionList: function() {
      if (!this.permissionTreeList || this.permissionTreeList.length === 0) {
        return []
      }
      return tree2List(_.cloneDeep(this.permissionTreeList))
    }
  },
  methods: {
    async afterOpen(id) {
      // 是否为超级管理员
      if (this.form && this.form.code && this.form.code.toUpperCase() === 'SUPER_ADMIN') {
        this.isAdmin = true
      }

      // 获取系统中所有的permissionList
      const res = await dibootApi.get(`/iam/resourcePermission/list`)
      if (res.code === 0) {
        if (!res.data || res.data.length === 0) {
          this.$message.error('请先添加菜单及权限')
        } else {
          this.permissionTreeList = res.data
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
     * 点击节点复选框之后触发	：详细规则如下
     * 选择框被勾选==> 当前选择框、子选择框、父/祖父选择框都需要被勾选，
     * 取消勾选 ==> 当前选择框、子选择框取消勾选，如果是父/祖父选择框下只有这当前选择框这一个子项，父/祖也要取消勾选，否则只取消当前选择框
     * @param data 被点击节点
     * @param checked 节点是否被选中
     */
    checkNode(currentNode, data) {
      const checkedKeys = data.checkedKeys

      const value = collectField(currentNode, this.optionsTransformField.value)
      const result = [currentNode]
      // 递归查找子项
      const children = collectField(currentNode, this.optionsTransformField.children, [])
      if (children && children.length > 0) {
        const childrenData = tree2List(children)
        result.push(...childrenData)
      }
      // 递归查找父项
      const parentId = collectField(currentNode, this.optionsTransformField.value, '0')
      const parentResult = []
      collectDeepParent(parentId, this.permissionList, parentResult, this.optionsTransformField)
      if (checkedKeys.includes(value)) {
        result.push(...parentResult)
        // 获取所有id，且已经选中的数据中不包含的id
        const values = collectFieldList(result, this.optionsTransformField.value).filter(
          val => !this.checkedKeys.includes(val)
        )

        this.checkedKeys.push(...new Set(values))
      } else {
        const values = collectFieldList(result, this.optionsTransformField.value)
        const parentValues = collectFieldList(parentResult, this.optionsTransformField.value)
        // 查找父项下的所有子项(包含父项)
        const childrenResult = tree2List(parentResult) || []
        const mergeValues = [...values, ...parentValues]
        // 获取抛开当前节点下的所有子项和当前节点下所有父项 的剩余项
        const remainValues = collectFieldList(childrenResult, this.optionsTransformField.value).filter(
          val => !mergeValues.includes(val)
        )
        // 判断剩余节点是否存在已选中的节点中, 当前节点的父级下有其他子节点，那么只移除当前节点及子节点，如果父级下无其他子节点，那么移除当前节点的父节点和子节点
        const resultValues = this.checkedKeys.some(val => remainValues.includes(val)) ? values : mergeValues
        this.checkedKeys = this.checkedKeys.filter((selected) => !resultValues.includes(selected))
      }
      // 设置选中状态
      this.$refs.tree.setCheckedKeys(this.checkedKeys)
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
      const checkedIdList = this.checkedKeys ? this.checkedKeys : []
      // 自动选择没有选到的父级
      checkedIdList.forEach(id => {
        const permission = this.permissionList.find(item => {
          return item.value === id
        })
        if (permission != null && permission.parentId != null && !checkedIdList.includes(permission.parentId)) {
          checkedIdList.push(permission.parentId)
        }
      })
      values.permissionIdList = checkedIdList
    },
    afterClose() {
      this.isAdmin = false
      this.checkedKeys = []
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>

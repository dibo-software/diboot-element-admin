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
      <el-form-item label="类型名称" prop="itemName">
        <el-input v-model="form.itemName" placeholder="数据字典类型名称" />
      </el-form-item>
      <el-form-item label="类型编码" prop="type">
        <el-input v-model="form.type" placeholder="数据字典类型名称(大写英文字母)" />
      </el-form-item>
      <el-form-item label="包含子项" prop="children">
        <template v-if="children && children.length > 0">
          <el-tag
            v-for="(item,i) in children"
            :key="i"
            closable
            type="success"
            size="small"
            :style="{marginRight: '15px', cursor: 'pointer' }"
            @click="onTagClicked(item, i)"
            @close="onTagClosed($event, i)"
          >
            {{ item.itemName }}({{ item.itemValue }})
          </el-tag>
        </template>
        <el-tag v-if="!children || children.length === 0" type="info" size="small">无</el-tag>
        <el-row :gutter="16" style="margin-top: 10px;">
          <el-col :span="8">
            <el-input v-model="childItem.itemName" placeholder="子项名称" />
          </el-col>
          <el-col :span="8">
            <el-input v-model="childItem.itemValue" placeholder="子项编码" @keyup.enter.native="handleSubItem" />
          </el-col>
          <el-col :span="8">
            <el-button :type="childrenBtnConfig.type" @click="handleSubItem">{{ childrenBtnConfig.label }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.description" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" placeholder="请输入备注" />
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
import _ from 'lodash'

// 定义form结构常量
const INIT_FORM_DATA = {
  itemName: '',
  type: '',
  children: [],
  description: ''
}
// 定义默认值
const CHILDREN_BTN_CONFIG_DEFAULT = {
  editing: false,
  type: 'primary',
  label: '添加子项',
  currentIndex: undefined
}
// eslint-disable-next-line standard/object-curly-even-spacing
const CHILDREN_ITEM_DEFAULT = { id: '', itemName: '', itemValue: '' }
export default {
  name: 'DictForm',
  mixins: [form],
  data() {
    return {
      baseApi: '/dictionary',
      initFormData: INIT_FORM_DATA,
      children: [],
      childItem: _.cloneDeep(CHILDREN_ITEM_DEFAULT),
      childrenBtnConfig: _.cloneDeep(CHILDREN_BTN_CONFIG_DEFAULT),
      rules: {
        'itemName': [{ required: true, message: '类型名称不能为空', trigger: 'blur' }],
        'type': [{ required: true, message: '类型编码不能为空', trigger: 'blur' }, { validator: this.checkTypeDuplicate, trigger: 'blur' }]
      }
    }
  },
  methods: {
    async afterOpen(id) {
      if (id === undefined) {
        return
      }
      const res = await dibootApi.get(`${this.baseApi}/${id}`)
      if (res.code === 0) {
        this.initSubItem(res.data)
      } else {
        this.$message.error(res.msg)
      }
    },
    initSubItem(data) {
      if (data.children && data.children.length > 0) {
        var children = []
        data.children.forEach(child => {
          children.push({ id: child.id, itemName: child.itemName, itemValue: child.itemValue })
        })
        this.children = children
      } else {
        this.children = []
      }
    },
    onTagClicked(item, i) {
      this.childItem.id = item.id
      this.childItem.itemName = item.itemName
      this.childItem.itemValue = item.itemValue
      this.childrenBtnConfig = {
        label: '更新子项',
        type: 'dashed',
        editing: true,
        currentIndex: i
      }
      return false
    },
    onTagClosed(e, i) {
      e.stopPropagation()
      if (this.children.length > i) {
        this.children.splice(i, 1)
      }
      e.preventDefault()
    },
    async checkTypeDuplicate(rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.form.id, type: value }
      const res = await dibootApi.get(`${this.baseApi}/checkTypeDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
    },
    handleSubItem() {
      if (this.childItem.itemName === '') {
        this.$message.error('请输入数据字典子项名称')
        return false
      }
      if (this.childItem.itemValue === '') {
        this.$message.error('请输入数据字典子项编码')
        return false
      }

      if (this.childrenBtnConfig.currentIndex === undefined ||
          this.childrenBtnConfig.currentIndex >= this.children.length) {
        this.children.push(this.childItem)
      } else {
        this.children[this.childrenBtnConfig.currentIndex].id = this.childItem.id
        this.children[this.childrenBtnConfig.currentIndex].itemName = this.childItem.itemName
        this.children[this.childrenBtnConfig.currentIndex].itemValue = this.childItem.itemValue
      }

      // 重置
      this.childItem = _.cloneDeep(CHILDREN_ITEM_DEFAULT)
      this.childrenBtnConfig = _.cloneDeep(CHILDREN_BTN_CONFIG_DEFAULT)
    },
    close() {
      this.state.visible = false
      this.form = {}
      this.children = []
      // 重置
      this.childItem = _.cloneDeep(CHILDREN_ITEM_DEFAULT)
      this.childrenBtnConfig = _.cloneDeep(CHILDREN_BTN_CONFIG_DEFAULT)
      this.clearForm()
    },
    enhance(values) {
      values.children = this.children
    }
  }
}
</script>

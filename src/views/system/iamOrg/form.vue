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
    <el-form ref="dataForm" :model="form" label-position="right" label-width="100px">
      <el-row :gutter="18">
        <el-col :span="24">
          <el-form-item
            label="上级部门"
            prop="parentId"
            :rules="{
              required: true, message: '上级部门不能为空', trigger: 'blur', whitespace: true
            }"
          >
            <template v-if="orgIndentList.length > 0">
              <el-select
                v-model="form.parentId"
                placeholder="请选择上级部门"
                style="width: 100%;"
                filterable
              >
                <template
                  v-for="(item, index) in orgIndentList"
                >
                  <el-option
                    :key="index"
                    :value="`${item.value}`"
                    :label="item.label"
                  />
                </template>
              </el-select>
            </template>
            <template v-else>
              无
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="名称"
            prop="name"
            :rules="{
              required: true, message: '名称不能为空', trigger: 'blur', whitespace: true
            }"
          >
            <el-input
              v-model="form.name"
              placeholder="请输入名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="简称"
            prop="shortName"
            :rules="{
              required: true, message: '简称不能为空', trigger: 'blur', whitespace: true
            }"
          >
            <el-input
              v-model="form.shortName"
              placeholder="请输入简称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="备注"
            prop="orgComment"
            :rules="{
              required: true, message: '备注不能为空', trigger: 'blur', whitespace: true
            }"
          >
            <el-input v-model="form.orgComment" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
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

export default {
  name: 'IamOrgForm',
  mixins: [form],

  props: {
    currentNodeId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      baseApi: '/iam/org',
      orgList: []
    }
  },
  computed: {
    orgTreeList: function() {
      if (this.orgList === undefined || this.orgList.length === 0) {
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
    afterOpen() {
      if (this.form.id === undefined) {
        this.form.managerName = ''
      }
      this.form.parentId = this.getInitParentId()
      dibootApi.get(`${this.baseApi}/tree`).then(res => {
        if (res.code === 0) {
          this.orgList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getInitParentId() {
      if (this.model === undefined || !this.model.parentId) {
        return this.currentNodeId.toString(10)
      }
      return this.model.parentId.toString(10)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

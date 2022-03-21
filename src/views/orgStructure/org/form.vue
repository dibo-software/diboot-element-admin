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
        <el-col :span="12">
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
                placeholder="选择上级部门"
                filterable
                @change="$forceUpdate()"
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
        <el-col :span="12">
          <el-form-item
            label="编码"
            prop="code"
            :rules="[{
              required: true, message: '编码不能为空', trigger: 'blur', whitespace: true
            }, {
              validator: checkCodeDuplicate, trigger: 'blur'
            }]"
          >
            <el-input
              v-model="form.code"
              placeholder="请输入编码"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
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
        <el-col :span="12">
          <el-form-item
            label="全称"
            prop="name"
            :rules="{
              required: true, message: '全称不能为空', trigger: 'blur', whitespace: true
            }"
          >
            <el-input
              v-model="form.name"
              placeholder="请输入全称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="类型"
            prop="type"
            :rules="{
              required: true, message: '类型不能为空', trigger: 'blur', whitespace: true
            }"
          >
            <el-select
              v-model="form.type"
              filterable
              placeholder="请选择类型"
            >
              <el-option
                v-for="item in more.orgTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="负责人"
            filterable
            prop="managerId"
          >
            <span v-if="form.managerName">
              {{ form.managerName }}
            </span>
            <el-button type="text" @click="$refs.userSelectModal.open()">设置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="备注"
            prop="orgComment"
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
    <user-select-modal ref="userSelectModal" @select="record => selectReportManager(record)" />
  </el-dialog>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
import { treeListFormatter, treeList2IndentList } from '@/utils/treeDataUtil'
import _ from 'lodash'
import userSelectModal from '@/views/orgStructure/orgUser/userSelectModal'

export default {
  name: 'IamOrgForm',
  components: {
    userSelectModal
  },
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
      baseApi: '/iam/org',
      attachMoreList: [
        {
          target: 'ORG_TYPE'
        }
      ],
      orgList: []
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
    selectReportManager(user) {
      this.form.managerName = user.realname
      this.form.managerId = user.id
      this.$forceUpdate()
    },
    afterOpen() {
      if (this.form.id == null) {
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
    async checkCodeDuplicate(rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.form.id, code: value }
      const res = await dibootApi.get(`${this.baseApi}/checkCodeDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
    },
    getInitParentId() {
      if (this.form && this.form.parentId == null) {
        return `${this.currentNodeId}`
      } else {
        return this.form.parentId
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

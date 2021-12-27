<template>
  <el-dialog
    :visible.sync="state.visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
    :width="width"
    append-to-body
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
            label="编码"
            prop="code"
            :rules="{
              required: true, message: '编码不能为空', trigger: 'blur', whitespace: true
            }"
          >
            <el-input
              v-model="form.code"
              placeholder="请输入编码"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="数据权限"
            prop="dataPermissionType"
            :rules="{
              required: true, message: '数据权限不能为空', trigger: 'change', whitespace: true
            }"
          >
            <el-select
              v-model="form.dataPermissionType"
              placeholder="请选择数据权限"
            >
              <el-option
                v-for="item in more.dataPermissionTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="职级"
            prop="gradeValue"
          >
            <el-select
              v-model="form.gradeValue"
              placeholder="请选择职级"
              @change="onGradeValueChanged"
            >
              <el-option
                v-for="item in more.positionGradeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="职级头衔"
            prop="gradeName"
          >
            <el-input
              v-model="form.gradeName"
              placeholder="请输入职级头衔"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="是否虚拟岗"
            prop="isVirtual"
          >
            <el-switch
              v-model="form.isVirtual"
              active-color="#13ce66"
              inactive-color="#c6c6c6"
            />
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

export default {
  name: 'IamPositionForm',
  components: {

  },
  mixins: [form],
  props: {
    width: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      baseApi: '/iam/position',
      attachMoreList: [
        {
          target: 'POSITION_GRADE'
        },
        {
          target: 'DATA_PERMISSION_TYPE'
        }
      ]
    }
  },
  computed: {
    positionGradeMap: function() {
      const positionGradeMap = {}
      if (this.more && this.more.positionGradeOptions) {
        this.more.positionGradeOptions.forEach(item => {
          positionGradeMap[item.value] = item
        })
      }
      return positionGradeMap
    }
  },
  methods: {
    afterOpen() {
      let roleIds = []
      if (this.form && this.form.roleList) {
        roleIds = this.form.roleList.map(item => {
          return item.id
        })
      }
      this.$set(this.form, 'roleIds', roleIds)
    },
    onGradeValueChanged(value) {
      if (value && this.positionGradeMap && this.positionGradeMap[value]) {
        this.form.gradeName = this.positionGradeMap[value]['label']
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

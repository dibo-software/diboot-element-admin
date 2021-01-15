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
                  placeholder="请输入名称"
                  v-model="form.name"
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
                  placeholder="请输入编码"
                  v-model="form.code"
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
                  style="width: 100%;">
                  <el-option
                    v-for="kv in more.dataPermissionTypeKvList"
                    :label="kv.k"
                    :value="kv.v"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="职级"
                prop="gradeValue"
              >
                <el-select
                  @change="onGradeValueChanged"
                  v-model="form.gradeValue"
                  placeholder="请选择职级"
                  style="width: 100%;">
                  <el-option
                    v-for="kv in more.positionGradeKvList"
                    :label="kv.v"
                    :value="kv.v"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="职级头衔"
                prop="gradeName"
              >
                <el-input
                  placeholder="请输入职级头衔"
                  v-model="form.gradeName"
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
                  inactive-color="#c6c6c6">
                </el-switch>
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
  data() {
    return {
      baseApi: '/iam/position',
      attachMoreList: [
        {
          type: 'D',
          target: 'POSITION_GRADE'
        },
        {
          type: 'D',
          target: 'DATA_PERMISSION_TYPE'
        }
      ],
    }
  },
  methods: {
    afterOpen () {
      let roleIds = []
      if (this.form && this.form.roleList) {
        roleIds = this.form.roleList.map(item => {
          return item.id
        })
      }
      this.$set(this.form, 'roleIds', roleIds)
    },
    onGradeValueChanged (value) {
      if (value && this.positionGradeKvMap && this.positionGradeKvMap[value]) {
        this.form.gradeName = this.positionGradeKvMap[value]['k']
      }
    },
  },
  computed: {
    positionGradeKvMap: function () {
      const positionGradeKvMap = {}
      if (this.more && this.more.positionGradeKvList) {
        this.more.positionGradeKvList.forEach(item => {
          positionGradeKvMap[item.v] = item
        })
      }
      return positionGradeKvMap
    }
  },
  components: {

  },
  mixins: [form],
  props: {
    width: {
      type: String,
      default: undefined
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

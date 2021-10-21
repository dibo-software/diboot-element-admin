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

    <el-form ref="dataForm" :model="form" label-position="top" label-width="100px" :rules="rules">
      <el-row :gutter="18">
        <el-col :span="24">
          <el-form-item
            label="模版编码"
            prop="code"
          >
            <el-input
              v-model="form.code"
              placeholder="请输入模版编码"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="模版标题"
            prop="title"
          >
            <el-input
              v-model="form.title"
              placeholder="请输入模版标题"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="模版内容"
            prop="content"
          >
            <template slot="label">
              <span>模版内容
                <el-tooltip class="item" effect="dark" placement="right-start">
                  <template slot="content">
                    变量语法：${变量名称}<br>
                    例：<br>
                    你好：${用户名}，<br>
                    你的手机号是：${手机号}，<br>
                    你的邮箱是：${邮箱}！<br>
                    注：<br>
                    变量表示该值会根据场景动态变化！
                  </template>
                  <i class="el-icon-question" style="cursor: pointer" />
                </el-tooltip>
              </span>
              <div class="variable-container">
                <el-tag v-for="(item, index) in more.templateVariableList" :key="index" class="variable-tag" @click="handleInsertIntoContent(item)">
                  {{ item }}
                </el-tag>
              </div>
            </template>
            <el-input id="content" v-model="form.content" type="textarea" placeholder="请输入模版内容" />
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

export default {
  name: 'MessageTemplateForm',
  mixins: [form],
  data() {
    return {
      baseApi: '/messageTemplate',
      getMore: true,
      variableList: [],
      rules: {
        content: [
          {
            required: true, message: '模版内容不能为空', trigger: 'blur', whitespace: true
          }
        ],
        title: [
          {
            required: true, message: '模版标题不能为空', trigger: 'blur', whitespace: true
          }
        ],
        code: [
          {
            required: true, message: '模版编码不能为空', trigger: 'blur', whitespace: true
          },
          {
            validator: this.checkTempCodeDuplicate, message: '模版编码不能重复', trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    /**
     * 向内容中插入变量
     * @param variable
     */
    handleInsertIntoContent(variable) {
      const position = this.getPosition(document.getElementById('content'))
      let content = this.form.content || ''
      content = content ? `${content.slice(0, position)}${variable}${content.slice(position)}` : variable
      this.$set(this.form, 'content', content)
    },

    /**
     * 检查模版code是否重复
     */
    async checkTempCodeDuplicate(rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.form.id, code: value }
      const res = await dibootApi.get(`${this.baseApi}/checkTempCodeDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
    },
    afterClose() {
      this.variableList = []
    },
    /**
     * 输入框获取光标
     * @param element
     * @returns {number}
     */
    getPosition(element) {
      let cursorPos = 0
      // IE
      if (document.selection) {
        const selectRange = document.selection.createRange()
        selectRange.moveStart('character', -element.value.length)
        cursorPos = selectRange.text.length
      } else if (element.selectionStart || element.selectionStart === '0') {
        cursorPos = element.selectionStart
      }
      return cursorPos
    }
  }
}
</script>
<style lang="scss" scoped>
  .variable-container {
    .variable-tag {
      cursor: pointer;
      margin-right: 5px;
    }
  }
</style>

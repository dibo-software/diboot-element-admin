import _ from 'lodash'
import { dibootApi } from '@/utils/request'

export default {
  data() {
    return {
      sourceKvList: [],
      targetKvList: [],
      model: {},
      form: {},
      // 当前组件全屏控制
      fullscreen: false,
      state: {
        visible: false,
        confirmLoading: false
      }
    }
  },
  methods: {
    async open(currentNodeId) {
      if (currentNodeId !== undefined) {
        this.currentNodeId = `${currentNodeId}`
      }
      this.state.visible = true
      await this.getSourceKvList()
      await this.getTargetKvList()
      await this.afterOpen()
    },
    async getSourceKvList() {
      const res = await dibootApi.get(this.apiMap.sourceKvListAPI)
      if (res.code === 0) {
        this.sourceKvList = res.data
      }
    },
    async getTargetKvList() {
      const res = await dibootApi.get(this.apiMap.targetKvListAPI)
      if (res.code === 0) {
        this.targetKvList = res.data
      }
    },
    /** *
     * 表单提交事件
     * @returns {Promise<void>}
     */
    async onSubmit(e) {
      this.state.confirmLoading = true
      try {
        const values = await this.validate()
        this.enhance(values)
        let result = {}
        if (this.model.id === undefined) {
          // 新增该记录
          result = await this.add(values)
        } else {
          // 更新该记录
          values['id'] = this.model.id
          result = await this.update(values)
        }
        // 执行提交失败后的一系列后续操作
        this.submitSuccess(result)
      } catch (error) {
        // 执行一系列后续操作
        this.submitFailed(error)
      }
    },
    /** *
     * 提交前对数据的处理（在验证正确之后的处理）
     * @param values
     */
    enhance(values) {
    },
    /** *
     * 新建记录的提交
     * @param values
     * @returns {Promise<string>}
     */
    async add(values) {
      const res = await dibootApi.post(`/${this.name}/`, values)
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
      const res = await dibootApi.put(`/${this.name}/${this.model.id}`, values)
      if (res.code === 0) {
        return { data: res.data, msg: '更新记录成功' }
      } else {
        throw new Error(res.msg)
      }
    },
    /** *
     * 提交成功之后的处理
     * @param msg
     */
    submitSuccess(result) {
      this.$notify({
        title: '操作成功',
        message: result.msg,
        type: 'success'
      })
      this.$refs.dataForm.resetFields()
      this.$emit('complete')
      this.$emit('changeKey', result.data)
      this.close()
      this.state.confirmLoading = false
    },
    /** *
     * 提交失败之后的处理
     * @param e
     */
    submitFailed(e) {
      this.state.confirmLoading = false

      // 如果是字符串，直接提示
      let msg
      if (typeof e === 'string') {
        msg = e
      } else {
        msg = e.message || e.msg
      }

      // 如果还没有消息内容，则可能是校验错误信息，进行校验错误信息提取
      if (!msg && typeof e === 'object') {
        msg = this.validateErrorToMsg(e)
      }
      this.$notification.error({
        message: '操作失败',
        description: msg
      })
    },

    /** *
     * 提交前的验证流程
     * @returns {Promise<any>}
     */
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs['dataForm'].validate((valid, values) => {
          if (valid) {
            resolve(this.form)
          } else {
            reject('数据校验未通过')
          }
          setTimeout(() => {
            this.state.confirmSubmit = false
          }, 600)
        })
      })
    },
    validateErrorToMsg(error) {
      if (!error) {
        return error
      }
      const msgs = []
      _.forEach(error, (value, key) => {
        msgs.push(...value.errors.map(item => {
          return item.message
        }))
      })
      return msgs.join(', ')
    },
    handleCancel(e) {
      this.state.visible = false
      this.form.resetFields()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    async afterOpen() {

    },
    close() {
      this.state.visible = false
      this.model = {}
      this.form.resetFields()
      this.afterClose()
    },
    afterClose() {

    }
  },
  computed: {
    currentNode: function() {
      if (this.currentNodeId === undefined || this.currentNodeId === 0 || this.currentNodeId === '0') {
        return undefined
      }
      if (typeof this.currentNodeId === 'number') {
        return this.currentNodeId.toString(10)
      }
      return this.currentNodeId
    }
  },
  props: {
    currentNodeId: {
      type: String,
      default: () => {
        return ''
      }
    }
  }
}

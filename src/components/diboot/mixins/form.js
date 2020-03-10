import { axios, dibootApi } from '@/utils/request'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  data() {
    return {
      baseApi: '/',
      // 新建接口
      createApi: '',
      // 更新接口
      updateApiPrefix: '',
      title: '',
      form: {},
      initFormData: {},
      getMore: false,
      reloadMore: {},
      state: {
        visible: false,
        submitBtn: false
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async open(id) {
      if (id === undefined) {
        // 没有id数据则认为是新建
        this.title = '新建'
        this.state.visible = true
        this.form = _.cloneDeep(this.initFormData)
        this.afterOpen(id)
      } else {
        // 否则作为更新处理
        const res = await dibootApi.get(`${this.baseApi}/${id}`)
        if (res.code === 0) {
          this.form = res.data
          this.title = '更新'
          this.state.visible = true
          this.afterOpen(id)
        } else {
          this.$message.error(res.msg)
        }
      }
    },
    close() {
      this.state.visible = false
      this.clearForm()
      this.afterClose()
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
            this.state.submitBtn = false
          }, 600)
        })
      })
    },
    /** *
     * 提交前对数据的处理（在验证正确之后的处理）
     * @param values
     */
    async enhance(values) {
    },
    /** *
     * 新建记录的提交
     * @param values
     * @returns {Promise<string>}
     */
    async add(values) {
      const createApi = this.createApi ? this.createApi : '/'
      const res = await dibootApi.post(`${this.baseApi}${createApi}`, values)
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
      const updateApiPrefix = this.updateApiPrefix ? this.updateApiPrefix : ''
      const res = await dibootApi.put(`${this.baseApi}${updateApiPrefix}/${this.form.id}`, values)
      if (res.code === 0) {
        return { data: res.data, msg: '更新记录成功' }
      } else {
        throw new Error(res.msg)
      }
    },
    /** *
     * 表单提交事件
     * @returns {Promise<void>}
     */
    async onSubmit() {
      this.state.submitBtn = true
      const values = await this.validate()
      await this.enhance(values)
      try {
        let result = {}
        if (this.form.id === undefined) {
          // 新增该记录
          result = await this.add(values)
        } else {
          // 更新该记录
          result = await this.update(values)
        }

        // 执行提交失败后的一系列后续操作
        this.submitSuccess(result)
      } catch (e) {
        // 执行一系列后续操作
        this.submitFailed(e)
        console.log(e)
      }
    },
    /** *
     * 提交成功之后的处理
     * @param msg
     */
    submitSuccess(result) {
      this.$message.success(result.msg)
      this.close()
      this.clearForm()
      this.$emit('refreshList')
      this.$emit('changeKey', result.data)
    },
    /** *
     * 提交失败之后的处理
     * @param e
     */
    submitFailed(e) {
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
      this.$message.error(msg)
    },
    // 解决带有下拉框组件在滚动时下拉框不随之滚动的问题
    getPopupContainer(trigger) {
      return trigger.parentElement
    },
    /** **
     * 打开表单之后的操作
     * @param id
     */
    afterOpen(id) {

    },
    afterClose() {

    },
    attachMore() {
      axios({
        url: `${this.baseApi}/attachMore`,
        method: 'get'
      }).then(res => {
        this.reloadMore = res.data
      })
    },
    /** *
     * select选择框启用search功能后的过滤器
     * @param input
     * @param option
     * @returns {boolean}
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    clearForm() {
      this.form = _.cloneDeep(this.initFormData)
      this.$refs['dataForm'].resetFields()
    }
  },
  async mounted() {
    if (this.getMore === true) {
      await this.attachMore()
    }
  }
}

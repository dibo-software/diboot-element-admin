import { dibootApi } from '@/utils/request'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import more from './more'

export default {
  mixins: [more],
  data() {
    return {
      // 主键字段名
      primaryKey: 'id',
      // 请求接口基础路径
      baseApi: '/',
      // 新建接口
      createApi: '',
      // 更新接口
      updateApiPrefix: '',
      // 标题
      title: '',
      // 表单初始数据（表示表单数据结构）
      initFormData: {},
      // 存储当前对象form数据
      form: {},
      // 当前组件全屏控制
      fullscreen: false,
      // 当前组件状态对象
      state: {
        visible: false,
        confirmSubmit: false
      },
      // 当前form是否包含上传
      isUpload: false,
      /**
       * 所有文件的集合都放置与fileWrapper对象中，提交的时候会自动遍历
       * 格式如下：
       * fileWrapper: {
       *  singleImageList: [],
       *  multiImageList: [],
       *  singleFileList: [],
       *  multiFileList: []
       * }
       */
      fileWrapper: {},
      /**
       * uuid集合
       */
      fileUuidList: [],
      /**
       * 文件前缀
       */
      filePrefix: '',
      /**
       * 当前关联的对象名称
       */
      relObjType: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    /**
     * 打开表单
     * @param id
     * @returns {Promise<void>}
     */
    async open(id) {
      if (id == null) {
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
      await this.attachMore()
    },
    /**
     * 关闭表单
     */
    close() {
      this.state.visible = false
      this.__defaultFileWrapperKeys__()
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
            this.state.confirmSubmit = false
          }, 600)
        })
      })
    },
    /** *
     * 提交前对数据的处理（在验证正确之后的处理）
     * @param values 提交的参数
     */
    async enhance(values) {
    },
    /** *
     * 新建记录的提交
     * @param values 提交的参数
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
      const res = await dibootApi.put(`${this.baseApi}${updateApiPrefix}/${this.form[this.primaryKey]}`, values)
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
      this.state.confirmSubmit = true
      try {
        const values = await this.validate()
        await this.enhance(values)
        let result = {}
        if (this.form[this.primaryKey] == null) {
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
      this.$emit('complete')
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
    validateErrorToMsg(err) {
      return err.message
    },
    /** **
     * 打开表单之后的操作
     * @param id
     */
    afterOpen(id) {

    },
    /**
     * 关闭之后操作
     */
    afterClose() {

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
    /**
     * 清除form内容
     */
    clearForm() {
      this.form = _.cloneDeep(this.initFormData)
      this.$refs['dataForm'].resetFields()
    },
    /**
     * 点击级联类型后，加载select数据
     */
    handleCascaderSelectNext(data, clearParams = []) {
      // 将级联已经选中的统一清理
      clearParams.forEach(param => delete this.queryParam[param])
      // 选中的数据初始化
      Object.assign(this.more, data)
      this.$forceUpdate()
    },
    /**
     * 将属性值转化为数组
     * @param fieldName
     * @param suffix 数组后缀
     * @param separator
     */
    transformStr2Arr(fieldName, suffix = 'Arr', separator = ',') {
      this.$set(this.form, `${fieldName}${suffix}`, this.strSplit(this.form[fieldName], separator))
      // 防止关闭modal，element checkbox-group控制台异常
      this.initFormData[`${fieldName}${suffix}`] = []
    },
    /**
     * 字符串分割
     * @param str
     * @param separator
     */
    strSplit(str, separator = ',') {
      return str ? str.split(',') : []
    },
    /**
     * 回显指定属性的图片文件
     * @param id 当前model的id
     * @param relObjField 字段名
     */
    echoImgFile(id, relObjField) {
      dibootApi.get(`/uploadFile/getList/${id}/${this.relObjType}/${relObjField}`).then(res => {
        if (res.code === 0 && res.data && res.data.length > 0) {
          res.data.forEach(data => {
            this.fileWrapper[`${relObjField}List`].push(this.fileFormatter(data))
          })
        }
      })
    },
    /**
     * 文件数据转化
     * @param data 相应的数据
     * @param isImage 是否是图片
     * @returns {{uid: ((function(): *)|*|(function(): *)), response: string, filePath: *, name: (*|string), status: string}}
     */
    fileFormatter({ uuid: uid, fileName: name, accessUrl }) {
      const file = {
        uid, // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
        name, // 文件名
        filePath: accessUrl,
        url: `${this.filePrefix}${accessUrl}/image`
      }
      return file
    },
    /**
     * 设置文件uuid
     * @private
     */
    __setFileUuidList__(values) {
      // 如果包含上传功能，那么设置uuid
      if (this.isUpload) {
        this.fileUuidList = []
        const fileWrapperKeys = Object.keys(this.fileWrapper)
        if (fileWrapperKeys.length > 0) {
          for (const fileWrapperKey of fileWrapperKeys) {
            const tempFileList = this.fileWrapper[fileWrapperKey]
            if (tempFileList && tempFileList.length && tempFileList.length > 0) {
              this.fileUuidList.push(...tempFileList.map(item => item.uid))
            }
          }
          values['fileUuidList'] = this.fileUuidList
        }
      }
    },
    /**
     * 初始化fileWrapper
     * @private
     */
    __defaultFileWrapperKeys__() {
      const fileWrapperKeys = Object.keys(this.fileWrapper)
      if (fileWrapperKeys.length > 0) {
        for (const fileWrapperKey of fileWrapperKeys) {
          this.fileWrapper[fileWrapperKey] = []
        }
      } else {
        this.fileWrapper = {}
      }
      this.fileUuidList = []
    }
  }
}

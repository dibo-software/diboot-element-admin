import _ from 'lodash'
import moment from 'moment'
import { dibootApi } from '@/utils/request'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      // 主键字段名
      primaryKey: 'id',
      // 请求接口基础路径
      baseApi: '/',
      // 列表数据接口
      listApi: '',
      // 删除接口
      deleteApiPrefix: '',
      // 导出接口
      exportApi: '',
      // 自定义参数（不被查询表单重置和改变的参数）
      customQueryParam: {},
      // 与查询条件绑定的参数（会被查询表单重置和改变的参数）
      queryParam: {},
      // 日期区间选择配置
      dateRangeQuery: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 列表数据
      list: [],
      // 是否从mixin中自动获取关联数据
      getMore: false,
      // 关联相关的更多数据
      // 获取关联数据列表的配置列表
      attachMoreList: [],
      more: {},
      // 是否将children转化为_children
      listFormatter: true,
      // 是否从mixin中自动获取初始的列表数据
      getListFromMixin: true,
      // 标记加载状态
      loadingData: false,
      // 标记导出
      exportLoadingData: false,
      // 分页数据
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50', '100']
      }
    }
  },
  methods: {
    /**
     * 分页
     */
    handlePaginationChanged() {
      this.queryParam.pageIndex = this.pagination.current
      this.queryParam.pageSize = this.pagination.pageSize
      this.getList()
    },
    /**
     * 构建排序
     * @param column
     * @param prop
     * @param order
     */
    appendSorterParam({ column, prop, order }) {
      console.log(column, prop, order)
      if (prop !== undefined && order !== undefined) {
        this.queryParam.orderBy = `${prop}:${order === 'ascending' ? 'ASC' : 'DESC'}`
      } else {
        this.queryParam.orderBy = undefined
      }
    },
    /**
     * 搜索，查询第一页
     */
    onSearch() {
      this.pagination.current = 1
      this.handlePaginationChanged()
    },

    /**
     * 切换展示更多搜索框
     */
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    /**
     * post 请求的获取list
     * @returns {Promise<any>}
     */
    postList() {
      this.dateRange2queryParam()
      return new Promise((resolve, reject) => {
        this.loadingData = true
        // 转化包含moment的时间类型
        this.contentTransform(this.queryParam)
        // 过滤掉不存在值的属性
        let tempQueryParam = {}
        // 合并自定义查询参数
        _.merge(tempQueryParam, this.customQueryParam)
        // 合并搜索参数
        _.merge(tempQueryParam, this.queryParam)
        // 改造查询条件（用于列表页扩展）
        tempQueryParam = this.rebuildQuery(tempQueryParam)
        // 使用post方式请求列表数据（多用于复杂参数通过json对象进行传输到后端进行筛选）
        dibootApi.post(
          this.listApi ? this.listApi : `${this.baseApi}/list`,
          tempQueryParam
        )
          .then(res => {
            this.loadingData = false
            if (res.code === 0) {
              this.list = this.filterListData(res.data)
              this.afterLoadList(this.list)
              if (res.page) {
                this.pagination.pageSize = res.page.pageSize
                this.pagination.current = res.page.pageIndex
                this.pagination.total = res.page.totalCount
              }
              resolve(this.list)
            } else {
              this.$notify.error({
                title: '获取列表数据失败',
                message: res.msg
              })
              reject(res.msg)
            }
          })
          .catch(err => {
            this.loadingData = false
            this.$notify.error({
              title: '获取列表数据失败',
              message: err
            })
            reject(err)
          })
      })
    },
    /**
     * get请求获取列表
     * @returns {Promise<any>}
     */
    getList() {
      this.dateRange2queryParam()
      return new Promise((resolve, reject) => {
        this.loadingData = true
        // 转化包含moment的时间类型
        this.contentTransform(this.queryParam)
        // 过滤掉不存在值的属性
        let tempQueryParam = {}
        // 合并自定义查询参数
        _.merge(tempQueryParam, this.customQueryParam)
        // 合并搜索参数
        _.merge(tempQueryParam, this.queryParam)
        // 改造查询条件（用于列表页扩展）
        tempQueryParam = this.rebuildQuery(tempQueryParam)
        dibootApi.get(
          this.listApi ? this.listApi : `${this.baseApi}/list`,
          tempQueryParam
        ).then(res => {
          this.loadingData = false
          if (res.code === 0) {
            this.list = this.filterListData(res.data)
            this.afterLoadList(this.list)
            if (res.page) {
              this.pagination.pageSize = res.page.pageSize
              this.pagination.current = res.page.pageIndex
              this.pagination.total = res.page.totalCount
            }
            resolve(this.list)
          } else {
            this.$notify.error({
              title: '获取列表数据失败',
              message: res.msg
            })
            reject(res.msg)
          }
        }).catch(err => {
          this.loadingData = false
          this.$notify.error({
            title: '获取列表数据失败',
            message: err
          })
          reject(err)
        })
      })
    },

    /**
     * 更新或者删除
     * @param command update/delete
     * @param row     操作的行内容
     */
    menuCommand(command, row) {
      if (command === 'update') {
        this.$refs.form.open(row[this.primaryKey])
      } else if (command === 'delete') {
        this.remove(row[this.primaryKey])
      }
    },

    /**
     * 处理list中含有children字段的问题
     * @param list
     * @returns {*}
     */
    filterListData(list) {
      if (!this.listFormatter) {
        return list
      }
      if (list && list.length > 0) {
        list.forEach(item => {
          // 解决elementui对于具有children字段的列表显示不出的问题
          if (item.children !== undefined) {
            item._children = item.children
            item.hasChildren = true
            delete item.children
          }
        })
      }
      return list
    },
    /**
     * 加载当前页面关联的对象或者字典
     * @returns {Promise<*>}
     */
    async attachMore() {
      let res = {}
      // 个性化接口
      if (this.getMore === true) {
        res = await dibootApi.get(`${this.baseApi}/attachMore`)
      } else if (this.attachMoreList.length > 0) {
        // 通用获取当前对象关联的数据的接口
        res = await dibootApi.post('/common/attachMore', this.attachMoreList)
      }
      if (res.code === 0) {
        this.more = res.data
        return res.data
      }
    },
    /**
     * 重置查询
     */
    reset() {
      this.queryParam = {}
      this.dateRangeQuery = {}
      this.getList()
    },

    /**
     * 根据id删除
     * @param id
     * @returns {Promise<*>}
     */
    async remove(id) {
      return new Promise((resolve, reject) => {
        const _this = this
        this.$confirm('确定删除该数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const deleteApiPrefix = _this.deleteApiPrefix ? _this.deleteApiPrefix : ''
          dibootApi.delete(`${_this.baseApi}${deleteApiPrefix}/${id}`).then(async(res) => {
            if (res.code === 0) {
              this.$notify.success({
                title: '删除成功',
                message: '已删除该数据'
              })
              await _this.getList()
              resolve(res.data)
            } else {
              this.$notify.error({
                title: '删除失败',
                message: res.msg
              })
              reject(res.msg)
            }
          }).catch(err => {
            this.$notify.error({
              title: '删除失败',
              message: err
            })
            reject(err.msg)
          })
        })
      })
    },
    /**
     * 批量删除
     * @returns {boolean}
     */
    batchRemove() {
      if (this.selectedRowKeys === undefined || this.selectedRowKeys.length === 0) {
        this.$message.error('请选择需要操作的行')
        return false
      }
      const _this = this
      this.$confirm('您是否确认批量删除所选项？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 开始删除选中的行
        dibootApi.post(`${_this.baseApi}/batchDelete`, _this.selectedRowKeys).then(res => {
          if (res.code === 0) {
            _this.$message.success(res.msg)
            _this.getList()
          } else {
            _this.$message.error(res.msg)
          }
        })
      })
    },
    /**
     * 导出数据至excel
     */
    exportData() {
      this.exportLoadingData = true
      let tempQueryParam = {}
      // 转化包含moment的时间类型
      this.contentTransform(this.queryParam)
      // 合并自定义查询参数
      _.merge(tempQueryParam, this.customQueryParam)
      // 合并搜索参数
      _.merge(tempQueryParam, this.queryParam)
      // 改造查询条件（用于列表页扩展）
      tempQueryParam = this.rebuildQuery(tempQueryParam)
      const exportApi = this.exportApi ? this.exportApi : '/excel/export'
      dibootApi.download(`${this.baseApi}${exportApi}`, tempQueryParam).then(res => {
        if (res.filename) {
          this.downloadFile(res)
        } else {
          const decoder = new TextDecoder('utf-8')
          const result = JSON.parse(decoder.decode(new Uint8Array(res)))
          this.$message.error(result.msg)
        }
        this.exportLoadingData = false
      }).catch(err => {
        console.log(err)
        this.exportLoadingData = false
      })
    },
    /**
     * 下载文件
     * @param res 服务端响应，经过axios处理后的数据，详见src/utils/request.js部分的响应值配置
     */
    downloadFile(res) {
      const blob = new Blob([res.data])
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = res.filename
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, res.filename)
      }
    },
    /**
     * 处理查询参数中的moment数据 默认转化为YYYY-MM-DD
     * 如果需要单独处理属性，那么请传入transform对象，指定属性的转化类型
     * 示例：{createTime: 'YYYY-MM-DD'}
     * @param content 待转化内容
     * @param transform 需要转化的格式
     */
    contentTransform(content, transform = {}) {
      if (content) {
        for (const key in content) {
          const value = content[key]
          const format = transform[key] || 'YYYY-MM-DD'
          if (value instanceof Array) {
            // 如果类型是moment，那么进行转化
            if (value && value[0] instanceof moment) {
              const transformTime = []
              for (let i = 0; i < value.length; i++) {
                transformTime[i] = value[i].format(format)
              }
              content[key] = transformTime
            }
          } else if (value instanceof moment) {
            content[key] = value.format(format)
          }
        }
      }
      return content
    },
    /**
     * 构建区间查询参数
     */
    dateRange2queryParam() {
      _.forEach(this.dateRangeQuery, (v, k) => {
        if (k && v && v.length === 2) {
          this.queryParam[`${k}Begin`] = v[0]
          this.queryParam[`${k}End`] = v[1]
        }
      })
    },
    /**
     * 加载数据之后操作
     * @param list
     */
    afterLoadList(list) {

    },
    /**
     * 重新构建查询条件
     * @param query
     * @returns {*}
     */
    rebuildQuery(query) {
      return query
    }
  },
  async created() {
    if (this.getListFromMixin === true) {
      await this.getList()
    }
    await this.attachMore()
  }
}

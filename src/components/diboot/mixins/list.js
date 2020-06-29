import _ from 'lodash'
import moment from 'moment'
import { dibootApi } from '@/utils/request'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
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
      // 关联相关的更多数据
      more: {},
      // 获取关联数据列表的配置列表
      attachMoreList: [],
      // 是否将children转化为_children
      listFormatter: true,
      // 是否从mixin中自动获取初始的列表数据
      getListFromMixin: true,
      // 是否从mixin中自动获取关联数据
      getMore: false,
      // 标记加载状态
      loadingData: false,
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
    handlePaginationChanged() {
      this.queryParam.pageIndex = this.pagination.current
      this.queryParam.pageSize = this.pagination.pageSize
      this.getList()
    },
    appendSorterParam({ column, prop, order }) {
      const sorter = undefined
      console.log(column, prop, order)
      if (sorter !== undefined && sorter.field !== undefined) {
        const field = sorter.field
        const order = sorter.order === 'ascend' ? 'ASC' : 'DESC'
        const orderBy = `${field}:${order}`
        this.queryParam.orderBy = orderBy
      } else {
        this.queryParam.orderBy = undefined
      }
    },
    onSearch() {
      this.pagination.current = 1
      this.handlePaginationChanged()
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
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
    menuCommand(command, row) {
      if (command === 'update') {
        this.$refs.form.open(row.id)
      } else if (command === 'delete') {
        this.remove(row.id)
      }
    },
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
    rebuildQuery(query) {
      return query
    },
    async attachMore() {
      let res = {}
      if (this.getMore === true) {
        res = await dibootApi.get(`${this.baseApi}/attachMore`)
      } else if (this.attachMoreList.length > 0) {
        res = await dibootApi.post('/common/attachMore', this.attachMoreList)
      }
      if (res.code === 0) {
        this.more = res.data
        return res.data
      }
    },
    reset() {
      this.queryParam = {}
      this.dateRangeQuery = {}
      this.getList()
    },
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
    exportData() {
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
      })
    },
    /**
     * 下载文件
     * @param res
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
    afterLoadList(list) {

    },
    dateRange2queryParam() {
      _.forEach(this.dateRangeQuery, (v, k) => {
        if (k && v && v.length === 2) {
          this.queryParam[`${k}Begin`] = v[0].format('YYYY-MM-DD')
          this.queryParam[`${k}End`] = v[1].format('YYYY-MM-DD')
        }
      })
    }
  },
  async mounted() {
    if (this.getListFromMixin === true) {
      await this.getList()
    }
    await this.attachMore()
  }
}

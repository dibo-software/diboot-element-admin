import _ from 'lodash'
import moment from 'moment'
import { dibootApi } from '@/utils/request'
import Pagination from '@/components/Pagination'
import { downloadFileFromRes } from '@/utils/fileUtil'
import more from './more'
import { list2tree, treeList2IndentList } from '@/utils/treeDataUtil'

export default {
  mixins: [more],
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
      // 是否将children转化为_children
      listFormatter: true,
      // 是否从mixin中自动获取初始的列表数据
      getListFromMixin: true,
      // 标记加载状态
      loadingData: false,
      // 标记导出
      exportLoadingData: false,
      // 是否允许撤回删除
      allowCanceledDelete: false,
      // 是否重新加载
      reload: false,
      // 当前激活value
      currentPrimaryValue: '',
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
    list2tree(list = []) {
      return treeList2IndentList(list2tree(list))
    },
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
      if (prop != null && order != null) {
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
      return new Promise((resolve, reject) => {
        this.loadingData = true
        // 使用post方式请求列表数据（多用于复杂参数通过json对象进行传输到后端进行筛选）
        dibootApi.post(
          this.listApi ? this.listApi : `${this.baseApi}/list`,
          this.buildQueryParam()
        )
          .then(res => {
            this.loadingData = false
            if (res.code === 0) {
              this.list = this.filterListData(res.data)
              this.afterLoadList(this.list)
              if (res.page) {
                this.pagination.pageSize = res.page.pageSize
                this.pagination.current = res.page.pageIndex
                this.pagination.total = res.page.totalCount ? Number(res.page.totalCount) : 0
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
      return new Promise((resolve, reject) => {
        this.loadingData = true
        dibootApi.get(
          this.listApi ? this.listApi : `${this.baseApi}/list`,
          this.buildQueryParam()
        ).then(res => {
          this.loadingData = false
          if (res.code === 0) {
            this.list = this.filterListData(res.data)
            this.afterLoadList(this.list)
            if (res.page) {
              this.pagination.pageSize = res.page.pageSize
              this.pagination.current = res.page.pageIndex
              this.pagination.total = res.page.totalCount ? Number(res.page.totalCount) : 0
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
      } else {
        this[command](row)
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
          if (item.children != null) {
            item._children = item.children
            item.hasChildren = true
            delete item.children
          }
        })
      }
      return list
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
              if (_this.allowCanceledDelete) {
                const h = this.$createElement
                this.$message({
                  message: h('p', null, [
                    h('span', {
                      style: 'color: #666'
                    }, '当前数据删除成功 '),
                    h('el-button', {
                      props: {
                        type: 'text'
                      },
                      on: {
                        click: event => {
                          _this.canceledDelete(id)
                        }
                      }
                    }, '撤回')
                  ]),
                  type: 'success'
                })
              } else {
                _this.$message.success('当前数据删除成功')
              }
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
    async canceledDelete(id) {
      const res = await dibootApi.post(`${this.baseApi}/cancelDeleted/${id}`)
      if (res.code === 0) {
        this.$message.success('撤回成功')
        this.getList()
      } else {
        this.$message.error('撤回失败')
      }
    },
    /**
     * 批量删除
     * @returns {boolean}
     */
    batchRemove() {
      if (this.selectedRowKeys == null || this.selectedRowKeys.length === 0) {
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
            _this.$message.success(res.msg || '删除成功')
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
      if (this.exportLoadingData) return
      this.exportLoadingData = true
      const exportApi = this.exportApi ? this.exportApi : '/excel/export'
      dibootApi.download(`${this.baseApi}${exportApi}`, this.buildQueryParam()).then(res => {
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
     * 构建查询参数
     */
    buildQueryParam() {
      this.dateRange2queryParam()
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
      return tempQueryParam
    },
    /**
     * 编辑表格结束后触发
     * @param value
     * @param oldValue
     */
    async handleEditTableRow(model) {
      if (this.currentPrimaryValue) {
        try {
          const findModel = this.list.find(e => e[this.primaryKey] === this.currentPrimaryValue)
          const res = await dibootApi.put(`${this.baseApi}/${findModel[this.primaryKey]}`, findModel)
          if (res.code === 0) {
            await this.getList()
          } else {
            this.$message.warning(res.msg)
          }
        } catch (e) {
          this.$message.warning('网络异常')
        } finally {
          this.reload = !this.reload
        }
      }
      if (this.currentPrimaryValue === model[this.primaryKey]) {
        this.currentPrimaryValue = ''
      } else {
        this.currentPrimaryValue = model[this.primaryKey]
      }
    },
    /**
     * 下载文件
     * @param res 服务端响应，经过axios处理后的数据，详见src/utils/request.js部分的响应值配置
     */
    downloadFile(res) {
      downloadFileFromRes(res)
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
     * 点击级联类型后，加载select数据
     */
    handleCascaderSelectNext(data, clearParams = []) {
      // 将级联已经选中的统一清理
      clearParams.forEach(param => delete this.queryParam[param])
      // 选中的数据初始化
      Object.assign(this.more, data)
      this.$forceUpdate()
      this.onSearch()
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

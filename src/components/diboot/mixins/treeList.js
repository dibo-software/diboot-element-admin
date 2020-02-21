import request from '@/utils/request'
import Pagination from '@/components/Pagination/index'
export default {
  components: { Pagination },
  data() {
    return {
      treeSearch: '',
      treeList: {},
      currentNodeId: 0,
      showTree: false,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      queryParam: {},
      data: [],
      getMore: false,
      initList: true,
      more: {},
      loadingData: false,
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  methods: {
    loadTree() {
      request({
        url: this.getTreeApi,
        method: 'get'
      }).then(res => {
        this.treeList = this.treeListFormatter(res.data)
        this.showTree = true
      })
    },
    onTreeSelect(selectedKeys, info) {
      if (selectedKeys) {
        // 设置当前节点
        console.log('-------',selectedKeys)
        this.currentNodeId = selectedKeys.id
        // 准备表格查询参数，进行查询
        this.getList()
      }
    },
    refreshPage() {
      this.loadTree()
      this.getList()
    },
    treeListFormatter(treeList) {
      return treeList
    },
    handleTableChange(pagination) {
      this.queryParam.pageIndex = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.getList()
    },
    handlePaginationChanged() {
      this.queryParam.pageIndex = this.pagination.current
      this.queryParam.pageSize = this.pagination.pageSize
      this.getList()
    },
    getList() {
      this.loadingData = true
      // 过滤掉不存在值的属性
      const tempQueryParam = {}
      if (Object.keys(this.queryParam).length > 0) {
        for (const key in this.queryParam) {
          if (this.queryParam[key]) {
            tempQueryParam[key] = this.queryParam[key]
          }
        }
      }
      console.log('query', tempQueryParam)
      let url
      if (this.getTreeListApiPrefix) {
        url = `${this.getTreeListApiPrefix}/${this.currentNodeId}`
      }
      request({
        url,
        params: tempQueryParam,
        method: 'get'
      }).then(res => {
        this.data = res.data
        this.pagination.pageSize = res.page.pageSize
        this.pagination.current = res.page.pageIndex
        this.pagination.total = res.page.totalCount
        this.loadingData = false
      })
    },
    attachMore() {
      request({
        url: `${this.apiPrefix}/attachMore`,
        method: 'get'
      }).then(res => {
        this.more = res.data
      })
    },
    reset() {
      this.queryParam = {}
      this.getList()
    },
    remove(id) {
      this.$confirm('确定删除该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: `/${this.name}/${id}`,
          method: 'delete'
        }).then((res) => {
          this.$message.success('删除成功')
          this.getList()
        }).catch(err => {
          this.$message.error(err.msg)
        })
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  },
  watch: {
    treeSearch(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.loadTree()
  },
  async mounted() {
    if (this.initList === true) {
      await this.getList()
    }
    if (this.getMore === true) {
      await this.attachMore()
    }
  }
}

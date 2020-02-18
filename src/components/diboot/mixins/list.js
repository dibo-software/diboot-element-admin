import request from '@/utils/request'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      queryParam: {},
      data: [],
      getMore: false,
      getListFromMixin: true,
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
      request({
        url: `/${this.name}/list`,
        params: tempQueryParam,
        method: 'get'
      }).then(res => {
        this.data = res.data
        console.log('list', res)
        this.pagination.pageSize = res.page.pageSize
        this.pagination.current = res.page.pageIndex
        this.pagination.total = res.page.totalCount
        this.loadingData = false
      })
    },
    attachMore() {
      request({
        url: `/${this.name}/attachMore`,
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
    }
  },
  async mounted() {
    console.log('mounted', this.getListFromMixin)
    if (this.getListFromMixin === true) {
      await this.getList()
    }
    if (this.getMore === true) {
      await this.attachMore()
    }
  }
}

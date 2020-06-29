import { dibootApi } from '@/utils/request'

export default {
  data() {
    return {
      baseApi: '/',
      visible: false,
      // 是否全屏
      fullscreen: false,
      model: {},
      title: '',
      spinning: false
    }
  },
  methods: {
    async open(id) {
      const res = await dibootApi.get(`${this.baseApi}/${id}`)
      if (res.code === 0) {
        this.model = res.data
        this.title = '详情'
        this.visible = true
        this.afterOpen(id)
      } else {
        this.$notify.error({
          title: '获取详情信息失败',
          message: res.msg
        })
      }
    },
    close() {
      this.visible = false
      this.model = {}
      this.afterClose()
    },
    /** **
     * 打开表单之后的操作
     * @param id
     */
    afterOpen(id) {

    },
    afterClose() {

    }
  }
}

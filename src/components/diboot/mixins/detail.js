import { dibootApi } from '@/utils/request'
import { downloadFileFromPath } from '@/utils/fileUtil'

export default {
  data() {
    return {
      // 请求接口基础路径
      baseApi: '/',
      // 当前组件显示状态
      visible: false,
      // 当前详情框详情数据
      model: {},
      // 标题
      title: '',
      // 是否全屏
      fullscreen: false
    }
  },
  methods: {
    /**
     * 打开详情
     * @param id
     * @returns {Promise<void>}
     */
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
    /**
     * 关闭详情
     */
    close() {
      this.visible = false
      this.model = {}
      this.afterClose()
    },

    /**
     * 下载
     * @param path
     */
    async downloadFile(path) {
      await downloadFileFromPath(path)
    },
    /**
     * 打开之后的操作
     * @param id
     */
    afterOpen(id) {

    },

    /**
     * 关闭之后操作
     */
    afterClose() {

    }
  }
}

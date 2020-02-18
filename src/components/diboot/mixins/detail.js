import { dibootApi } from '@/utils/request'

export default {
  data() {
    return {
      visible: false,
      model: {},
      title: '',
      spinning: false
    }
  },
  methods: {
    async open(id) {
      console.log('----===-')
      console.log(this.name)
      const res = await dibootApi.get(`/${this.name}/${id}`)
      if (res.code === 0) {
        this.model = res.data
        this.title = '详情'
        this.visible = true
        this.afterOpen(this.model)
      } else {
        this.$message.error(res.msg)
      }
    },
    close() {
      this.visible = false
      this.model = {}
    },
    /** **
     * 打开表单之后的操作
     * @param id
     */
    afterOpen(model) {

    }
  }
}

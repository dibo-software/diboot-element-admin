import { dibootApi } from '@/utils/request'
import { list2childrenMap, treeList2list } from '@/utils/treeDataUtil'
import _ from 'lodash'

export default {
  data() {
    return {
      baseApi: '/',
      treeListApi: '',
      sortApi: '',
      visible: false,
      treeList: [],
      formatter: {
        value: 'id',
        title: 'name'
      }
    }
  },
  methods: {
    async open() {
      this.visible = true
      // 获取系统中所有的treeList
      try {
        const treeListApi = this.treeListApi ? this.treeListApi : `${this.baseApi}/list`
        const res = await dibootApi.get(treeListApi)
        if (res.code === 0) {
          this.afterOpen()
          this.treeList = this.treeListFormatter(res.data, this.formatter.value, this.formatter.title)
        } else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        console.log('获取树结构异常', e)
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    allowDrop(draggingNode, dropNode, type) {
      return type !== 'inner' && draggingNode.data.parentId === dropNode.data.parentId
    },
    onNodeDrop(draggingNode, dropNode, dropType, ev) {
      const list = this.childrenMap[draggingNode.data.parentId]
      if (list && list.length > 0) {
        this.submitSortList(list)
      }
    },
    submitSortList(list) {
      const sortApi = this.sortApi ? this.sortApi : `${this.baseApi}/sortList`
      dibootApi.post(sortApi, list).then(res => {
        if (res.code === 0) {
          this.$message.success('排序成功')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.$message.error('排序失败')
      })
    },
    treeListFormatter(treeList, valueField, titleField) {
      if (treeList === undefined || treeList.length === 0) {
        return undefined
      }
      const formatterList = []
      treeList.forEach(item => {
        const formatterItem = {
          parentId: item.parentId === undefined ? '' : `${item.parentId}`,
          id: item.id === undefined ? '' : `${item.id}`,
          sortId: item.sortId === undefined ? '' : `${item.sortId}`,
          key: item[valueField] === undefined ? '' : `${item[valueField]}`,
          value: item[valueField] === undefined ? '' : `${item[valueField]}`,
          label: item[titleField] === undefined ? '' : `${item[titleField]}`
        }
        if (item.children !== undefined && item.children.length > 0) {
          formatterItem.children = this.treeListFormatter(item.children, valueField, titleField)
        }
        formatterList.push(formatterItem)
      })

      return formatterList
    },
    close() {
      this.visible = false
      this.treeList = []
      this.$emit('complete')
      this.afterClose()
    },
    afterOpen() {

    },
    afterClose() {

    }
  },
  computed: {
    dataList: function() {
      if (!this.treeList || this.treeList.length === 0) {
        return []
      }
      return treeList2list(_.cloneDeep(this.treeList))
    },
    childrenMap: function() {
      return list2childrenMap(this.dataList)
    }
  }
}

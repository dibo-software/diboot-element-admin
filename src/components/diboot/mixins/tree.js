import { dibootApi } from '@/utils/request'
import { treeList2list } from '@/utils/treeDataUtil'
import _ from 'lodash'

export default {
  data() {
    return {
      treeListApi: '',
      treeList: [],
      currentNodeId: 0,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      selectedKeys: []
    }
  },
  methods: {
    loadTree() {
      dibootApi.get(this.treeListApi).then(res => {
        if (res.code === 0) {
          this.treeList = this.treeListFormatter(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    onTreeSelect(cnode) {
      if (cnode != undefined) {
        // 设置当前节点
        this.currentNodeId = cnode.key
        this.afterTreeSelect()
      }
    },
    cancelSelect() {
      this.currentNodeId = 0
      this.selectedKeys = []
      this.afterTreeSelect()
    },
    afterTreeSelect() {

    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    onSearchChange(e) {
      const value = e.target.value
      const expandedKeys = this.getExpandedKeys(this.treeList, value)
      if (expandedKeys.length > 0) {
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true
        })
      }
    },
    getExpandedKeys(list, value) {
      const allExpandedKeys = []
      const expandedKeys = list
        .map(item => {
          // 对children进行查找
          if (item.children && item.children.length > 0) {
            const childrenExpandedKeys = this.getExpandedKeys(item.children, value)
            if (childrenExpandedKeys.length > 0) {
              allExpandedKeys.push(...childrenExpandedKeys)
            }
          }
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.treeList)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      if (expandedKeys.length > 0) {
        allExpandedKeys.push(...expandedKeys)
      }

      return allExpandedKeys
    },
    getParentKey(key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    // 智能展开树状结构，默认只智能展开第一层（有maxCount个以上的节点，第一层收起，maxCount及maxCount个以下的节点，第一层展开）
    getInitSmartExpandedKeys(list, maxCount) {
      if (list.length > maxCount) {
        return []
      }
      return list.map(item => { return item.key })
    },
    getInitExpandedKeys(list) {
      const keys = []
      list.forEach(item => {
        if (item.children && item.children.length > 0) {
          keys.push(item.key)
          keys.push(...this.getInitExpandedKeys(item.children))
        }
      })
      return keys
    },
    refresh() {
      this.loadTree()
    },
    treeListFormatter(treeList) {
      return treeList
    }
  },
  computed: {
    dataList: function() {
      if (this.treeList === undefined || this.treeList.length === 0) {
        return []
      }
      return treeList2list(_.cloneDeep(this.treeList))
    },
    currentNode: function() {
      if (this.dataList.length === 0 ||
        this.currentNodeId === 0 || this.currentNodeId === '0' ||
        this.currentNodeId === undefined || this.currentNodeId === '') {
        return {}
      }
      return this.dataList.find(item => {
        return item.value === this.currentNodeId || `${item.value}` === this.currentNodeId
      })
    }
  },
  created() {
    this.loadTree()
  }
}

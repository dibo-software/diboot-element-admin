<template>
  <div class="diboot-tree">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="24">
        <el-alert
          v-if="currentNode.title"
          type="success"
          show-icon
          :closable="false"
        >
          <template slot="title">
            当前部门：{{ currentNode.title }}
            <a
              v-if="showCancel"
              href="javascript:;"
              style="margin-left: 10px;"
              @click="cancelSelect"
            >取消选中</a>
            <slot name="header" :currentNodeId="currentNodeId" />
          </template>
        </el-alert>
        <el-row style="margin: 10px 0;">
          <el-col :span="24">
            <el-input v-model="filterText" size="small" clearable placeholder="请输入搜索内容" class="input-with-select" />
          </el-col>
        </el-row>
        <el-tree
          v-if="treeList && treeList.length > 0"
          ref="tree"
          class="filter-tree"
          node-key="key"
          :data="treeList"
          :current-node-key="currentNodeId"
          :props="{label: 'title', children: 'children'}"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          default-expand-all
          @current-change="onTreeSelect"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import tree from '@/components/diboot/mixins/tree'
import { dibootApi } from '@/utils/request'

export default {
  name: 'TreeIndex',
  mixins: [tree],
  props: {
    treeApi: {
      type: String,
      required: true
    },
    /**
     * tree的头部标题
     */
    label: {
      type: String,
      default: '当前节点'
    },
    /**
     * tree 的key值
     */
    nodeKey: {
      type: String,
      default: 'id'
    },
    /**
     * tree的显示值
     */
    nodeName: {
      type: String,
      default: 'shortName'
    },
    /**
     * 是否可以取消选中
     */
    showCancel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    loadTree() {
      dibootApi.get(this.treeApi).then(res => {
        if (res.code === 0) {
          this.treeList = this.treeListFormatter(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    afterTreeSelect() {
      this.$emit('changeCurrentNode', this.currentNode)
    },
    /** *
       * treeList格式化
       * @param originTreeList
       * @returns {undefined}
       */
    treeListFormatter(originTreeList) {
      if (!originTreeList || originTreeList.length === 0) {
        return undefined
      }
      const formatterItemList = []
      originTreeList.forEach(item => {
        const formatterItem = {}
        formatterItem.key = item[this.nodeKey]
        formatterItem.value = item[this.nodeKey]
        formatterItem.title = item[this.nodeName]
        formatterItem.scopedSlots = { title: 'title' }
        const children = this.treeListFormatter(item.children)
        if (children != null) {
          formatterItem.children = children
        }
        formatterItemList.push(formatterItem)
      })
      // 如果需要默认展开所有，则初始化展开数据
      this.expandedKeys = this.getInitSmartExpandedKeys(formatterItemList, 5)
      return formatterItemList
    },
    filterNode(value, data) {
      if (!value) return true
      return data && data.title && data.title.indexOf(value) !== -1
    }
  }
}
</script>

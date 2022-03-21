<template>
  <div class="orgTree">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="24">
        <el-alert
          v-if="currentNode.title"
          type="success"
          show-icon
          :closable="false"
        >
          <template slot="title">
            {{ currentNode.title }}
            <a
              v-if="showCancel"
              href="javascript:;"
              style="margin-left: 10px;"
              @click="cancelSelect"
            >取消选中</a>
          </template>
        </el-alert>
        <el-row style="margin: 10px 0;">
          <el-col :span="24">
            <el-input v-model="filterText" size="small" placeholder="请输入搜索内容" clearable class="input-with-select" />
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

export default {
  name: 'ReadonlyOrgTree',
  mixins: [tree],
  props: {
    showCancel: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    canChange: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      baseApi: '/iam/org',
      treeListApi: '/iam/org/tree',
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    afterTreeSelect() {
      this.$emit('changeCurrentNode', this.currentNode)
    },
    /** *
       * orgList格式化
       * @param orgList
       * @returns {undefined}
       */
    treeListFormatter(orgList) {
      if (!orgList || orgList.length === 0) {
        return undefined
      }
      const formatterOrgList = []
      orgList.forEach(org => {
        const formatterOrg = {}
        formatterOrg.key = org.id
        formatterOrg.value = org.id
        formatterOrg.title = org.shortName
        formatterOrg.scopedSlots = { title: 'title' }
        const children = this.treeListFormatter(org.children)
        if (children != null) {
          formatterOrg.children = children
        }
        formatterOrgList.push(formatterOrg)
      })
      // 如果需要默认展开所有，则初始化展开数据
      this.expandedKeys = this.getInitSmartExpandedKeys(formatterOrgList, 5)
      return formatterOrgList
    },
    filterNode(value, data) {
      if (!value) return true
      return data && data.title && data.title.indexOf(value) !== -1
    }
  }
}
</script>

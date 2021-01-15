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
            <a
              v-if="canChange"
              v-permission="['create']"
              href="javascript:;"
              style="margin-left: 10px;"
              @click="$refs.orgForm.open(undefined)"
            >
              <i class="el-icon-plus" />
            </a>
            <a
              v-if="canChange"
              v-permission="['update']"
              href="javascript:;"
              style="margin-left: 10px;"
              @click="$refs.orgForm.open(currentNodeId)"
            >
              <i class="el-icon-edit" />
            </a>
            <a
              v-if="canChange"
              v-permission="['detail']"
              href="javascript:;"
              style="margin-left: 10px;"
              @click="$refs.orgDetail.open(currentNodeId)"
            >
              <i class="el-icon-view" />
            </a>
            <a
              v-if="canChange"
              v-permission="['delete']"
              href="javascript:;"
              style="margin-left: 10px;"
              @click="remove(currentNodeId)"
            >
              <i class="el-icon-delete" />
            </a>
          </template>
        </el-alert>
        <el-row style="margin: 10px 0;">
          <el-col :span="24">
            <el-input v-model="filterText" size="small" placeholder="请输入搜索内容" class="input-with-select" />
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
    <org-detail ref="orgDetail" />
    <org-form ref="orgForm" :current-node-id="`${currentNodeId}`" @complete="loadTree()" />
  </div>
</template>
<script>
import tree from '@/components/diboot/mixins/tree'
import orgForm from './form'
import orgDetail from './detail'
import { dibootApi } from '@/utils/request'

export default {
  name: 'OrgTree',
  components: {
    orgForm,
    orgDetail
  },
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
              this.$notify.success({
                title: '删除成功',
                message: '已删除该数据'
              })
              _this.cancelSelect()
              _this.loadTree()
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
        if (children !== undefined) {
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

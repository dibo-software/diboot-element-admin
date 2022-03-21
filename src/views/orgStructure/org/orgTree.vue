<template>
  <div class="app-container">
    <div v-if="canChange" v-permission="['create', 'sort']" class="table-operator">
      <el-button v-permission="['create']" type="primary" icon="el-icon-plus" @click="$refs.orgForm.open()">
        新建
      </el-button>
      <el-button v-permission="['sort']" type="default" icon="el-icon-rank" @click="$refs.orgTreeSort.open()">
        排序
      </el-button>
    </div>
    <tree
      ref="tree"
      node-name="shortName"
      :tree-api="treeApi"
      :show-cancel="true"
      @changeCurrentNode="onChangeCurrentNode"
    >
      <template slot="header" slot-scope="node">
        <a
          v-if="canChange"
          v-permission="['update']"
          title="编辑"
          href="javascript:;"
          style="margin-left: 10px;"
          @click="$refs.orgForm.open(node.currentNodeId)"
        >
          <i class="el-icon-edit" />
        </a>
        <a
          v-if="canChange"
          v-permission="['detail']"
          href="javascript:;"
          style="margin-left: 10px;"
          @click="$refs.orgDetail.open(node.currentNodeId)"
        >
          <i class="el-icon-view" />
        </a>
        <a
          v-if="canChange"
          v-permission="['delete']"
          title="删除"
          href="javascript:;"
          style="margin-left: 10px;"
          @click="remove(node.currentNodeId)"
        >
          <i class="el-icon-delete" />
        </a>
      </template>
    </tree>
    <org-detail ref="orgDetail" />
    <org-form ref="orgForm" :current-node-id="`${currentNode.value}`" @complete="$refs.tree.loadTree()" @changeKey="$emit('changeCurrentNode', currentNode.value)" />
    <org-tree-sort ref="orgTreeSort" @complete="$refs.tree.loadTree()" />
  </div>
</template>

<script>
import tree from '@/components/diboot/components/tree/index'
import orgDetail from './detail'
import orgForm from './form'
import orgTreeSort from './treeSort'
import { dibootApi } from '@/utils/request'

export default {
  name: 'OrgTree',
  components: {
    tree,
    orgForm,
    orgDetail,
    orgTreeSort
  },
  props: {
    showCancel: {
      type: Boolean,
      default: true
    },
    canChange: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentNode: { value: '0' },
      baseApi: '/iam/org',
      treeApi: '/iam/org/tree'
    }
  },
  methods: {
    loadTree() {
      this.$refs.tree.loadTree()
    },
    onChangeCurrentNode(currentNode) {
      // 事件处理代码
      this.currentNode = currentNode
      this.$emit('changeCurrentNode', currentNode)
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
              const h = this.$createElement
              this.$message({
                message: h('p', null, [
                  h('span', {
                    style: 'color: #666'
                  }, '当前数据删除成功 '),
                  h('el-button', {
                    props: {
                      type: 'text'
                    },
                    on: {
                      click: event => {
                        _this.canceledDelete(id)
                      }
                    }
                  }, '撤回')
                ]),
                type: 'success'
              })
              _this.$refs.tree.cancelSelect()
              _this.$refs.tree.loadTree()
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
    async canceledDelete(id) {
      const res = await dibootApi.delete(`${this.baseApi}/canceled/${id}`)
      if (res.code === 0) {
        this.$message.success('撤回成功')
        this.$refs.tree.cancelSelect()
        this.$refs.tree.loadTree()
      } else {
        this.$message.error('撤回失败')
      }
    }
  }

}
</script>
<style lang="less" scoped>
</style>

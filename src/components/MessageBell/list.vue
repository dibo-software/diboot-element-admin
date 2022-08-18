<template>
  <div class="container">
    <div class="scroll" @scroll="scrollHandler">
      <el-card
        v-for="item in dataList"
        :key="item.id"
        shadow="hover"
        class="card"
        @click.native="markRead([item.id])"
      >
        <div slot="header" class="clearfix">
          <el-badge is-dot :hidden="item.status === 'READ'" />
          <strong>{{ item.title }}</strong>
          <span style="float: right; padding: 3px 0">
            {{ item.createTime }}
          </span>
        </div>
        <p>{{ item.content }}</p>
        <div v-if="item.businessType" style="color: #bbb; zoom: 0.9; text-align: end">{{ item.businessType }}</div>
      </el-card>
      <el-empty v-show="!dataList.length" description="暂无消息" />
    </div>
    <el-button type="primary" ghost :disabled="unreadIds.length === 0" style="width: 100%" @click="markRead(unreadIds)">
      全标记已读
    </el-button>
  </div>
</template>

<script>
import { dibootApi } from '@/utils/request'
import _ from 'lodash'

export default {
  name: 'MessageList',
  props: {
    unread: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      baseApi: '/message',
      dataList: [],
      dataIds: [],
      total: 0,
      queryParam: {
        unread: this.unread,
        pageSize: 10,
        current: 1,
        total: 0
      },
      nextPageDebounce: _.debounce(this.nextPage, 1000, { leading: true, maxWait: 3000, trailing: false })
    }
  },
  computed: {
    unreadIds() {
      return this.dataList.filter(e => e.status !== 'READ').map(e => e.id)
    }
  },
  watch: {
    total(value) {
      this.$emit('total', this.total)
    }
  },
  created() {
    this.loadData()
    setInterval(() => {
      this.refresh()
    }, 300000)
  },
  methods: {
    nextPage() {
      if (this.total === this.dataList.length) return
      ++this.queryParam.pageIndex
      this.loadData()
    },
    loadData(reset = false) {
      dibootApi.get(`${this.baseApi}/own`, this.queryParam).then(res => {
        if (res.code === 0) {
          if (reset) {
            this.dataList = res.data || []
            this.dataIds = this.dataList.map(e => e.id)
          } else {
            const list = (res.data || []).filter(e => !this.dataIds.includes(e.id))
            this.dataList.push(...list)
            this.dataIds.push(...list.map(e => e.id))
          }
          this.queryParam.pageIndex = Number(res.page.pageIndex || 1)
          this.total = res.page.totalCount ? Number(res.page.totalCount) : 0
        } else {
          console.error('获取消息列表失败', res.msg)
        }
      }).catch(err => {
        console.error('获取消息列表异常', err.msg || err.message)
      })
    },
    scrollHandler(e) {
      const element = e.path[0]
      if (element.scrollHeight - element.scrollTop < 350 + 10) this.nextPage()
      else if (element.scrollHeight - element.scrollTop < 350 * 2) this.nextPageDebounce()
    },
    refresh() {
      this.queryParam.pageIndex = 1
      this.loadData(true)
    },
    async markRead(ids) {
      if (ids.length === 1) {
        const find = this.dataList.find(e => e.id === ids[0])
        if (!find) return
        await this.handle(find.businessCode, find.extDataMap)
        if (find.status === 'READ') return
        if (!this.unread) this.$set(find, 'status', 'READ')
      }
      dibootApi.post(`${this.baseApi}/read`, ids).then(res => {
        if (res.code === 0) {
          if (ids.length > 1) this.refresh()
          this.total = Math.max(this.total - ids.length, 0)
          if (this.unread) {
            this.dataIds = this.dataIds.filter(id => !ids.includes(id))
            this.dataList = this.dataList.filter(e => !ids.includes(e.id))
          }
          this.$emit('reset')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    async handle(type, data) {
      // 分类处理
      // switch (type) {
      //   default:
      //   // this.$emit('close') // 关闭 popover
      // }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 399px;
  overflow-x: auto;

  .scroll {
    height: 350px;
    overflow-y: auto;
    margin-bottom: 8px;

    .card {
      margin-bottom: 16px;
    }
  }
}
</style>

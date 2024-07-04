<template>
  <el-popover v-model="visible" placement="bottom-end">
    <el-tabs v-model="activeKey" style="width: 390px">
      <el-tab-pane name="unreadMessage">
        <template slot="label">
          未读消息
          <el-badge class="custom-badge" :value="countMap.unreadMessage" :hidden="countMap.unreadMessage === 0" />
        </template>
        <MessageList
          ref="unreadMessage"
          :unread="true"
          @close="visible = false"
          @reset="$refs.allMessages && $refs.allMessages.refresh()"
          @total="value => $set(countMap, 'unreadMessage', value)"
        />
      </el-tab-pane>
      <el-tab-pane name="allMessages" label="全部消息" lazy>
        <MessageList
          ref="allMessages"
          :unread="false"
          @reset="$refs.unreadMessage && $refs.unreadMessage.refresh()"
          @close="visible = false"
        />
      </el-tab-pane>
    </el-tabs>
    <el-badge slot="reference" :value="sumCount" :hidden="sumCount === 0" class="custom-badge">
      <i class="el-icon-bell" style="font-size: 18px;" />
    </el-badge>
  </el-popover>
</template>

<script>
import MessageList from './list'

export default {
  name: 'MessageBell',
  components: { MessageList },
  data() {
    return {
      visible: false,
      activeKey: 'unreadMessage',
      countMap: {
        unreadMessage: 0
      }
    }
  },
  computed: {
    sumCount() {
      return Object.values(this.countMap).reduce((prev, next) => prev + next)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-badge {
  ::v-deep .el-badge__content.is-fixed{
    top: 13px;
  }
}
</style>

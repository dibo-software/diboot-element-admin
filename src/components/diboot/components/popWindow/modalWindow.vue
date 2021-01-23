<template>
  <el-dialog
    :title="title"
    :width="width"
    :visible.sync="state.visible"
    append-to-body
  >
    <slot name="content" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'ModalWindow',
  props: {
    title: {
      type: String,
      default: '窗口'
    },
    width: {
      type: Number,
      default: 1200
    }
  },
  data() {
    return {
      state: {
        visible: false,
        bodyHeight: 320
      }
    }
  },
  created() {
    this.state.bodyHeight = window.innerHeight - 110
  },
  methods: {
    open() {
      this.state.visible = true
    },
    confirm() {
      this.$emit('confirm')
    },
    close() {
      this.state.visible = false
    }
  }
}
</script>

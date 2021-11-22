<template>
  <el-select
    filterable
    clearable
    v-model="value"
    @change="handleChange"
    :placeholder="placeholder">
    <slot></slot>
  </el-select>
</template>

<script>
import { dibootApi } from '@/utils/request'
export default {
  name: 'Cascader',
  mounted() {
    // 初始化的时候触发
    if (this.value) {
      this.handleChange(this.value)
    }
  },
  methods: {
    /**
     * 当前select改变触发获取当前select绑定的目标选择框数据
     */
    async handleChange(value) {
      this.$emit('input', value)
      let nextData = {}
      try {
        // 向目标接口发送请求
        const res = await dibootApi.post(this.targetUrl, {
          triggerValue: value,
          targetList: this.targetList,
          extParams: this.extParams
        })
        if (res.code === 0) {
          // 增加next事件，向下一级传递需要渲染的数据
          nextData = res.data
        } else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        this.$message.error('网络异常！')
      }
      this.$emit('next', nextData, this.clearParams)
    }
  },
  props: {
    /**
     * 级联目标的数据
     */
    targetList: {
      type: Array,
      required: true
    },
    /**
     * 切换类别后需要清除的数据key
     */
    clearParams: {
      type: Array,
      required: true
    },
    /**
     * 目标请求的URL
     */
    targetUrl: {
      type: String,
      default: '/common/cascaderTargetList'
    },
    /**
     * 扩展参数
     */
    extParams: {
      type: Object,
      default: () => {
      }
    },
    /**
     * 选择框默认文字
     */
    placeholder: {
      type: String
    },
    // 切换model时 用于替换值
    value: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number | Array
    }
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
</style>

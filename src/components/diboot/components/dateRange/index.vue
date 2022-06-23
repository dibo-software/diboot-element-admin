<template>
  <div>
    <el-date-picker
      v-model="value[0]"
      style="width: calc(50% - 15px);"
      :type="showTime ? 'datetime' : 'date'"
      clearable
      :format="format"
      :value-format="format"
      placeholder="开始日期"
      @change="onChange"
    />
    ~
    <el-date-picker
      v-model="value[1]"
      style="width: calc(50% - 15px);"
      :type="showTime ? 'datetime' : 'date'"
      clearable
      :format="format"
      :value-format="format"
      placeholder="结束日期"
      @change="onChange"
    />
  </div>
</template>

<script>
export default {
  name: 'DateRange',
  props: {
    value: {
      type: Array,
      default: () => [undefined, undefined]
    },
    showTime: {
      type: Boolean,
      default: false
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    allowClear: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onChange() {
      const { value } = this
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped>

</style>

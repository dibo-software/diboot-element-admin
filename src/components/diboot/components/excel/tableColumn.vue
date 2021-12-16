<template>
  <el-table-column
    :prop="column.key"
    :label="column.title"
    :show-overflow-tooltip="showOverflowTooltip"
    min-width="100"
    align="center"
    :formatter="formatter"
  >
    <table-column
      v-for="(item, index) in column.children"
      :key="index"
      :column="item"
      :show-overflow-tooltip="showOverflowTooltip"
      :formatter="formatter"
    />
  </el-table-column>
</template>

<script>
export default {
  name: 'TableColumn',
  props: {
    column: {
      type: Object,
      required: true
    },
    showOverflowTooltip: {
      type: Boolean,
      default: false
    },
    formatter: {
      type: Function,
      default: null
    }
  }
}
</script>

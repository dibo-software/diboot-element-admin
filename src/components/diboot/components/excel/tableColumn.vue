<template>
  <el-table-column
    :prop="column.key"
    :label="column.title"
    show-overflow-tooltip
    min-width="100"
    align="center"
    :formatter="formatter"
  >
    <table-column v-if="column.children" :columns="column.children" :formatter="formatter" />
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
    formatter: {
      type: Function,
      default: null
    }
  }
}
</script>

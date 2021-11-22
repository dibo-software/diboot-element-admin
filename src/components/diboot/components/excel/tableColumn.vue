<template>
  <section>
    <el-table-column
      v-for="(column, index) in columns"
      :key="`data-preview-${column.key}-${index}`"
      :prop="column.key"
      :label="column.title"
      show-overflow-tooltip
      min-width="100"
      align="center"
      :formatter="formatter"
    >
      <table-column v-if="column.children" :columns="column.children" :formatter="formatter" />
    </el-table-column>
  </section>
</template>

<script>
export default {
  name: 'TableColumn',
  props: {
    columns: {
      type: Array,
      required: true
    },
    formatter: {
      type: Function,
      default: null
    }
  }
}
</script>

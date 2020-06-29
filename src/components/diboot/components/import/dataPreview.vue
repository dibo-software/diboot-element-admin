<template>
  <div class="import-preview" v-if="visible">
    <el-divider></el-divider>
    <div v-if="dataList.length>0">
      <div class="alert alert-info">
        Excel文件解析成功，共有 <strong>{{ dataList.length }}</strong> 条数据可上传.
      </div>
      <el-table
        style="width: 100%"
        :data="dataList"
      >
        <el-table-column
          v-for="(column, index) in columns"
          :key="`data-preview-${_uid}-${index}`"
          :prop="column.dataIndex"
          :label="column.title">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataPreview',
  data() {
    return {
      visible: false,
      infos: {
        isPreview: true
      },
      columns: [],
      headers: [],
      dataList: []
    }
  },
  methods: {
    preview(headers, dataList) {
      this.visible = true
      this.headers = headers
      this.dataList = dataList
      const columns = []
      if (headers && headers.length > 0) {
        headers.forEach(header => {
          columns.push({ title: header.title, dataIndex: header.key })
        })
      }
      this.columns = columns
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
  .import-preview {
    margin-top: 10px;
  }
  .alert{
    border-radius: 3px;
    padding: 15px;
    margin-bottom: 20px;
    border: 1px solid transparent;
    color: #fff;
  }
  .alert-info{
    background-color: #00c0ef;
  }
</style>

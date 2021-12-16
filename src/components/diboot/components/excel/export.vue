<template>
  <span style="margin: 0 10px;">
    <el-dropdown split-button type="default" @click="exportData" @command="handleCommand">
      <i :class="exportLoadingData ? 'el-icon-loading' : 'el-icon-download'" /> 导出
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="select">选择列导出</el-dropdown-item>
        <el-dropdown-item v-for="(item, index) in options" :key="index" :divided="index === 0" :command="item.columns">
          {{ item.title }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog :visible.sync="dialogVisible" :width="width">
      <span slot="title">
        选择导出列
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          style="margin-left: 25px;"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
      </span>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-table border :data="dataList" style="width: 100%">
          <table-column v-for="(column, index) in tableHead" :key="index" :column="column" :formatter="formatter" />
        </el-table>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import TableColumn from '@/components/diboot/components/excel/tableColumn'
import { dibootApi } from '@/utils/request'

export default {
  name: 'Export',
  components: {
    TableColumn
  },
  props: {
    exportUrl: {
      type: String,
      required: true
    },
    tableHeadUrl: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      required: true
    },
    /**
     * 示例：[{title:'导出用户联系方式',columns:['realname','userNum','mobilePhone']}]
     */
    options: {
      type: Array,
      default: () => []
    },
    width: {
      type: String,
      default: '50%'
    }
  },
  data() {
    return {
      exportLoadingData: false,
      dialogVisible: false,
      tableLoading: false,
      tableHead: [],
      dataList: [{}],
      // 选择
      checkedCities: [],
      cities: [],
      checkAll: true,
      isIndeterminate: false
    }
  },
  methods: {
    confirm() {
      this.handleCommand(this.checkedCities)
      this.dialogVisible = false
    },
    formatter(row, column, cellValue, index) {
      const property = column.property
      if (!this.cities.includes(property)) {
        this.cities.push(property)
        this.checkedCities.push(property)
      }
      return this.$createElement('el-checkbox', {
        props: {
          label: property
        },
        style: {
          width: '100%',
          height: '100%'
        }
      }, '')
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    exportData() {
      this.__download(this.exportUrl)
    },
    handleCommand(columns) {
      if (columns instanceof Array) {
        this.__download(this.exportUrl, { ...this.params, columns })
      } else {
        this.dialogVisible = true
        if (this.tableHead.length === 0) {
          this.tableLoading = true
          dibootApi.get(this.tableHeadUrl)
            .then(res => {
              this.tableHead = res.data
              this.tableLoading = false
            })
            .catch(res => {
              this.$message.error(res.msg)
            })
        }
      }
    },
    __download(url, params = this.params) {
      if (this.exportLoadingData) {
        return
      }
      this.exportLoadingData = true
      dibootApi.download(url, params).then(res => {
        if (res.code && res.code === 4006) {
          this.$message.error(res.msg)
          return
        }
        const blob = new Blob([res.data])
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = res.filename
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, res.filename)
        }
        this.exportLoadingData = false
      }).catch(err => {
        console.log(err)
        this.exportLoadingData = false
      })
    }
  }
}
</script>

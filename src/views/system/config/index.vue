<template>
  <div class="app-container">
    <el-empty v-if="!type" description="无系统配置项" />
    <el-button
      v-if="type && editable"
      size="small"
      type="warning"
      plain
      style="position: absolute; right: 20px; z-index: 99"
      @click="deleteConfig()"
    >
      <i class="el-icon-close" /> 重置
    </el-button>
    <el-tabs v-if="type" v-model="type">
      <el-tab-pane v-for="item in typeList" :key="item.value" :name="item.value" :label="item.label || '(未命名)'">
        <el-card shadow="hover" style="margin: 3vh 10vw">
          <div v-if="editable" style="color: #AAAAAA; text-align: end;zoom: 0.8;">双击编辑</div>
          <table>
            <tr v-for="config in configList" :key="config.prop">
              <th style="padding: 15px">
                {{ config.propLabel }}
                <span v-show="config._edit && config.required" style="color: red">*</span>
              </th>
              <td>
                <span v-if="typeof config.defaultValue === 'boolean'" style="margin-left: 10px">
                  <el-switch
                    v-if="editable"
                    v-model="config.value"
                    @change="update(config)"
                  />
                  <el-tag v-else :type="config.value ? 'success' : 'info'">
                    {{ config.value }}
                  </el-tag>
                </span>
                <span v-else-if="config._edit">
                  <el-select
                    v-if="config.options"
                    v-model="config.value"
                    v-focus
                    style="width: calc(100% - 10px);margin-left: 5px"
                    @change="update(config)"
                    @clear="update(config)"
                    @blur="cancelEdit(config)"
                  >
                    <el-option v-for="option in config.options" :key="option" :value="option" />
                  </el-select>
                  <span v-else>
                    <el-input
                      v-model="config.value"
                      v-focus
                      style="width: calc(100% - 80px);margin-left: 5px"
                      @keyup.enter.native="update(config)"
                      @blur="getConfigData"
                    />
                    <i class="el-icon-circle-check action-icon" style="color: #00FF00;" @mousedown="update(config)" />
                    <i class="el-icon-circle-close action-icon" style="color: orange;" @mousedown="deleteConfig(config.prop)" />
                  </span>

                </span>
                <span v-else class="content" :style="editable ? { cursor: 'pointer'} : {}" @dblclick="edit(config)">
                  {{ config.value }}
                </span>
              </td>
            </tr>
          </table>
          <el-collapse v-if="item.ext && editable" style="margin-top: 30px">
            <el-collapse-item>
              <template slot="title">
                <h2 style="color: #42b983">配置测试</h2>
              </template>
              <el-input
                v-for="key in item.ext"
                :key="key"
                v-model="item.data[key]"
                :placeholder="key"
                style="margin-bottom: 10px"
              />
              <div style="margin-bottom: -10px">
                <el-button type="primary" plain @click="configTest(item.data)">测试</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { dibootApi } from '@/utils/request'
import { hasPermissions } from '@/utils/helper/checkPermission'

export default {
  name: 'SystemConfig',
  directives: {
    focus: {
      inserted(el) {
        const child = el.children[0]
        child.children.length ? child.children[0].focus() : child.focus()
      }
    }
  },
  data() {
    return {
      baseApi: '/systemConfig',
      type: null,
      typeList: [],
      configList: []
    }
  },
  computed: {
    editable() {
      return hasPermissions(['update'], this)
    }
  },
  watch: {
    type(type) {
      if (type) {
        this.getConfigData()
      }
    }
  },
  created() {
    dibootApi.get(`${this.baseApi}/typeList`).then(res => {
      this.typeList = res.data
      if (this.typeList && this.typeList.length > 0) {
        this.type = res.data[0].value
        res.data.forEach(e => {
          if (e.ext) {
            this.$set(e, 'data', {})
          }
        })
      }
    })
  },
  methods: {
    getConfigData() {
      dibootApi.get(`${this.baseApi}/${this.type}`).then(res => {
        res.data.forEach(e => typeof e.defaultValue === 'boolean' && this.$set(e, 'value', e.value === 'true'))
        this.configList = res.data
      })
    },
    edit(data) {
      if (this.editable) {
        this.$set(data, '_edit', true)
      }
    },
    cancelEdit(data) {
      setTimeout(() => {
        data._edit = false
      }, 300)
    },
    update(data) {
      if (data.required && (data.value == null || `${data.value}`.trim().length === 0)) {
        return this.$message.error('不能为空')
      }
      dibootApi.post(`${this.baseApi}`, data).then(res => {
        if (res.ok) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败，稍后重试！')
        }
        this.getConfigData()
      })
    },
    deleteConfig(prop = '') {
      this.$confirm(`重置${prop ? '该配置' : ` ·${this.typeList.find(e => e.value === this.type).label}· `}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dibootApi.delete(`${this.baseApi}/${this.type}/${prop}`).then(res => {
          if (res.ok) {
            this.$message.success('重置成功')
          } else {
            this.$message.error('重置失败，稍后重试！')
          }
          this.getConfigData()
        })
      })
    },
    configTest(data) {
      dibootApi.post(`${this.baseApi}/${this.type}`, data).then(res => {
        if (res.ok) {
          this.$message.success('操作成功')
        } else {
          this.$notify.error({
            title: '测试失败',
            message: res.msg,
            duration: 0
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
table, table tr th, table tr td {
  border: 1px solid #e8e8e8;
}

table {
  border-collapse: collapse;

  tr {
    th {
      background-color: #fafafa;
      width: 220px;
    }

    td {
      text-align: left;
      width: 100vw;
    }
  }
}

.action-icon {
  zoom: 2;
  cursor: pointer;
  vertical-align: middle;
}

.content {
  width: 100%;
  height: 36px;
  padding: 10px;
  display: inline-block;
}

</style>

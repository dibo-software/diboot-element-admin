<template>
  <el-dialog class="detailModal" :visible.sync="visible" title="查看详情" @closed="close">
    <el-row :gutter="20">
      <el-col :span="4" class="label">
        类型名称：
      </el-col>
      <el-col :span="8">
        {{ model.itemName }}
      </el-col>
      <el-col :span="4" class="label">
        类型编码：
      </el-col>
      <el-col :span="8">
        {{ model.type }}
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4" class="label">
        包含子项：
      </el-col>
      <el-col :span="20">
        <template v-if="children && children.length > 0">
          <el-tag
            v-for="(item,i) in children"
            :key="i"
            type="success"
            size="small"
            :style="{marginRight: '15px'}"
          >
            {{ item.itemName }}({{ item.itemValue }})
          </el-tag>
        </template>
        <el-tag v-if="!children || children.length === 0" type="info" size="small">无</el-tag>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4" class="label">
        备注：
      </el-col>
      <el-col :span="20">
        {{ model.description || '-' }}
      </el-col>
    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" @click="close">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import detail from '@/components/diboot/mixins/detail'
import { dibootApi } from '@/utils/request'
export default {
  name: 'DictDetail',
  mixins: [detail],
  data() {
    return {
      name: 'dictionary'
    }
  },
  methods: {
    async afterOpen(model) {
      this.initSubItem(model)
    },
    initSubItem: function(data) {
      if (data.children && data.children.length > 0) {
        var children = []
        data.children.forEach(child => {
          children.push({ id: child.id, itemName: child.itemName, itemValue: child.itemValue })
        })
        this.children = children
      } else {
        this.children = []
      }
    },
    close() {
      this.visible = false
      this.model = {}
      this.children = []
    }
  }
}
</script>
<style lang="scss">
</style>

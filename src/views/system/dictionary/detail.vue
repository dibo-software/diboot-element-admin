<template>
  <el-dialog class="detailModal" :visible.sync="visible" title="查看详情" @closed="close">
    <el-form label-position="left" inline class="detail-item-container">
      <el-form-item label="类型名称">
        <span>{{ model.itemName }}</span>
      </el-form-item>
      <el-form-item label="类型编码">
        <span>{{ model.type }}</span>
      </el-form-item>
      <el-form-item label="包含子项">
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
      </el-form-item>
      <el-form-item label="备注">
        <span>
          {{ model.description || '-' }}
        </span>
      </el-form-item>
    </el-form>

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
export default {
  name: 'DictDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/dictionary'
    }
  },
  methods: {
    async afterOpen(id) {
      this.initSubItem(this.model)
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

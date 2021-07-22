<template>
  <el-dialog
    :visible.sync="visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
  >
    <el-row slot="title" type="flex">
      <el-col :span="20">{{ title }}</el-col>
      <el-col :span="4" style="text-align: right">
        <svg-icon
          :icon-class="!fullscreen ? 'fullscreen': 'exit-fullscreen'"
          style="cursor: pointer; margin-right: 10px"
          @click="() => {fullscreen = !fullscreen}"
        />
        <i class="el-icon-close" style="cursor: pointer" @click="close" />
      </el-col>
    </el-row>
    <el-form label-position="right" inline class="detail-item-container" label-width="100px">
      <el-row :gutter="18">
        <el-col :span="24">
          <el-form-item label="业务类型">
            <span>{{ model.businessType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="业务标识">
            <span>{{ model.businessCode }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="标题">
            <span>{{ model.title }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="内容">
            <span>{{ model.content }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="发送方">
            <span>{{ model.sender }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接收方">
            <span>{{ model.receiver }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="发送结果">
            <span>{{ model.result }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="定时发送时间">
            <span>{{ model.scheduleTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="扩展数据">
            <span>{{ model.extData }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="创建时间">
            <span>{{ model.createTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="更新时间">
            <span>{{ model.updateTime }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'

export default {
  name: 'MessageDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/message'
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

<template>
  <el-dialog
    :visible.sync="visible"
    :fullscreen="fullscreen"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :close-on-click-modal="false"
    :show-close="false"
    @closed="close"
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
    <el-form label-position="left" inline class="detail-item-container" label-width="130px">
      <el-row :gutter="18">
        <el-col :span="24">
          <el-form-item label="关联对象类">
            <span>{{ model.relObjType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="关联对象ID">
            <span>{{ model.relObjId }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="关联对象属性">
            <span>{{ model.relObjField }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文件名">
            <span>{{ model.fileName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="访问地址">
            <el-button type="text" size="mini" @click="downloadFile(model.accessUrl)">
              {{ model.accessUrl }}
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文件类型">
            <span>{{ model.fileType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="数据量">
            <span>{{ model.dataCount }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <span>{{ model.description }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="创建人">
            <span>{{ model.createByName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="创建时间">
            <span>{{ model.createTime }}</span>
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
  name: 'UploadFileDetail',
  mixins: [detail],
  data() {
    return {
      baseApi: '/uploadFile'
    }
  }
}
</script>

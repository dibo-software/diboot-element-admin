<template>
  <div class="upload">
    <el-upload
      :class="{hide: hideUpload && limitCount !== 1}"
      action=""
      :list-type="actualListType"
      :file-list="fileList"
      :http-request="handleCustomRequest"
      :before-upload="handleBeforeUploadFile"
      :on-remove="handleRemoveFile"
      :accept="limitType"
      :show-file-list="limitCount !== 1 || !isImage"
      @on-preview="handlePreview"
    >
      <template v-if="limitCount === 1 && isImage">
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" width="100%" />
        <div v-else>
          <i :class="loading ? 'el-icon-loading' : 'el-icon-plus'"></i>
          <div class="ant-upload-text">
            {{uploadText}}
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="listType === 'picture-card'">
          <i :class="loading ? 'el-icon-loading' : 'el-icon-plus'"></i>
        </template>
        <template v-else>
          <el-button class="upload-btn">
            <i :class="loading ? 'el-icon-loading' : 'el-icon-upload2'" />{{uploadText}}
          </el-button>
        </template>
      </template>
      <div slot="tip" class="el-upload__tip" v-if="fileList.length === 0" style="color: #ddd">请上传{{limitSize}}M以内的{{isImage ? 'jpg/png格式图片': '文件'}}</div>
    </el-upload>
    <el-dialog :visible.sync="previewVisible">
      <img width="100%" :src="imageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { dibootApi } from '@/utils/request'
export default {
  name: 'Upload',
  data() {
    return {
      loading: false,
      imageUrl: '',
      previewVisible: false,
      hideUpload: false
    }
  },
  computed: {
    // 长度为1 的时候，且为图片，那么类型只能是picture-card
    actualListType() {
      return this.limitCount === 1 && this.isImage ? 'picture-card' : this.listType
    }
  },
  created() {
    if (this.limitCount === 1 && this.isImage && this.value) {
      this.imageUrl = `${this.prefix}${this.value}/image`
    }
  },
  watch: {
    fileList() {
      this.hideUpload = this.isImage && this.limitCount <= this.fileList.length
    }
  },
  methods: {
    /**
     * 上传之前操作
     */
    handleBeforeUploadFile(file) {
      if (this.limitCount !== 1 && this.limitCount <= this.fileList.length) {
        this.$message.error(`最多只能上传${this.limitCount}${this.isImage ? '张图片' : '个文件'}`)
        return false
      }
      if (this.isImage) {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
        if (!isImg) {
          this.$message.error('请上传jpg、png格式的图片！')
          return isImg
        }
        const isLtLimitSize = file.size / 1024 / 1024 < this.limitSize
        if (!isLtLimitSize) {
          this.$message.error(`最多只能上传${this.limitSize}MB的图片，请调整您的图片!`)
          return isLtLimitSize
        }
      } else {
        const isLtLimitSize = file.size / 1024 / 1024 < this.limitSize
        if (!isLtLimitSize) {
          this.$message.error(`最多只能上传${this.limitSize}MB的文件，请调整您的文件!`)
          return isLtLimitSize
        }
      }
      return true
    },

    /**
     * 自定义上传策略
     */
    handleCustomRequest(data) {
      this.loading = true
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('relObjField', this.relObjField)
      formData.append('relObjType', this.relObjType)
      dibootApi.upload(this.action, formData).then((res) => {
        if (res.code === 0) {
          if (this.limitCount === 1) {
            this.fileList.length = 0
            this.fileList.push(this.fileFormatter(res.data))
          } else {
            this.fileList.push(this.fileFormatter(res.data))
          }
          console.log('current', this.fileList)
          this.$emit('input', this.fileList.map(file => file.filePath).join(','))
        } else {
          this.$message.error(res.msg)
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
        this.$message.error('网络连接异常，请稍后再试')
      })
    },

    /**
     * 删除文件
     */
    handleRemoveFile(file) {
      // 如果超出上传数量，会调用一次handleRemoveFile，此时file数据结构为element封装的数据结构{name: "huaban.png",raw: File,...}
      // 检测到这种数据不用处理
      if (file.raw) {
        return
      }
      console.log('remove', file)
      console.log('remove front', this.fileList)
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList.length = 0
      this.fileList.push(...newFileList)
      console.log('remove end', this.fileList)
      console.log(this.fileList.map(file => file.filePath).join(','))
      this.$emit('input', this.fileList.map(file => file.filePath).join(','))
    },
    /**
     * 预览
     */
    async handlePreview(file) {
      this.imageUrl = file.url || file.preview
      this.previewVisible = true
    },
    /**
     * 取消预览
     */
    handleCancel() {
      this.imageUrl = ''
      this.previewVisible = false
    },
    /**
     * 数据转化
     */
    fileFormatter(data) {
      const file = {
        uid: data.uuid, // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
        name: data.fileName || ' ', // 文件名
        filePath: data.accessUrl, // 文件路径
        url: `${this.prefix}${data.accessUrl}/image`
      }
      // 如果是但图片设置URL
      if (this.isImage && this.limitCount === 1) {
        this.imageUrl = `${this.prefix}${data.accessUrl}/image`
      }
      return file
    }
  },
  props: {
    /**
     * 地址前缀
     */
    prefix: {
      type: String
    },
    /**
     * 请求地址
     */
    action: {
      type: String,
      required: true
    },
    /**
     * 绑定的业务对象
     */
    relObjType: {
      type: String,
      required: true
    },
    /**
     * 绑定业务对象的属性
     */
    relObjField: {
      type: String,
      required: true
    },
    /**
     * 文件存储位置
     */
    fileList: {
      type: Array,
      required: true
    },
    /**
       * 上传列表的内建样式，支持2种基本样式 text,  picture-card，去掉 picture 默认text
       */
    listType: {
      type: String,
      default: 'text'
    },
    /**
     * 上传数量限制，默认 1 （为1的时候则可以切换）
     */
    limitCount: {
      type: Number,
      default: 1
    },
    /**
     * 上传类型限制，不传默认所有文件
     */
    limitType: {
      type: String
    },
    /**
    /**
     * 单个文件上传大小，默认2M
     */
    limitSize: {
      type: Number,
      default: 2
    },
    /**
     * 是否是图片，默认不是图片类型（主要用户上传后构建值）
     */
    isImage: {
      type: Boolean,
      default: false
    },
    /**
     * 上传提示文本
     */
    uploadText: {
      type: String,
      default: '上传'
    },
    /**
     * 值
     */
    value: {
      type: String
    }
  }
}
</script>

<style scoped lang="sass" rel="stylesheet/sass">
</style>
<style lang="sass" rel="stylesheet/sass">
  .custom-upload-preview-modal
    .ant-modal-close-x
      width: 30px
      height: 30px
      line-height: 30px
  .hide .el-upload--picture-card
      display: none
</style>

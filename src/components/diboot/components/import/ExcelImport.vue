<template>
  <el-card class="diboot-import content">
    <div slot="header" class="clearfix">
      <span>数据上传</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="handleDownloadExample" icon="el-icon-download">
        下载示例文件
      </el-button>
    </div>
    <div class="clearfix upload-wrapper">
      <el-row :gutter="16">
        <el-col :md="6">
          <el-upload
            action=""
            :fileList="fileList"
            :remove="handleRemove"
            :beforeUpload="beforeUpload"
            class="upload-list-inline"
          >
            <el-button icon="el-icon-upload">
              选择文件
            </el-button>
          </el-upload>
        </el-col>
        <el-col :md="8">
          <el-input placeholder="备注信息" v-model="comment"/>
        </el-col>
        <el-col :md="10">
          <el-button
            type="primary"
            @click="handlePreview"
            :disabled="previewDisabled"
            style="margin-right: 8px;"
            icon="el-icon-view"
          >
            预览数据
          </el-button>
          <el-button
            :disabled="uploadDisabled"
            type="default"
            @click="handleUpload"
            icon="el-icon-upload"
          >
            上传数据
          </el-button>
        </el-col>
      </el-row>
      <el-row v-if="errMsg">
        <el-col :span="24">
          <br>
          <el-alert type="error" >
            <div>
              <b>请检查Excel文件，错误信息: </b><br>
              {{ errMsg }}
            </div>
          </el-alert>
        </el-col>
      </el-row>
    </div>
    <data-preview ref="dataPreview"></data-preview>
  </el-card>
</template>

<script>
import dataPreview from '@/components/diboot/components/import/dataPreview'
import { dibootApi } from '@/utils/request'

export default {
  name: 'ExcelImport',
  components: {
    dataPreview
  },
  data() {
    return {
      /**
       * 上传的文件
       */
      fileList: [],
      /**
       * 文件备注
       */
      comment: '',
      /**
       * 是否禁用预览
       */
      previewDisabled: true,
      /**
       * 是否禁用上传
       */
      uploadDisabled: true,
      /**
       * 预览时候使用
       */
      importFileNameObj: {},
      fileNameFields: {
        originFileName: 'originFileName',
        previewFileName: 'previewFileName'
      },
      /**
       * 错误信息提示
       */
      errMsg: ''
    }
  },
  methods: {
    /**
       * 下载样例文件
       */
    handleDownloadExample() {
      dibootApi.download(this.exampleUrl)
        .then(res => {
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
        }).catch(err => {
          console.log(err)
        })
    },

    /**
     * 删除操作
     */
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
      this.previewDisabled = this.fileList.length === 0
      this.uploadDisabled = this.fileList.length === 0
      this.importFileNameObj = {}
      this.errMsg = ''
      this.$refs.dataPreview.close()
    },
    /**
     * 上传之前操作
     */
    beforeUpload(file) {
      this.fileList = [...this.fileList, file].splice(-1)
      this.previewDisabled = this.fileList.length === 0
      this.uploadDisabled = this.fileList.length === 0
      this.errMsg = ''
      console.log('this.refs==>', this.$refs)
      this.$refs.dataPreview.close()
      return false
    },
    /**
     * 预览
     */
    handlePreview() {
      const { previewUrl } = this
      const fileForm = this.__buildFileForm()
      // 上传文件请求
      dibootApi.upload(previewUrl, fileForm)
        .then(res => {
          if (res.code === 0) {
            this.importFileNameObj[this.fileNameFields.originFileName] = res.data[this.fileNameFields.originFileName]
            this.importFileNameObj[this.fileNameFields.previewFileName] = res.data[this.fileNameFields.previewFileName]
            this.$refs.dataPreview.preview(res.data.header, res.data.dataList)
            this.errMsg = ''
            this.uploadDisabled = false
          } else {
            this.errMsg = res.msg
            this.uploadDisabled = true
          }
        })
    },

    /**
       * 上传
       */
    handleUpload() {
      const { uploadUrl, previewSaveUrl } = this
      this.previewDisabled = true
      this.uploadDisabled = true
      if (this.importFileNameObj[this.fileNameFields.previewFileName] && this.importFileNameObj[this.fileNameFields.originFileName]) {
        const formData = new FormData()
        formData.append(this.fileNameFields.previewFileName, this.importFileNameObj[this.fileNameFields.previewFileName])
        formData.append(this.fileNameFields.originFileName, this.importFileNameObj[this.fileNameFields.originFileName])
        this.__sendUploadRequest(previewSaveUrl, formData)
      } else {
        const fileForm = this.__buildFileForm()
        this.__sendUploadRequest(uploadUrl, fileForm)
      }
    },

    /**
       * 发送上传请求
       */
    __sendUploadRequest(url, formData) {
      if (Object.keys(this.fieldsRequired).length > 0) {
        for (const key in this.fieldsRequired) {
          formData.append(key, this.fieldsRequired[key])
        }
      }
      dibootApi.upload(url, formData)
        .then(res => {
          if (res.code === 0) {
            this.$message.success({
              message: '上传数据成功',
              description: res.msg
            })
            this.errMsg = ''
            this.$emit('finishedUpload')
            this.__resetData()
            this.$refs.dataPreview.close()
          } else {
            this.errMsg = res.msg
          }
          this.previewDisabled = false
          this.uploadDisabled = false
        })
        .catch(err => {
          this.previewDisabled = false
          this.uploadDisabled = false
          this.errMsg = '上传异常，请稍后重试！'
          console.log('upload err: ', err)
        })
    },

    /**
       * 构建form表单数据
       * @returns {FormData}
       * @private
       */
    __buildFileForm() {
      const { fileList } = this
      const formData = new FormData()
      formData.append('comment', this.comment)
      formData.append('file', fileList[0])
      return formData
    },

    /**
       * 重置数据
       * @private
       */
    __resetData() {
      this.fileList = []
      this.comment = ''
      this.previewDisabled = true
      this.uploadDisabled = true
      this.importFileNameObj = {}
    }
  },
  props: {
    /**
     * 示例文件url
     */
    exampleUrl: {
      type: String,
      required: true
    },
    /**
     * 上传url
     */
    uploadUrl: {
      type: String,
      required: true
    },
    /**
     * 预览url
     */
    previewUrl: {
      type: String,
      required: true
    },
    /**
     * 预览保存URL
     */
    previewSaveUrl: {
      type: String,
      required: true
    },
    /**
     * 提交时候必须的参数
     */
    fieldsRequired: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>
.diboot-import {
  webkit-box-shadow: unset !important;
  box-shadow: unset !important;
}
.diboot-import>.el-card__header{
  border: unset;
}
</style>

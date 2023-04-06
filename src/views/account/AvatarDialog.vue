<template>
  <el-dialog
    title="修改头像"
    :visible="visible"
    :confirm-loading="confirmLoading"
    destroy-on-close
    width="800"
    @close="cancelHandel"
  >
    <el-row>
      <el-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :auto-crop="options.autoCrop"
          :auto-crop-width="options.autoCropWidth"
          :auto-crop-height="options.autoCropHeight"
          :fixed-box="options.fixedBox"
          @realTime="realTime"
        />
      </el-col>
      <el-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img">
        </div>
      </el-col>
    </el-row>

    <template slot="footer">
      <el-button key="back" @click="cancelHandel">取消</el-button>
      <el-button key="submit" type="primary" :loading="confirmLoading" @click="okHandel">保存</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { VueCropper } from 'vue-cropper'
import { baseURL, dibootApi } from '@/utils/request'
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  name: 'AvatarDialog',
  components: {
    VueCropper
  },
  data() {
    return {
      baseApi: '/iam/user',
      visible: false,
      filename: '',
      confirmLoading: false,

      options: {
        img: '',
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      previews: {}
    }
  },
  methods: {
    ...mapGetters(['info']),
    edit(filename, imgSrc) {
      this.options.img = imgSrc
      this.filename = filename
      this.visible = true
    },
    cancelHandel() {
      this.$emit('cancel')
      this.visible = false
    },

    dataURLtoFile(dataurl, filename) {
      const arr = dataurl.split(',')
      const test = arr[0].match(/:(.*?);/)
      if (test) {
        const mime = test[1]
        const bstr = window.atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
      }
    },
    okHandel() {
      const vm = this
      vm.confirmLoading = true
      this.$refs.cropper.getCropData(data => {
        const file = this.dataURLtoFile(data, this.filename)
        const formData = new FormData()
        formData.set('file', file)
        dibootApi.upload('/uploadFile/upload/dto', formData).then(res => {
          const data = _.cloneDeep(this.info())
          data.avatarUrl = res.data.accessUrl
          dibootApi.post(`${this.baseApi}/updateCurrentUserInfo`, data).then(response => {
            vm.$message.success('上传头像成功')
            vm.$store.commit('user/SET_AVATAR', `${baseURL}${response.data.avatarUrl}`)
            vm.confirmLoading = false
            vm.cancelHandel()
          }).catch(() => {
            this.$message.error('上传头像失败')
            vm.confirmLoading = false
            vm.cancelHandel()
          })
        }).catch(() => {
          this.$message.error('上传图片失败')
        })
      })
    },

    realTime(data) {
      this.previews = data
    }
  }
}
</script>

<style lang="scss" scoped>

.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>

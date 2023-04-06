<template>
  <div class="app-container">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="120px">
          <el-form-item label="姓名" prop="realname">
            <el-input v-model="form.realname" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select
              v-model="form.gender"
              placeholder="性别"
            >
              <el-option
                v-for="(item, index) in more.genderOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="mobilePhone">
            <el-input v-model="form.mobilePhone" placeholder="请输入电话" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="xxx@xxx.com" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <input ref="avatarFile" type="file" hidden accept=".jpg,.png" @change="selectFile">
        <div class="ant-upload-preview" @click="$refs.avatarFile.click()">
          <div class="mask">
            <i class="el-icon-plus" />
          </div>
          <img :src="avatar">
        </div>
      </el-col>
    </el-row>
    <avatar-dialog ref="avatar" @cancel="$refs.avatarFile.value =''" />
  </div>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
import { mapGetters } from 'vuex'
import AvatarDialog from './AvatarDialog'
export default {
  name: 'AccountSetting',
  components: {
    AvatarDialog
  },
  mixins: [form],
  data() {
    return {
      baseApi: '/iam/user',
      attachMoreList: [
        {
          target: 'GENDER'
        }
      ],
      initFormData: {
        realname: '',
        gender: '',
        mobilePhone: '',
        email: []
      },
      rules: {
        'realname': [{ required: true, message: '姓名不能为空', trigger: 'change' }],
        'gender': [{ required: true, message: '性别不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['avatar'])
  },
  async mounted() {
    this.attachMore()
    await this.getCurrentUserInfo()
  },
  methods: {
    async getCurrentUserInfo() {
      const res = await dibootApi.get('/iam/user/getCurrentUserInfo')
      if (res.code === 0) {
        this.form = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    /**
     * 更新记录的提交
     * @param values
     * @returns {Promise<string>}
     */
    async update(values) {
      const res = await dibootApi.post(`${this.baseApi}/updateCurrentUserInfo`, values)
      if (res.code === 0) {
        return { data: res.data, msg: '保存成功' }
      } else {
        throw new Error(res.msg)
      }
    },
    /**
     * 提交成功之后的处理
     * @param msg
     */
    submitSuccess(result) {
      this.$notify.success({
        title: '操作成功',
        message: result.msg
      })
      this.$store.commit('SET_NAME', this.form.realname)
    },
    selectFile(event) {
      const filepath = event.target.value
      const file = event.target.files[0]
      const fileTypes = ['.jpg', '.png']
      const fileEnd = filepath.substring(filepath.lastIndexOf('.'))
      if (fileTypes.indexOf(fileEnd) > -1) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
          this.$refs.avatar.edit(file.name, e.target.result)
        }
      } else {
        this.$message.error('请上传图片文件！')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  height: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0,0,0,0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img, .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
  img {
    line-height: 180px;
    height: max-content;
  }
}
</style>

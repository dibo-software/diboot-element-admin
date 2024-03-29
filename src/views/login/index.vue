<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Diboot Element Admin</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-row>
        <el-col :span="16">
          <el-form-item prop="captcha">
            <span class="svg-container">
              <svg-icon icon-class="nested" />
            </span>
            <el-input
              ref="password"
              v-model="loginForm.captcha"
              placeholder="请输入验证码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <img
            :src="`${baseURL}/auth/captcha?traceId=${loginForm.traceId}`"
            alt="验证码"
            style="height: 40px; margin-top: 4px; margin-right: 8px; cursor: pointer;"
            @click="refreshTraceId()"
          >
        </el-col>
      </el-row>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">确定</el-button>
      <el-button v-if="enableSso" type="danger" style="width: 100%; margin: 0;" @click.native.prevent="ssoLogin">SSO 登录</el-button>

      <div class="tips" />

    </el-form>
  </div>
</template>

<script>
import { login, isEnableSso } from '@/utils/sso'
import JSEncrypt from 'jsencrypt'

const encryptor = new JSEncrypt()
encryptor.setPublicKey(`MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzPy1UcwzgRT8dRUpAW0H
eyVvIi4icqiwdBZMrh85+tJEZ/AXjELRzl89m2ZKoMHfoMDkajoxJeaL5IV9UpUl
+1RqWvWqgYL0r859FyDeNg9kiMAfApyIowqFqctDx7k77jDopBvcX8F0shl6SUtE
Vu96tc7+FrjP4OGwXJeB+b04O2SCV4mHxs8TRn7YsLoA10mjPNnsX0TiYkzSGUP/
E5OEYt/ixNwO/lC6TdFM9PXRaTjF76e5qHw6ksJU74mb3A9/ZQCb4nzVw15xTxIa
AnDX7+FqnCgpu26yXMLtVXyEa6CUvBjLLBleJ/cyHuUir7GYutf5LyuIEJPEWgnZ
BwIDAQAB`)

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        traceId: Math.random().toString(36).slice(-8) + Date.parse(new Date())
      },
      loginRules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        captcha: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      baseURL: process.env.VUE_APP_BASE_API,
      // 启用SSO
      enableSso: isEnableSso()
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    ssoLogin() {
      login()
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', { ...this.loginForm, password: encryptor.encrypt(this.loginForm.password) }).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(err => {
            this.loading = false
            this.refreshTraceId()
            this.$message.error(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    refreshTraceId() {
      this.loginForm.traceId = Math.random().toString(36).slice(-8) + Date.parse(new Date())
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-button{
    height: 42px;
    font-size: 16px;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

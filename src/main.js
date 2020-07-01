import Vue from 'vue'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import permission from '@/directive/permission/index'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

Vue.use(Viewer)
Viewer.setDefaults({
  toolbar: true
})

// 设置ElementUI的默认语言为简体中文
// 设置ElementUI的布局尺寸
Vue.use(ElementUI, {
  locale,
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// 注册全局权限指令
permission.install(Vue)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

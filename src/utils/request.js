import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router/index'
import qs from 'qs'
import { setToken, getToken, removeToken } from '@/utils/auth'

// token在Header中的key
const JWT_HEADER_KEY = 'authtoken'
// tokan自动刷新（发送心跳）的时间间隔（分钟）
const TOKEN_REFRESH_EXPIRE = 10
// 心跳计时器
let pingTimer = {}
setPingTimer()
// baseURL
const BASE_URL = process.env.VUE_APP_BASE_API
// create an axios instance
const service = axios.create({
  baseURL: BASE_URL, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers[JWT_HEADER_KEY] = getToken()
    }

    // 只针对get方式进行序列化
    if (config.method === 'get') {
      config.paramsSerializer = function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // 检查是否携带有新的token
    const newToken = response.headers[JWT_HEADER_KEY]
    if (newToken) {
      // 将该token设置到vuex以及本地存储中
      setToken(newToken)
      store.commit('SET_TOKEN', newToken)
    }
    // 如果请求成功，则重置心跳定时器
    if (response.status === 200) {
      resetPingTimer()
    }

    // 如果返回的自定义状态码为 4001， 则token过期，需要清理掉token并跳转至登录页面重新登录
    if (response.data && response.data.code === 4001) {
      removeToken()
      router.push('/login')
      throw new Error('登录过期，请重新登录')
    }
    // 如果当前请求是下载请求
    if (response.headers.filename) {
      return {
        data: response.data,
        filename: decodeURI(response.headers.filename),
        code: parseInt(response.headers['err-code'] || '0'),
        msg: decodeURI(response.headers['err-msg'] || '')
      }
    }

    return response.data
  },
  error => {
    let message = '网络可能出现问题'
    if (error && error.response && error.response.status) {
      const status = error.response.status
      if (status === 500) {
        message = '服务器好像开小差了，重试下吧！'
      } else if (status === 400) {
        message = '提交数据出错'
      } else if (status === 401) {
        message = '没有权限'
      } else if (status === 403) {
        message = '无权访问'
      } else if (status === 404) {
        message = '请求资源不存在'
      }
      Message.error(message)
    }
    return Promise.reject(error)
  }
)
// 自定义dibootApi请求快捷方式
const dibootApi = {
  get(url, params) {
    return service.get(url, {
      params
    })
  },
  post(url, data) {
    return service({
      method: 'POST',
      url,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  },
  put(url, data) {
    return service({
      method: 'PUT',
      url,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  },
  /**
   * 删除
   * @param url
   * @param params
   * @returns {AxiosPromise}
   */
  delete(url, params) {
    return service({
      url,
      method: 'DELETE',
      params,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      withCredentials: true
    })
  },
  /** *
   * 上传文件接口
   * @param url
   * @param formData
   * @returns {AxiosPromise}
   */
  upload(url, formData) {
    return service({
      url,
      method: 'POST',
      data: formData
    })
  },
  /**
   * GET下载文件
   * @param url
   * @param data
   * @returns {AxiosPromise}
   */
  download(url, params) {
    return service({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      observe: 'response',
      params,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      withCredentials: true
    })
  },
  /**
   * POST下载文件（常用于提交json数据下载文件）
   * @param url
   * @param data
   * @returns {AxiosPromise}
   */
  postDownload(url, data) {
    return service({
      url,
      method: 'POST',
      responseType: 'arraybuffer',
      observe: 'response',
      data: JSON.stringify(data),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      withCredentials: true
    })
  }
}

/**
 * 设置一个心跳定时器
 */
function setPingTimer() {
  pingTimer = setTimeout(() => {
    dibootApi.post('/iam/ping')
    resetPingTimer()
  }, TOKEN_REFRESH_EXPIRE * 60 * 1000)
}

/**
 * 重置一个心跳定时器
 */
function resetPingTimer() {
  clearTimeout(pingTimer)
  setPingTimer()
}

export default service
export {
  service as axios,
  BASE_URL as baseURL,
  dibootApi
}

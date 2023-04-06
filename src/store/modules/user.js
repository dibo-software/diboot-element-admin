import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { permissionListToPermissions } from '@/utils/permissions'
import defaultAvatar from '@/assets/logo.png'
import { logout as ssoLogout } from '@/utils/sso'
import { baseURL } from '@/utils/request'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: {},
  info: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    if (avatar) {
      state.avatar = avatar + '/image'
    } else {
      state.avatar = defaultAvatar
    }
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_INFO: (state, info) => {
    state.info = info
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, captcha, traceId } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, captcha: captcha, traceId }).then(res => {
        if (res.code === 0) {
          const { data } = res
          commit('SET_TOKEN', data)
          setToken(data)
          resolve(res)
        } else {
          reject(res.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (data.role) {
          const role = data.role
          // 更改permission的默认的列表字段
          if (data.role.permissionList.length > 0) {
            role.permissions = permissionListToPermissions(data.role.permissionList)
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
          } else {
            role.permissions = []
            role.permissionList = []
          }
          // 记录role
          commit('SET_ROLES', role)
        } else {
          reject(new Error('请配置该账号的角色与权限！'))
        }

        if (!data) {
          reject('认证失败，请重新登录！')
        }

        const { name, info } = data

        commit('SET_NAME', name)
        commit('SET_INFO', info)
        const isExternal = /^(https?:|mailto:|tel:|\/\/)/.test(info.avatarUrl)
        commit('SET_AVATAR', isExternal ? info.avatarUrl : baseURL + info.avatarUrl)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve) => {
      const reset = () => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        ssoLogout()
        resolve()
      }

      logout(state.token).then(() => {
        reset()
      }).catch(() => {
        reset()
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


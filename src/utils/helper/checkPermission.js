/**
 * 检查权限
 *
 * @author : uu
 * @version v1.0
 * @Date 2021/1/23  16:45
 */
import store from '@/store'

/**
 *
 * @param permissions 数组
 */
export const hasPermissions = function(permissions = [], vue) {
  const roles = store.getters && store.getters.roles
  if (roles.superAdmin === true) {
    return true
  }
  // 如果路由没配权限，那么均可访问
  const elVal = vue.$route.meta.permission
  const permissionId = elVal instanceof String && [elVal] || elVal
  //
  if (!permissionId) {
    return true
  }
  if (permissions && permissions instanceof Array && permissions.length > 0) {
    // 当前允许的权限列表
    const actions = permissions
    const hasPermission = roles.permissions.some(p => {
      if (!permissionId.includes(p.permissionId)) {
        return false
      }
      if (!p.actionList || p.actionList.length === 0) {
        return false
      }
      let hasAction = false
      for (let i = 0; i < actions.length; i++) {
        const actionName = actions[i]
        if (p.actionList.includes(actionName)) {
          hasAction = true
          break
        }
      }
      return hasAction
    })
    return hasPermission
  } else {
    return false
  }
}

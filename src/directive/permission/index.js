import permission from './permission'
import permissionAgain from '@/directive/permission/permissionAgain'
import permissionMissing from '@/directive/permission/permissionMissing'

const install = function(Vue) {
  Vue.directive('permission', permission)
  Vue.directive('permissionAgain', permissionAgain)
  Vue.directive('permissionMissing', permissionMissing)
}

if (window.Vue) {
  window['permission'] = permission
  window['permissionAgain'] = permissionAgain
  window['permissionMissing'] = permissionMissing
  Vue.use(install); // eslint-disable-line
}

export default { install }

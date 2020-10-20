import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '我的工作台', icon: 'component' }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/dictionary/list',
    name: 'System',
    meta: { title: '系统管理', icon: 'dashboard', permission: ['system'] },
    children: [
      {
        path: 'dictionary/list',
        name: 'DictList',
        component: () => import('@/views/system/dictionary/list'),
        meta: { title: '数据字典管理', permission: ['Dictionary'] }
      },
      {
        path: 'iamUser/list',
        name: 'IamUserList',
        component: () => import('@/views/system/iamUser/list'),
        meta: { title: '系统用户管理', permission: ['IamUser'] }
      },
      {
        path: 'iamRole/list',
        name: 'IamRoleList',
        component: () => import('@/views/system/iamRole/list'),
        meta: { title: '角色权限管理', permission: ['IamRole'] }
      },
      {
        path: 'iamFrontendPermission/list',
        name: 'IamFrontendPermission',
        component: () => import('@/views/system/iamFrontendPermission/list'),
        meta: { title: '菜单权限管理', permission: ['IamFrontendPermission'] }
      },
      {
        path: 'iamOperationLog/list',
        name: 'IamOperationLogList',
        component: () => import('@/views/system/iamOperationLog/list'),
        meta: { title: '操作日志查看', permission: ['IamOperationLog'] }
      },
      {
        path: 'iamLoginTrace/list',
        name: 'IamLoginTraceList',
        component: () => import('@/views/system/iamLoginTrace/list'),
        meta: { title: '登录日志查看', permission: ['IamLoginTrace'] }
      }
    ]
  },

  {
    path: '/account',
    component: Layout,
    redirect: '/account/setting',
    name: 'Account',
    meta: { title: '个人中心', icon: 'people' },
    children: [
      {
        path: 'setting',
        name: 'AccountSetting',
        component: () => import('@/views/account/Setting'),
        meta: { title: '基本设置' }
      },
      {
        path: 'changePwd',
        name: 'AccountChangePwd',
        component: () => import('@/views/account/ChangePwd'),
        meta: { title: '更改密码' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

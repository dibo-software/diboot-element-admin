import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { isEnableSso, callback } from '@/utils/sso'

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
    path: '/callback',
    name: 'callback',
    component: {
      created() {
        callback()
      },
      render: h => h('h2', {
        style: {
          lineHeight: '100vh',
          textAlign: 'center'
        }
      }, '登录中……')
    }
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
      meta: { title: '我的工作台', icon: 'dashboard' }
    }]
  }
]

export const asyncRoutes = [
  // 组织架构管理
  {
    path: '/orgStructure',
    redirect: '/orgStructure/org-tree-list',
    component: Layout,
    meta: { title: '组织管理', icon: 'el-icon-s-grid', permission: ['orgStructure'] },
    children: [
      {
        path: '/orgStructure/org',
        name: 'OrgIndex',
        component: () => import('@/views/orgStructure/org/Index'),
        meta: { title: '组织机构管理', permission: ['IamOrg'] }
      },
      {
        path: '/orgStructure/position',
        name: 'PositionIndex',
        component: () => import('@/views/orgStructure/position/list'),
        meta: { title: '岗位管理', permission: ['IamPosition'] }
      },
      {
        path: '/orgStructure/orgUser',
        name: 'OrgUserIndex',
        component: () => import('@/views/orgStructure/orgUser/Index'),
        meta: { title: '组织人员管理', permission: ['IamOrgUser'] }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/dictionary/list',
    name: 'System',
    meta: { title: '系统管理', icon: 'el-icon-setting', permission: ['system'] },
    children: [
      {
        path: 'dictionary/list',
        name: 'DictList',
        component: () => import('@/views/system/dictionary/list'),
        meta: { title: '数据字典管理', permission: ['Dictionary'] }
      },
      {
        path: 'iamUser/index',
        name: 'IamUserIndex',
        component: () => import('@/views/system/iamUser/Index'),
        meta: { title: '系统用户管理', permission: ['IamUser'] }
      },
      {
        path: 'iamRole/list',
        name: 'IamRoleList',
        component: () => import('@/views/system/iamRole/list'),
        meta: { title: '角色权限管理', permission: ['IamRole'] }
      },
      {
        path: 'iamResourcePermission/list',
        name: 'IamResourcePermission',
        component: () => import('@/views/system/iamResourcePermission/list'),
        meta: { title: '资源权限管理', permission: ['IamResourcePermission'] }
      },
      {
        path: 'messageTemplate/list',
        name: 'messageTemplateList',
        component: () => import('@/views/system/messageTemplate/list'),
        meta: { title: '消息模版管理', keepAlive: true, permission: ['MessageTemplate'] }
      },
      {
        path: 'message/list',
        name: 'messageList',
        component: () => import('@/views/system/message/list'),
        meta: { title: '消息记录管理', keepAlive: true, permission: ['Message'] }
      },
      {
        path: 'scheduleJob/list',
        name: 'ScheduleJobIndex',
        component: () => import('@/views/system/scheduleJob/list'),
        meta: { title: '定时任务管理', permission: ['ScheduleJob'] }
      },
      {
        path: 'uploadFile/list',
        name: 'uploadFileList',
        component: () => import('@/views/system/uploadFile/list'),
        meta: { title: '上传文件管理', keepAlive: true, permission: ['UploadFile'] }
      },
      {
        path: 'config',
        name: 'systemConfig',
        component: () => import('@/views/system/config/index'),
        meta: { title: '系统配置管理', keepAlive: true, permission: ['SystemConfig'] }
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
  mode: isEnableSso() ? 'history' : 'hash', // 使用SSO时只能是history模式
  base: process.env.BASE_URL,
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

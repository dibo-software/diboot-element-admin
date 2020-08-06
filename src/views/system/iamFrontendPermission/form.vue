<template>
  <el-dialog
    :visible.sync="state.visible"
    :fullscreen="fullscreen"
    class="frontend-permission-form"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
  >
    <el-row slot="title" type="flex">
      <el-col :span="20">{{title}}</el-col>
      <el-col :span="4" style="text-align: right">
        <svg-icon
          :icon-class="!fullscreen ? 'fullscreen': 'exit-fullscreen'"
          style="cursor: pointer; margin-right: 10px"
          @click="() => {fullscreen = !fullscreen}"
        />
        <i class="el-icon-close" style="cursor: pointer" @click="close" />
      </el-col>
    </el-row>
    <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="120px">
      <el-form-item label="上级菜单" prop="parentId">
        <el-select v-model="form.parentId" filterable placeholder="请选择上级菜单" style="width: 100%;">
          <el-option
            v-for="item in menuDataList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.id === undefined" label="当前菜单选取">
        <el-select
          v-model="currentMenu"
          filterable
          placeholder="请选取当前菜单"
          style="width: 100%;"
          @change="onMenuNameChange"
        >
          <el-option
            v-for="item in routerList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单名称" prop="displayName">
        <el-input v-model="form.displayName" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="菜单编码" prop="frontendCode">
        <el-input v-model="form.frontendCode" placeholder="请输入菜单编码" />
      </el-form-item>
      <el-form-item label="当前页接口列表" prop="apiSetList">
        <el-select v-model="form.apiSetList" multiple filterable placeholder="请选取当前菜单页面接口列表" style="width: 100%;">
          <el-option
            v-for="item in apiList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="按钮/权限列表">
        <el-button
          v-if="form.permissionList && form.permissionList.length === 0"
          plain
          type="primary"
          icon="el-icon-plus"
          @click="addNewPermission"
        >
          添加
        </el-button>
        <el-tabs
          v-else
          v-model="currentPermissionActiveKey"
          type="border-card"
          editable
          @edit="handleTabsEdit"
        >
          <el-tab-pane
            v-for="(permission, index) in form.permissionList"
            :key="`border-card_${_uid}_${index}`"
            :label="permission.displayName"
            :name="`${index}`"
          >
            <el-form-item label="按钮/权限编码">
              <el-select
                v-if="more.frontendPermissionCodeKvList"
                v-model="permission.frontendCode"
                filterable
                allow-create
                placeholder="请选取当前按钮/权限编码"
                style="width: 100%;"
                @change="value => changePermissionName(permission, value)"
              >
                <el-option
                  v-for="(item, i) in more.frontendPermissionCodeKvList"
                  :key="`frontend-code_${_uid}_${i}`"
                  :label="`${item.k}[${item.v}]`"
                  :value="item.v"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="按钮/权限名称">
              <el-input v-model="permission.displayName" placeholder="请输入按钮/权限名称" />
            </el-form-item>
            <el-form-item label="当前页接口列表" prop="apiSetList">
              <el-select
                v-model="permission.apiSetList"
                multiple
                filterable
                placeholder="请选取当前菜单页面接口列表"
                @change="value => {permission.apiSetList = value; $forceUpdate();}"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in apiList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit" @click="onSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import _ from 'lodash'
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
import { mapState } from 'vuex'
import { apiListFormatter, routersFormatter, treeListFormatter, treeList2IndentList } from '@/utils/treeDataUtil'

const NEW_PERMISSION_ITEM = {
  id: undefined,
  parentId: '',
  displayType: 'PERMISSION',
  displayName: '新按钮/权限',
  frontendCode: '',
  apiSetList: []
}
export default {
  name: 'IamFrontendPermissionForm',
  mixins: [form],
  data() {
    return {
      baseApi: '/iam/frontendPermission',
      getMore: true,
      apiTreeList: [],
      currentMenu: '',
      currentPermissionActiveKey: '0',
      initFormData: {
        parentId: '0',
        displayName: '',
        frontendCode: '',
        apiSetList: [],
        permissionList: []
      },
      rules: {
        'parentId': [{ required: true, message: '上级菜单不能为空', trigger: 'blur' }],
        'displayName': [{ required: true, message: '菜单名称不能为空', trigger: 'change' }],
        'frontendCode': [{ required: true, message: '菜单编码不能为空', trigger: 'blur' }, { validator: this.checkCodeDuplicate, trigger: 'blur' }]
      }
    }
  },

  computed: {
    ...mapState({
      addRoutes: state => state.permission.addRoutes
    }),
    routerTreeList: function() {
      return routersFormatter(this.addRoutes)
    },
    routerList: function() {
      return treeList2IndentList(_.cloneDeep(this.routerTreeList), 0)
    },
    apiList: function() {
      return treeList2IndentList(_.cloneDeep(this.apiTreeList), 0)
    },
    menuTreeData: function() {
      let menuTreeData = []
      if (this.more && this.more.menuList) {
        menuTreeData = treeListFormatter(this.more.menuList, 'id', 'displayName', true)
      }
      menuTreeData.splice(0, 0, { key: '0', value: '0', label: '顶级菜单' })
      return menuTreeData
    },
    menuDataList: function() {
      if (this.menuTreeData.length === 0) {
        return []
      }
      return treeList2IndentList(_.cloneDeep(this.menuTreeData), 0)
    },
    existPermissionCodes: function() {
      if (!this.form.permissionList) {
        return []
      }
      return this.form.permissionList.map(item => {
        return item.frontendCode
      })
    }
  },
  methods: {
    async afterOpen(id) {
      this.attachMore()
      if (id) {
        this.form.parentId = `${this.form.parentId}`
        this.form.permissionList.forEach(item => {
          if (!item.apiSetList || item.apiSetList.length === 0) {
            item.apiSetList = []
          }
        })
      }

      dibootApi.get(`${this.baseApi}/apiList`).then(res => {
        if (res.code === 0) {
          this.apiTreeList = apiListFormatter(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    onMenuNameChange(value) {
      if (this.routerList || this.routerList.length > 0) {
        const currentMenu = this.routerList.find(item => {
          return item.value === value
        })
        if (currentMenu === undefined) {
          return false
        }
        // 自动设置菜单名称与菜单编码
        this.form.frontendCode = currentMenu.value
        // eslint-disable-next-line no-irregular-whitespace
        this.form.displayName = currentMenu.label ? currentMenu.label.replace(/　/g, '') : ''
        // 自动设置菜单页面所需接口
        this.form.apiSetList = []
        if (!currentMenu.value) {
          return false
        }
        const currentApi = this.apiList.find(item => {
          return item.value && item.value.toLowerCase().includes(currentMenu.value.toLowerCase())
        })
        if (currentApi === undefined || !currentApi.value) {
          return false
        }
        this.form.apiSetList.push(currentApi.value)
      }
    },

    /** *
     * 提交前的验证流程
     * @returns {Promise<any>}
     */
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs['dataForm'].validate((valid, values) => {
          if (valid) {
            const errMsgs = []
            // 对按钮/权限列表进行验证
            if (this.form.permissionList.length > 0) {
              const notChangePerIdxList = []
              const nullDisplayNameIdxList = []
              const nullFrontendCodeIdxList = []
              this.form.permissionList.forEach((permission, i) => {
                // 校验按钮/权限名称是否为空以及是否更改
                if (!permission.displayName) {
                  nullDisplayNameIdxList.push(i + 1)
                } else if (permission.displayName === NEW_PERMISSION_ITEM.displayName) {
                  notChangePerIdxList.push(i + 1)
                }
                // 校验按钮/权限编码是否设置
                if (!permission.frontendCode) {
                  nullFrontendCodeIdxList.push(i + 1)
                }
              })
              // 收集验证错误信息
              if (notChangePerIdxList.length > 0) {
                errMsgs.push(`第 ${notChangePerIdxList.join('、')} 个按钮/权限的名称没有更改`)
              }
              if (nullDisplayNameIdxList.length > 0) {
                errMsgs.push(`第 ${nullDisplayNameIdxList.join('、')} 个按钮/权限的名称没有填写`)
              }
              if (nullFrontendCodeIdxList.length > 0) {
                errMsgs.push(`第 ${nullFrontendCodeIdxList.join('、')} 个按钮/权限的编码没有填写`)
              }
            }
            if (errMsgs.length > 0) {
              const msg = errMsgs.join('；') + '。'
              this.$message.error(msg)
              reject(msg)
            }

            // 获取当前菜单的可用接口列表
            this.form.apiSetList = this.form.apiSetList.filter(api => {
              return api !== undefined && api !== ''
            })

            // 整理当前的按钮/权限列表以及对应的接口列表
            const permissionList = _.cloneDeep(this.form.permissionList)
            // 整理所有按钮/权限列表的可用接口列表，并设置菜单的id为当前的parentId
            permissionList.forEach(permission => {
              permission.apiSetList = permission.apiSetList.filter(api => {
                return api !== undefined && api !== ''
              })
              if (this.form && this.form.id) {
                permission.parentId = this.form.id
              }
            })

            // 合并参数
            this.form.displayType = 'MENU'

            resolve(this.form)
          } else {
            reject('数据校验未通过')
          }
          setTimeout(() => {
            this.state.confirmSubmit = false
          }, 600)
        })
      })
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        this.addNewPermission()
      } else if (action === 'remove') {
        this.removePermission(targetName)
      }
    },
    addNewPermission() {
      const newPermission = _.cloneDeep(NEW_PERMISSION_ITEM)
      this.form.permissionList.push(newPermission)
      this.currentPermissionActiveKey = `${this.form.permissionList.length - 1}`
      // 自动补全编码选项
      if (this.more && this.more.frontendPermissionCodeKvList) {
        const validKv = this.more.frontendPermissionCodeKvList.find(kv => {
          return !this.existPermissionCodes.includes(kv.v)
        })
        newPermission.frontendCode = validKv.v
        this.changePermissionName(newPermission, validKv.v)
      }
    },
    removePermission(index) {
      const idx = parseInt(index, 10)
      const currentKey = parseInt(this.currentPermissionActiveKey, 10)
      this.form.permissionList.splice(idx, 1)
      this.currentPermissionActiveKey = currentKey > 0 ? `${currentKey - 1}` : '0'
    },
    changePermissionName(permission, value) {
      const validKv = this.more.frontendPermissionCodeKvList.find(item => {
        return item.v === value
      })
      // 自动补全按钮/权限名称
      if (validKv !== undefined) {
        permission.displayName = validKv['k']
      }
      // 自动补全接口列表
      permission.apiSetList = []
      if (this.form.apiSetList.length === 0 || !value) {
        return false
      }
      const matchStrList = this.form.apiSetList[0].match(/\/(\S*)\//)
      if (!matchStrList || matchStrList.length < 2) {
        return false
      }
      const matchStr = matchStrList[0]
      let uri
      if (value === 'detail') {
        uri = `GET:${matchStr}{`
      } else if (value === 'create') {
        uri = `POST:${matchStr}`
      } else if (value === 'update') {
        uri = `PUT:${matchStr}{`
      } else if (value === 'delete') {
        uri = `DELETE:${matchStr}{`
      } else if (value === 'export') {
        uri = `POST:${matchStr}export`
      } else if (value === 'import') {
        uri = `POST:${matchStr}import`
      }
      if (!uri) {
        return false
      }
      const matchApi = this.apiList.find(api => {
        return api.value && api.value.includes(uri)
      })
      if (matchApi === undefined) {
        return false
      }
      permission.apiSetList.push(matchApi.value)
    },
    async checkCodeDuplicate(rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.form.id, code: value }
      const res = await dibootApi.get(`${this.baseApi}/checkCodeDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
    },
    afterClose() {
      this.apiTreeList = []
      this.currentMenu = ''
      this.currentPermissionActiveKey = '0'
      this.more = {}
    }
  }
}
</script>
<style>
  .frontend-permission-form .el-tabs__new-tab {
    margin-right: 10px;
  }
</style>

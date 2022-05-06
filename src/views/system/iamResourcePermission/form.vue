<template>
  <el-dialog
    width="70%"
    :visible.sync="state.visible"
    :fullscreen="fullscreen"
    class="frontend-permission-form"
    :custom-class="!fullscreen ? 'custom-height': 'custom-fullscreen'"
    :show-close="false"
  >
    <el-row slot="title" type="flex">
      <el-col :span="20">{{ title }}</el-col>
      <el-col :span="4" style="text-align: right">
        <svg-icon
          :icon-class="!fullscreen ? 'fullscreen': 'exit-fullscreen'"
          style="cursor: pointer; margin-right: 10px"
          @click="() => {fullscreen = !fullscreen}"
        />
        <i class="el-icon-close" style="cursor: pointer" @click="close" />
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col class="transition-width" :span="showPermission ? 12 : 24">
        <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="120px">
          <el-form-item label="上级菜单" prop="parentId">
            <el-select v-model="form.parentId" filterable placeholder="请选择上级菜单">
              <el-option
                v-for="item in menuDataList(form.id)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="displayName">
            <div slot="label" style="display: inline-block;">
              <span>菜单名称</span>
              <el-popover
                placement="bottom"
              >
                <el-select
                  v-model="currentMenu"
                  filterable
                  placeholder="请选取菜单"
                  @change="onMenuNameChange"
                >
                  <el-option
                    v-for="item in routerList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <a slot="reference" style="color: #20a0ff; cursor: pointer">选择</a>
              </el-popover>
            </div>
            <el-input v-model="form.displayName" placeholder="请输入菜单名称" />
          </el-form-item>
          <el-form-item label="菜单编码" prop="resourceCode">
            <el-input v-model="form.resourceCode" placeholder="请输入菜单编码" />
          </el-form-item>
          <el-form-item class="api-container" label="菜单权限接口" prop="permissionCodes">
            <div class="permission-tag-container">
              <template v-if="form.permissionCodes && form.permissionCodes.length > 0">
                <el-tag
                  v-for="(permissionCode, index) in form.permissionCodes"
                  :key="`menu_${index}`"
                  style="margin-bottom: 3px"
                  type="success"
                  closable
                  @close.stop.prevent="handleRemovePermissionCode(permissionCode)"
                >{{ permissionCode }}</el-tag>
              </template>
              <template v-else>
                <span style="color: #d3d3d3">请点击右侧"配置"按钮选择权限接口</span>
              </template>
            </div>
            <el-button style="align-self: flex-start;" size="mini" type="primary" @click="goPermissionConfig('Menu')">配置</el-button>
          </el-form-item>
          <el-form-item label="按钮权限接口">
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
                <el-form-item label="按钮权限编码" class="tab-form-item">
                  <el-row type="flex" align="middle" :gutter="16">
                    <el-col :span="16">
                      <el-select
                        v-if="isSelect"
                        v-model="permission.resourceCode"
                        filterable
                        allow-create
                        placeholder="请选取当前按钮权限编码"
                        @change="value => changeResourceCode(permission, value)"
                      >
                        <el-option
                          v-for="(item, i) in more.resourcePermissionCodeOptions"
                          :key="`frontend-code_${_uid}_${i}`"
                          :label="`${item.label}[${item.value}]`"
                          :value="item.value"
                        />
                      </el-select>
                      <el-input v-else v-model="permission.resourceCode" placeholder="请输入按钮权限编码" @input="value => changeResourceCode(permission, value)" />
                    </el-col>
                    <el-col :span="8">
                      <el-button type="primary" icon="swap" size="small" @click="handleSwap(permission, index)">
                        {{ isSelect ? '自定义输入' : '从字典选取' }}
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="按钮权限名称" class="tab-form-item">
                  <el-input v-model="permission.displayName" placeholder="请输入按钮权限名称" @input="value => changePermissionConfig(permission, value)" />
                </el-form-item>
                <el-form-item label="按钮权限接口" prop="permissionCodes" class="tab-form-item api-container">
                  <div class="permission-tag-container">
                    <template v-if="permission.permissionCodes && permission.permissionCodes.length > 0">
                      <el-tag
                        v-for="(permissionCode, i) in permission.permissionCodes"
                        :key="`permission_${i}`"
                        style="margin-bottom: 3px"
                        type="success"
                        closable
                        @close.stop.prevent="handleRemovePermissionCode(permissionCode, permission)"
                      >{{ permissionCode }}</el-tag>
                    </template>
                    <template v-else>
                      <span style="color: #d3d3d3">请点击右侧"配置按钮"选择权限接口</span>
                    </template>
                  </div>
                  <el-button style="align-self: flex-start;" size="mini" type="primary" @click="goPermissionConfig('Permission')">配置</el-button>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="transition-width" :span="showPermission ? 12 : 0">
        <permission-list
          ref="permissionList"
          :title="currentPermissionTitle"
          :current-permission-codes="currentPermissionCodes"
          :config-code="currentConfigCode"
          :menu-resource-code="form.resourceCode"
          :origin-api-list="originApiList"
          @changePermissionCodes="handleChangePermissionCodes"
        />
      </el-col>
    </el-row>
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
import { routersFormatter, treeListFormatter, treeList2IndentList } from '@/utils/treeDataUtil'
import PermissionList from '@/views/system/iamResourcePermission/permissionList'

const NEW_PERMISSION_ITEM = {
  id: undefined,
  parentId: '',
  displayType: 'PERMISSION',
  displayName: '新按钮权限',
  resourceCode: '',
  permissionCodes: []
}
export default {
  name: 'IamResourcePermissionForm',
  components: { PermissionList },
  mixins: [form],
  props: {
    initParentId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      baseApi: '/iam/resourcePermission',
      getMore: true,
      attachMoreList: [
        {
          target: 'RESOURCE_PERMISSION_CODE'
        }
      ],
      permissionCodes: [],
      currentMenu: '',
      currentPermissionActiveKey: '0',
      initFormData: {
        parentId: '0',
        displayName: '',
        resourceCode: '',
        permissionCodes: [],
        permissionList: []
      },
      rules: {
        'parentId': [{ required: true, message: '上级菜单不能为空', trigger: 'blur' }],
        'displayName': [{ required: true, message: '菜单名称不能为空', trigger: 'change' }],
        'resourceCode': [
          { required: true, message: '菜单编码不能为空', trigger: 'blur' },
          { validator: this.checkCodeDuplicate, trigger: 'blur' }
        ]
      },
      isSelect: true,
      originApiList: [],
      currentPermissionTitle: '菜单页面接口配置',
      currentConfigCode: '',
      currentPermissionCodes: [],
      showPermission: false
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
      if (this.more && this.more.menuTree) {
        menuTreeData = treeListFormatter(this.more.menuTree, 'id', 'displayName', true)
      }
      menuTreeData.splice(0, 0, { key: '0', value: '0', label: '顶级菜单' })
      return menuTreeData
    },
    existPermissionCodes: function() {
      if (!this.form.permissionList) {
        return []
      }
      return this.form.permissionList.map(item => {
        return item.resourceCode
      })
    }
  },
  watch: {
    'state.visible'(v) {
      if (!v) {
        this.$emit('close')
      }
    },
    currentPermissionActiveKey(val) {
      this.changePermissionConfig(this.form.permissionList[val])
    }
  },
  methods: {
    async afterOpen(id) {
      this.attachMore()
      if (id) {
        this.form.parentId = `${this.form.parentId}`
        this.currentPermissionCodes = this.form.permissionCodes
        this.form.permissionList.forEach(item => {
          if (!item.permissionCodes || item.permissionCodes.length === 0) {
            item.permissionCodes = []
          }
        })
      }
      dibootApi.get(`${this.baseApi}/apiList`).then(res => {
        if (res.code === 0) {
          this.originApiList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      // 如果具有初始化initParentId参数，则设置该参数
      if (this.initParentId) {
        this.form.parentId = this.initParentId
      }
    },
    menuDataList(id) {
      if (this.menuTreeData.length === 0) {
        return []
      }
      let list = treeList2IndentList(_.cloneDeep(this.menuTreeData), 0)
      if (id == null) {
        return list
      }
      // 过滤当前菜单及children
      const findChildrenIds = e => {
        const arr = [e.key]
        if (e.children != null && e.children.length > 0) {
          e.children.filter(e => {
            arr.push(...findChildrenIds(e))
          })
        }
        return arr
      }
      const item = list.find(e => e.key === id)
      if (item != null) {
        const ids = [id]
        ids.push(...findChildrenIds(item))
        list = list.filter(e => !ids.includes(e.key))
      }
      return list
    },
    onMenuNameChange(value) {
      if (this.routerList || this.routerList.length > 0) {
        const currentMenu = this.routerList.find(item => {
          return item.value === value
        })
        if (currentMenu == null) {
          return false
        }
        // 自动设置菜单名称与菜单编码
        this.form.resourceCode = currentMenu.value
        // eslint-disable-next-line no-irregular-whitespace
        this.form.displayName = currentMenu.label ? currentMenu.label.replace(/　/g, '') : ''
        // 重置接口权限
        this.form.permissionCodes = []
        this.form.permissionList = []
        this.currentPermissionCodes = []
        this.currentConfigCode = 'Menu'
        this.$refs.permissionList.goScrollIntoView(this.$refs.permissionList.getAnchor())
      }
    },

    /** *
     * 提交前的验证流程
     * @returns {Promise<any>}
     */
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs['dataForm'].validate((valid, values) => {
          console.log(this.form)
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
                if (!permission.resourceCode) {
                  nullFrontendCodeIdxList.push(i + 1)
                }
              })
              // 收集验证错误信息
              if (notChangePerIdxList.length > 0) {
                errMsgs.push(`第 ${notChangePerIdxList.join('、')} 个按钮权限的名称没有更改`)
              }
              if (nullDisplayNameIdxList.length > 0) {
                errMsgs.push(`第 ${nullDisplayNameIdxList.join('、')} 个按钮权限的名称没有填写`)
              }
              if (nullFrontendCodeIdxList.length > 0) {
                errMsgs.push(`第 ${nullFrontendCodeIdxList.join('、')} 个按钮权限的编码没有填写`)
              }
            }
            if (errMsgs.length > 0) {
              const msg = errMsgs.join('；') + '。'
              this.$message.error(msg)
              reject(msg)
            }

            // 获取当前菜单的有效的code
            if (this.form.permissionCodes && this.form.permissionCodes.length > 0) {
              this.form.permissionCodes = this.form.permissionCodes.filter(permissionCode => {
                return permissionCode != null && permissionCode !== ''
              })
            }

            // 整理当前的按钮/权限列表以及对应的接口列表
            const permissionList = _.cloneDeep(this.form.permissionList)
            // 整理所有按钮/权限列表的可用接口列表，并设置菜单的id为当前的parentId
            permissionList.forEach(permission => {
              permission.permissionCodes = permission.permissionCodes.filter(permissionCode => {
                return permissionCode != null && permissionCode !== ''
              })
              if (this.form && this.form.id) {
                permission.parentId = this.form.id
              }
            })

            // 合并参数
            this.form.displayType = 'MENU'
            console.log(this.form)
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
      if (this.more && this.more.resourcePermissionCodeOptions) {
        const validOption = this.more.resourcePermissionCodeOptions.find(item => {
          return !this.existPermissionCodes.includes(item.value)
        })
        newPermission.resourceCode = validOption.value
        this.changeResourceCode(newPermission, validOption.value)
      }
    },
    removePermission(index) {
      const idx = parseInt(index, 10)
      const currentKey = parseInt(this.currentPermissionActiveKey, 10)
      this.form.permissionList.splice(idx, 1)
      this.currentPermissionActiveKey = currentKey > 0 ? `${currentKey - 1}` : '0'
      this.changePermissionConfig(this.form.permissionList[this.currentPermissionActiveKey])
    },
    /**
     * 删除配置的权限
     * @param permissionCode 被删除的权限code
     * @param permission 如果是按钮权限会传入当前按钮的权限所有配置，不传入表示删除的是菜单权限
     */
    handleRemovePermissionCode(permissionCode, permission) {
      if (!permission) {
        this.$set(this.form, 'permissionCodes', this.form.permissionCodes.filter(item => item !== permissionCode))
      } else {
        permission.permissionCodes = permission.permissionCodes.filter(item => item !== permissionCode)
      }
      // 重置权限配置
      this.goPermissionConfig(permission ? 'Permission' : 'Menu')
    },
    goPermissionConfig(configCode) {
      if (!this.showPermission) {
        this.$refs.permissionList.initFuse()
      }
      this.showPermission = true
      configCode === 'Menu' ? this.change2MenuPermissionConfig()
        : this.changePermissionConfig(this.form.permissionList[this.currentPermissionActiveKey])
    },
    changeResourceCode(permission, value) {
      const validOption = this.more.resourcePermissionCodeOptions.find(item => {
        return item.value === value
      })
      // 自动补全按钮/权限名称
      if (validOption != null) {
        permission.displayName = validOption.label
      }
      // 重新设置接口配置
      this.changePermissionConfig(permission, permission.displayName || value)
    },
    /**
     * 重置权限配置名称
     * @param permission
     * @param value
     */
    changePermissionConfig(permission, value) {
      this.currentPermissionTitle = `${value || permission.displayName || permission.resourceCode} 按钮权限接口配置`
      this.currentConfigCode = permission.resourceCode
      this.currentPermissionCodes = permission.permissionCodes
    },
    /**
     * 重置权限配置名称
     * @param permission
     * @param value
     */
    change2MenuPermissionConfig() {
      this.currentPermissionTitle = '菜单页面接口配置'
      this.currentConfigCode = 'Menu'
      this.currentPermissionCodes = this.form.permissionCodes
      if (!this.permissionCodes || this.permissionCodes.length === 0) {
        this.$refs.permissionList.goScrollIntoView(this.$refs.permissionList.getAnchor())
      }
    },
    /**
     * 更改值，tag回显位置跟着调整
     * @param isMenu
     */
    handleChangePermissionCodes(permissionCodes) {
      if (this.currentConfigCode === 'Menu') {
        this.$set(this.form, 'permissionCodes', permissionCodes)
      } else {
        const permission = this.form.permissionList[this.currentPermissionActiveKey]
        permission['permissionCodes'] = permissionCodes
        this.$set(this.form.permissionList, this.currentPermissionActiveKey, permission)
      }
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
    handleSwap(permission, index) {
      this.isSelect = !this.isSelect
      permission.resourceCode = ''
      permission.displayName = ''
      this.$set(this.form.permissionList, index, permission)
    },
    afterClose() {
      this.permissionCodes = []
      this.currentMenu = ''
      this.currentPermissionActiveKey = '0'
      this.more = {}
      this.currentPermissionTitle = '菜单页面接口配置'
      this.currentConfigCode = ''
      this.currentPermissionCodes = []
      this.showPermission = false
      this.$refs.permissionList.handleSearchChange()
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  .frontend-permission-form .el-tabs__new-tab {
    margin-right: 10px;
  }
  .tab-form-item {
    margin-bottom: 10px !important;
  }
  .transition-width {
    transition: width 0.3s;
  }
  .api-container {
    .el-form-item__content {
      display: flex;
    }
  }
  .permission-tag-container {
    width: 100%;
    border: 1px dashed #d9d9d9;
    padding: 5px;
    margin: 0 2px;
    min-height: 32px
  }

</style>

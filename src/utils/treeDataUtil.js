import _ from 'lodash'
/** *
 * 将不标准的树结构数据转化为组件能够使用的标准结构
 * @param treeList
 * @param valueField
 * @param titleField
 * @param toString
 * @returns {[]|undefined}
 */
const treeListFormatter = function(treeList, valueField, titleField, toString) {
  if (treeList === undefined || treeList.length === 0) {
    return undefined
  }

  const formatterList = []
  treeList.forEach(item => {
    let formatterItem = {}
    if (toString) {
      formatterItem = {
        key: `${item[valueField]}`,
        value: `${item[valueField]}`,
        label: item[titleField]
      }
    } else {
      formatterItem = {
        key: item[valueField],
        value: item[valueField],
        label: item[titleField]
      }
    }
    if (item.children !== undefined && item.children.length > 0) {
      formatterItem.children = treeListFormatter(item.children, valueField, titleField, toString)
    }
    formatterList.push(formatterItem)
  })

  return formatterList
}

const listPageTreeFormatter = function(treeList) {
  if (treeList === undefined || treeList.length === 0) {
    return undefined
  }
  treeList.forEach(item => {
    if (item.children && item.children.length > 0) {
      item._children = _.cloneDeep(listPageTreeFormatter(item.children))
      delete item.children
    }
  })
  return treeList
}

/** *
 * 清除空的children，赋值为undefined
 * @param treeList
 */
const clearNullChildren = function(treeList) {
  if (treeList === undefined || treeList.length === 0) {
    return undefined
  }
  treeList.forEach(item => {
    item.children = clearNullChildren(item.children)
  })
  return treeList
}

/**
 * 树型列表转普通列表
 * @param treeList
 * @returns {[]|*[]}
 */
const treeList2list = function(treeList) {
  if (treeList === undefined || treeList.length === 0) {
    return []
  }
  const allList = []
  treeList.forEach(item => {
    if (item.children !== undefined && item.children.length > 0) {
      allList.push(...treeList2list(item.children))
      delete item.children
    }
  })
  allList.push(...treeList)
  return allList
}

const treeList2IndentList = function(treeList, level) {
  if (treeList === undefined || treeList.length === 0) {
    return []
  }
  level = level === undefined ? 0 : level
  const allList = []
  let prefix = ''
  for (let i = 0; i < level; i++) {
    prefix += '　'
  }
  treeList.forEach(item => {
    item.label = prefix + item.label
    allList.push(item)
    if (item.children !== undefined && item.children.length > 0) {
      allList.push(...treeList2IndentList(item.children, (level + 1)))
      delete item.childre
    }
  })
  return allList
}

/**
 * 树形列表转子列表map
 * @param list
 * @returns {{}}
 */
const list2childrenMap = function(list) {
  const childrenMap = {}
  if (list === undefined || list.length === 0) {
    return childrenMap
  }
  list.forEach(item => {
    let children = childrenMap[item.parentId]
    if (children === undefined) {
      children = []
      childrenMap[item.parentId] = children
    }
    children.push(item)
  })
  return childrenMap
}

/**
 * 路由配置格式化
 * @param routers
 * @returns {[]|undefined}
 */
const routersFormatter = function(routers) {
  if (routers === undefined || routers.length === 0) {
    return undefined
  }

  const formatterList = []
  routers.forEach(item => {
    if (item.meta) {
      const code = item.meta.permission && item.meta.permission.length > 0 ? item.meta.permission[0] : item.name
      const formatterItem = {
        key: code,
        value: code,
        label: `${item.meta.title}`
      }
      if (item.children !== undefined && item.children.length > 0) {
        formatterItem.children = routersFormatter(item.children)
      }
      formatterList.push(formatterItem)
    }
  })
  return formatterList
}

const apiListFormatter = function(apiList) {
  if (apiList === undefined || apiList.length === 0) {
    return undefined
  }

  const formatterList = []
  apiList.forEach(item => {
    let children
    if (item.children) {
      children = item.children.map(child => {
        return {
          key: child.value,
          value: child.value,
          label: `[${item.classTitle}-${child.apiName}][${child.apiMethod}](${child.apiUri})`
        }
      })
    }
    formatterList.push({
      key: item.classTitle,
      value: '',
      label: item.classTitle,
      children,
      disabled: true
    })
  })
  return formatterList
}

/** *
 * 权限树状结构转化（用于角色权限配置中）
 * @param treeList
 * @param valueField
 * @param titleField
 * @returns {[]|undefined}
 */
const permissionTreeListFormatter = function(treeList, valueField, titleField) {
  if (treeList === undefined || treeList.length === 0) {
    return undefined
  }

  const formatterList = []
  treeList.forEach(item => {
    const slots = {
      icon: item.displayType === 'MENU' ? 'menu' : 'permission'
    }
    const formatterItem = {
      slots,
      type: item.displayType,
      parentId: item.parentId,
      id: item.id,
      sortId: item.sortId,
      key: item[valueField],
      value: item[valueField],
      label: item[titleField]
    }
    if (item.children !== undefined && item.children.length > 0) {
      formatterItem.children = permissionTreeListFormatter(item.children, valueField, titleField)
    }
    formatterList.push(formatterItem)
  })

  return formatterList
}

/** *
 * 排序树状结构格式化
 * @param treeList
 * @param valueField
 * @param titleField
 * @returns {undefined}
 */
const sortTreeListFormatter = function(treeList, valueField, titleField) {
  if (treeList === undefined || treeList.length === 0) {
    return undefined
  }

  const formatterList = []
  treeList.forEach(item => {
    const formatterItem = {
      type: item.displayType,
      parentId: item.parentId,
      id: item.id,
      sortId: item.sortId,
      key: item[valueField],
      value: item[valueField],
      title: item[titleField]
    }
    if (item.children !== undefined && item.children.length > 0) {
      formatterItem.children = sortTreeListFormatter(item.children, valueField, titleField)
    }
    formatterList.push(formatterItem)
  })

  return formatterList
}

export {
  treeListFormatter,
  listPageTreeFormatter,
  clearNullChildren,
  treeList2list,
  treeList2IndentList,
  list2childrenMap,
  routersFormatter,
  apiListFormatter,
  permissionTreeListFormatter,
  sortTreeListFormatter
}

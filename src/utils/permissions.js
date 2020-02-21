/**
 * 将后端的permissionList转为permissions
 * @param permissionList
 */
export function permissionListToPermissions(permissionList) {
  if (!permissionList || permissionList.length === 0) {
    return permissionList
  }

  const permissions = []
  const actionListMap = {}
  permissionList.forEach(per => {
    // 将不重复code的permission添加到permissions中
    const duplicatePermissions = permissions.filter(p => {
      return p.code === per.code
    })
    if (duplicatePermissions.length === 0) {
      permissions.push(per)
    }
    // 整理actionList到code的map中
    let actionList = actionListMap[per.code]
    if (actionList === undefined) {
      actionList = []
      actionListMap[per.code] = actionList
    }
    if (per.operationCode) {
      const oprationCode = per.operationCode
      let action = ''
      if (oprationCode) {
        const codes = oprationCode.split(':')
        if (codes.length === 2) {
          action = codes[1]
        }
      }
      actionList.push({
        action,
        describe: per.operationName,
        defaultCheck: false
      })
    }
  })

  // 对于每个不重复的permission设置actionList
  permissions.map(per => {
    per.permissionId = per.code
    per.permissionName = per.name
    per.actionEntitySet = actionListMap[per.code]
    per.actionList = actionListMap[per.code].map(item => {
      return item.action
    })
  })

  return permissions
}

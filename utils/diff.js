/**
 * 数据差分更新工具
 * 用于比对新旧数据，只更新变化的字段，避免页面闪烁
 */

/**
 * 深度比较两个值是否相等
 * @param {*} a - 第一个值
 * @param {*} b - 第二个值
 * @returns {boolean}
 */
function isEqual(a, b) {
  if (a === b) return true
  if (a === null || b === null) return false
  if (typeof a !== typeof b) return false

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false
    }
    return true
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    for (const key of keysA) {
      if (!isEqual(a[key], b[key])) return false
    }
    return true
  }

  return false
}

/**
 * 比对新旧数据，返回变化的字段路径和值
 * @param {Object} oldData - 旧数据
 * @param {Object} newData - 新数据
 * @param {string} prefix - 路径前缀（递归用）
 * @returns {Object} 变化的字段 { 'path.to.field': newValue }
 */
function diff(oldData, newData, prefix = '') {
  const changes = {}

  // 处理新数据中的字段
  for (const key in newData) {
    const path = prefix ? `${prefix}.${key}` : key
    const oldVal = oldData ? oldData[key] : undefined
    const newVal = newData[key]

    if (oldVal === undefined) {
      // 新增字段
      changes[path] = newVal
    } else if (Array.isArray(newVal)) {
      // 数组处理
      if (!Array.isArray(oldVal) || oldVal.length !== newVal.length) {
        // 长度不同，整体替换
        changes[path] = newVal
      } else {
        // 长度相同，逐项比对
        for (let i = 0; i < newVal.length; i++) {
          if (typeof newVal[i] === 'object' && newVal[i] !== null) {
            const itemChanges = diff(oldVal[i], newVal[i], `${path}[${i}]`)
            Object.assign(changes, itemChanges)
          } else if (!isEqual(oldVal[i], newVal[i])) {
            changes[`${path}[${i}]`] = newVal[i]
          }
        }
      }
    } else if (typeof newVal === 'object' && newVal !== null) {
      // 对象递归处理
      if (typeof oldVal !== 'object' || oldVal === null) {
        changes[path] = newVal
      } else {
        const nestedChanges = diff(oldVal, newVal, path)
        Object.assign(changes, nestedChanges)
      }
    } else if (!isEqual(oldVal, newVal)) {
      // 基本类型比对
      changes[path] = newVal
    }
  }

  return changes
}

/**
 * 智能更新页面数据，只更新变化的部分
 * @param {Object} page - 页面实例
 * @param {Object} newData - 新数据
 * @param {Function} callback - 更新完成回调
 */
function diffSetData(page, newData, callback) {
  const oldData = page.data
  const changes = diff(oldData, newData)

  if (Object.keys(changes).length > 0) {
    page.setData(changes, callback)
  } else if (callback) {
    callback()
  }
}

module.exports = {
  isEqual,
  diff,
  diffSetData
}

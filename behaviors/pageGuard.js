/**
 * 页面守卫 Behavior
 *
 * 功能：
 * 1. 定时器安全管理（页面切换时自动清理）
 * 2. 页面状态追踪（活跃、数据就绪）
 * 3. 错误处理策略（goBack、showRetry、finishProgress）
 * 4. 防重复点击/导航
 *
 * 使用方式：
 * const pageGuard = require('../../behaviors/pageGuard')
 *
 * Page({
 *   behaviors: [pageGuard.behavior],
 *
 *   loadData() {
 *     api.request(...).then(() => {
 *       this.setDataReady()
 *     }).catch(() => {
 *       pageGuard.goBack(this)
 *     })
 *   },
 *
 *   onButtonTap() {
 *     this.navigateTo('/pages/xxx/index')
 *   }
 * })
 */

// ============================================================
// 全局状态
// ============================================================

const pageTimers = new WeakMap()
let isNavigating = false
let navigatingTimer = null

// ============================================================
// 定时器管理（内部）
// ============================================================

function _registerTimer(page, name, callback, delay) {
  if (!pageTimers.has(page)) {
    pageTimers.set(page, new Map())
  }
  const timers = pageTimers.get(page)

  if (timers.has(name)) {
    clearTimeout(timers.get(name))
  }

  const timerId = setTimeout(() => {
    timers.delete(name)
    if (page.data._isPageActive) {
      callback()
    }
  }, delay)

  timers.set(name, timerId)
  return timerId
}

function _clearPageTimers(page) {
  const timers = pageTimers.get(page)
  if (timers) {
    timers.forEach(id => clearTimeout(id))
    timers.clear()
  }
}

// ============================================================
// 导航锁管理（内部）
// ============================================================

function _lockNavigation(duration = 1500) {
  isNavigating = true
  if (navigatingTimer) {
    clearTimeout(navigatingTimer)
  }
  navigatingTimer = setTimeout(() => {
    isNavigating = false
  }, duration)
}

function _unlockNavigation() {
  isNavigating = false
  if (navigatingTimer) {
    clearTimeout(navigatingTimer)
    navigatingTimer = null
  }
}

// ============================================================
// 错误处理工具函数（静态方法）
// ============================================================

function _finishAllLoading(page) {
  if (page.finishLoading) page.finishLoading()
  if (page.finishAudioLoading) page.finishAudioLoading()
}

/**
 * 策略A：退回上一级
 * 适用场景：详情页、子页面初始化加载失败
 * @param {Object} page - 页面实例
 */
function goBack(page) {
  _finishAllLoading(page)

  if (page.registerTimer) {
    page.registerTimer('__goBack', () => wx.navigateBack(), 1500)
  } else {
    // 降级处理：兼容未使用 pageGuard 的页面
    setTimeout(() => {
      const pages = getCurrentPages()
      if (pages[pages.length - 1] === page) {
        wx.navigateBack()
      }
    }, 1500)
  }
}

/**
 * 策略B：显示重试按钮
 * 适用场景：首页、列表页初始化加载失败
 * @param {Object} page - 页面实例
 */
function showRetry(page) {
  _finishAllLoading(page)
  if (page.showLoadError) {
    page.showLoadError()
  } else {
    page.setData({ loadError: true })
  }
}

/**
 * 策略E：仅结束进度
 * 适用场景：非关键数据加载失败
 * @param {Object} page - 页面实例
 */
function finishProgress(page) {
  _finishAllLoading(page)
}

/**
 * 检查是否正在导航中
 * @returns {boolean}
 */
function checkIsNavigating() {
  return isNavigating
}

// ============================================================
// Behavior 定义
// ============================================================

const behavior = Behavior({
  data: {
    _isPageActive: true,
    _isDataReady: false
  },

  pageLifetimes: {
    show() {
      this.setData({ _isPageActive: true })
      _unlockNavigation()
    },
    hide() {
      this.setData({ _isPageActive: false })
      _clearPageTimers(this)
    }
  },

  lifetimes: {
    detached() {
      _clearPageTimers(this)
    }
  },

  methods: {
    // ==================== 定时器管理 ====================

    /**
     * 注册安全定时器（页面隐藏时自动取消）
     * @param {string} name - 定时器名称
     * @param {Function} callback - 回调函数
     * @param {number} delay - 延迟毫秒数
     */
    registerTimer(name, callback, delay) {
      return _registerTimer(this, name, callback, delay)
    },

    /**
     * 取消指定定时器
     * @param {string} name - 定时器名称
     */
    cancelTimer(name) {
      const timers = pageTimers.get(this)
      if (timers && timers.has(name)) {
        clearTimeout(timers.get(name))
        timers.delete(name)
      }
    },

    // ==================== 数据状态管理 ====================

    /**
     * 标记数据已就绪
     */
    setDataReady() {
      this.setData({ _isDataReady: true })
    },

    /**
     * 检查数据是否就绪
     * @returns {boolean}
     */
    isDataReady() {
      return this.data._isDataReady
    },

    // ==================== 安全导航（防重复点击） ====================

    /**
     * 安全导航到新页面
     * @param {string} url - 页面路径
     * @param {object} options - 配置项
     * @param {boolean} options.checkReady - 是否检查数据就绪，默认 true
     * @param {string} options.loadingMsg - 数据未就绪时的提示
     * @returns {boolean} 是否成功发起导航
     */
    navigateTo(url, options = {}) {
      if (isNavigating) return false

      if (options.checkReady !== false && !this.data._isDataReady) {
        wx.showToast({ title: options.loadingMsg || '数据加载中...', icon: 'none' })
        return false
      }

      _lockNavigation()
      wx.navigateTo({
        url,
        fail: () => _unlockNavigation()
      })
      return true
    },

    /**
     * 安全重定向
     * @param {string} url - 页面路径
     * @returns {boolean}
     */
    redirectTo(url) {
      if (isNavigating) return false
      _lockNavigation()
      wx.redirectTo({
        url,
        fail: () => _unlockNavigation()
      })
      return true
    },

    /**
     * 安全返回
     * @param {number} delta - 返回层数，默认 1
     * @returns {boolean}
     */
    navigateBack(delta = 1) {
      if (isNavigating) return false
      _lockNavigation()
      wx.navigateBack({
        delta,
        fail: () => _unlockNavigation()
      })
      return true
    },

    /**
     * 安全切换 Tab
     * @param {string} url - Tab 页面路径
     * @returns {boolean}
     */
    switchTab(url) {
      if (isNavigating) return false
      _lockNavigation()
      wx.switchTab({
        url,
        fail: () => _unlockNavigation()
      })
      return true
    },

    // ==================== 防重复操作 ====================

    /**
     * 节流操作（同一操作在指定时间内只执行一次）
     * @param {string} name - 操作名称
     * @param {Function} fn - 要执行的函数
     * @param {number} delay - 节流时间（毫秒），默认 1000
     * @returns {boolean} 是否成功执行
     */
    throttleAction(name, fn, delay = 1000) {
      const key = `_throttle_${name}`
      if (this[key]) return false

      this[key] = true
      this.registerTimer(`__throttle_${name}`, () => {
        this[key] = false
      }, delay)

      fn()
      return true
    }
  }
})

// ============================================================
// 导出（使用包装对象避免修改 Behavior 返回值）
// ============================================================

module.exports = {
  // Behavior 本身（用于 behaviors 数组）
  behavior: behavior,
  // 静态方法
  goBack: goBack,
  showRetry: showRetry,
  finishProgress: finishProgress,
  isNavigating: checkIsNavigating
}

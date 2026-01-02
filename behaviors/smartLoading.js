/**
 * 智能加载 Behavior
 *
 * 功能：
 * 1. 区分首次加载、子页面返回、后台返回三种场景
 * 2. 首次加载：显示 loading 和骨架屏
 * 3. 子页面返回：静默刷新（无 loading）
 * 4. 后台返回：不刷新
 *
 * 使用方式：
 * const smartLoading = require('../../behaviors/smartLoading')
 *
 * Page({
 *   behaviors: [smartLoading],
 *
 *   onShowLogin() {
 *     if (this.shouldLoad()) {
 *       this.loadData()
 *     }
 *   },
 *
 *   loadData() {
 *     const isSilent = this.shouldSilentRefresh()
 *     if (!isSilent) this.startLoading()
 *
 *     api.request(...).then(res => {
 *       this.diffSetData({ list: res.list })
 *       this.markLoaded()
 *       if (!isSilent) this.finishLoading()
 *     })
 *   }
 * })
 *
 * // 子页面操作后通知父页面刷新
 * this.notifyParentRefresh()
 */

const { diffSetData } = require('../utils/diff')

// 缓存过期时间（毫秒）
const CACHE_EXPIRE_TIME = 5 * 60 * 1000 // 5分钟

module.exports = Behavior({
  data: {
    _hasLoaded: false,      // 是否已完成首次加载
    _needRefresh: false,    // 是否需要刷新（子页面标记）
    _lastLoadTime: 0        // 上次加载时间戳
  },

  methods: {
    /**
     * 判断是否需要加载数据
     * @param {Object} options - 配置项
     * @param {number} options.cacheTime - 缓存有效期（毫秒），默认5分钟
     * @param {boolean} options.force - 是否强制刷新
     * @returns {boolean}
     */
    shouldLoad(options = {}) {
      const { cacheTime = CACHE_EXPIRE_TIME, force = false } = options

      // 强制刷新
      if (force) return true

      // 首次加载
      if (!this.data._hasLoaded) return true

      // 子页面标记需要刷新
      if (this.data._needRefresh) return true

      // 从后台返回，不刷新
      if (this.isFromBackground()) return false

      // 从图片预览返回，不刷新
      if (this.isFromImagePreview()) return false

      // 缓存过期检查
      const now = Date.now()
      if (now - this.data._lastLoadTime > cacheTime) return true

      return false
    },

    /**
     * 判断是否应该静默刷新（无 loading）
     * @returns {boolean}
     */
    shouldSilentRefresh() {
      // 首次加载不静默
      if (!this.data._hasLoaded) return false

      // 子页面返回刷新时静默
      if (this.data._needRefresh) return true

      // 缓存过期刷新时静默
      return this.data._hasLoaded
    },

    /**
     * 标记数据加载完成
     */
    markLoaded() {
      this.setData({
        _hasLoaded: true,
        _needRefresh: false,
        _lastLoadTime: Date.now()
      })
    },

    /**
     * 标记需要刷新（子页面调用）
     */
    markNeedRefresh() {
      this.setData({ _needRefresh: true })
    },

    /**
     * 通知父页面需要刷新
     * @param {number} levels - 向上通知的层级数，默认1
     */
    notifyParentRefresh(levels = 1) {
      const pages = getCurrentPages()
      const currentIndex = pages.length - 1

      for (let i = 1; i <= levels && currentIndex - i >= 0; i++) {
        const parentPage = pages[currentIndex - i]
        if (parentPage && parentPage.markNeedRefresh) {
          parentPage.markNeedRefresh()
        }
      }
    },

    /**
     * 重置加载状态
     */
    resetLoadState() {
      this.setData({
        _hasLoaded: false,
        _needRefresh: false,
        _lastLoadTime: 0
      })
    },

    /**
     * 判断是否从后台返回
     * @returns {boolean}
     */
    isFromBackground() {
      const app = getApp()
      if (app && app._fromBackground) {
        // 重置标记，避免影响后续判断
        app._fromBackground = false
        return true
      }
      return false
    },

    /**
     * 判断是否从图片预览返回
     * @returns {boolean}
     */
    isFromImagePreview() {
      const app = getApp()
      if (app && app._fromImagePreview) {
        app._fromImagePreview = false
        return true
      }
      return false
    },

    /**
     * 使用 diff 算法更新数据，避免闪烁
     * @param {Object} newData - 新数据
     * @param {Function} callback - 回调函数
     */
    diffSetData(newData, callback) {
      diffSetData(this, newData, callback)
    }
  }
})

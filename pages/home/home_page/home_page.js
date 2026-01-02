const app = getApp()
const api = app.api
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const loadError = require('../../../behaviors/loadError')
const smartLoading = require('../../../behaviors/smartLoading')

// 加载阶段对应的提示文字
const LOADING_TEXTS = {
  connecting: '正在建立连接...',
  logging: '加载用户数据...',
  ready: '即将完成加载...'
}

Page({
  behaviors: [pageGuard.behavior, pageLoading, loadError, smartLoading],
  data: {
    loadingText: LOADING_TEXTS.connecting,
    pageUrl: {
      forecast: '/pages/home/album_list/album_list',
      wrong_word: '/pages/dictation/wrong_list/wrong_list'
    }
  },
  // ===========生命周期 Start===========
  onShow() {
    // 首次加载时启动加载阶段监控
    if (!this.data._isDataReady && !this.data.list) {
      this._watchLoadingStage()
    }
  },
  onHide() {
    // 页面隐藏时清理定时器
    this._clearLoadingStageTimer()
  },
  onUnload() {
    // 页面卸载时清理定时器
    this._clearLoadingStageTimer()
  },
  onShowLogin() {
    // 使用智能加载策略判断是否需要加载
    if (!this.shouldLoad()) {
      return
    }

    const isSilent = this.shouldSilentRefresh()

    // 首次加载显示 loading，静默刷新不显示
    if (!isSilent) {
      this.startLoading()
    }

    // 尝试使用预加载缓存
    const cachedHomeData = app.getPreloadCache('home')
    const cachedScienceData = app.getPreloadCache('popularScience')

    if (cachedHomeData) {
      // 使用缓存数据
      this._handleHomeData(cachedHomeData, isSilent)
    } else {
      // 无缓存，正常请求
      this.listSubject(!isSilent)
    }

    if (cachedScienceData) {
      // 使用缓存数据
      this._handleScienceData(cachedScienceData)
    } else {
      // 无缓存，正常请求
      this.listPopularScienceData()
    }
  },
  onShareAppMessage() {
    return api.share('考雅机经Open题库', this)
  },
  // ===========生命周期 End===========
  // ===========业务操作 Start===========
  toAlbumPage(e) {
    let item = e.currentTarget.dataset.item
    this.navigateTo(this.data.pageUrl[item.type] + '?sid=' + item.id)
  },
  toChildPage(e) {
    let isInside = e.currentTarget.dataset.isInside
    if (isInside === '0') {
      this.listPopularScienceByModule()
    }else{
      let item = e.currentTarget.dataset.item
      this.navigateTo(this.data.pageUrl[item.type] + `?sid=${item.id}`)
    }
  },
  toNoticeListPage() {
    this.navigateTo('/pages/notice/list/index')
  },
  // 进入补充说明详情
  toNoticePage(e) {
    const id = e.currentTarget.dataset.id
    this.navigateTo(`/pages/notice/detail/index?id=${id}`)
  },
  // 点击说明徽章（暂未连接API）
  onNoticeTap(e) {
    const id = e.currentTarget.dataset.id
    this.navigateTo(`/pages/notice/detail/index?id=${id}`, { checkReady: false })
  },
  // ===========业务操作 End===========
  // ===========数据获取 Start===========
  listSubject(showLoading) {
    const _this = this
    api.request(this, '/v2/home/list', {}, showLoading).then(res => {
      _this._handleHomeData(res, !showLoading)
    }).catch(() => {
      pageGuard.showRetry(_this)
    })
  },

  /**
   * 处理首页数据
   * @param {Object} res - 接口返回数据
   * @param {boolean} isSilent - 是否静默更新
   */
  _handleHomeData(res, isSilent) {
    if (isSilent) {
      // 静默刷新使用 diff 更新，避免闪烁
      this.diffSetData(res)
    } else {
      // 首次加载直接 setData
      this.setData(res)
    }
    this.markLoaded()
    this.setDataReady()
    this.finishLoading()
  },

  /**
   * 处理科普数据
   * @param {Object} res - 接口返回数据
   */
  _handleScienceData(res) {
    this.diffSetData(res)
  },

  retryLoad() {
    this.hideLoadError()
    this.resetLoadState()
    this.startLoading()
    this.listSubject(true)
    this.listPopularScienceData()
  },

  listPopularScienceData() {
    const _this = this
    api.request(this, '/popular/science/v1/miniapp/home', {}, true).then(res => {
      _this._handleScienceData(res)
    })
  },
  listPopularScienceByModule() {
    api.request(this, '/popular/science/v1/list/no_permission', {}, true).then(res=>{
      const list = res.popularScienceList || []
      if (list.length == 1){
        this.navigateTo(`/pages/notice/detail/index?id=${list[0].id}`)
      }
    })
  },
  // ===========数据获取 End===========
  // ===========Shimmer 加载提示 Start===========
  /**
   * 监控加载阶段，更新提示文字
   */
  _watchLoadingStage() {
    const _this = this
    // 清除已有定时器
    this._clearLoadingStageTimer()
    // 每 100ms 检查一次加载阶段
    this._loadingStageTimer = setInterval(() => {
      const stage = app.globalData.loadingStage
      _this._updateLoadingText(stage)
      // 数据就绪后停止监控
      if (_this.data._isDataReady || _this.data.list) {
        _this._clearLoadingStageTimer()
      }
    }, 100)
  },

  /**
   * 更新加载提示文字
   * @param {string} stage - 加载阶段
   */
  _updateLoadingText(stage) {
    const text = LOADING_TEXTS[stage] || LOADING_TEXTS.connecting
    // 只在值变化时才 setData，避免不必要的渲染
    if (this.data.loadingText !== text) {
      this.setData({ loadingText: text })
    }
  },

  /**
   * 清理加载阶段监控定时器
   */
  _clearLoadingStageTimer() {
    if (this._loadingStageTimer) {
      clearInterval(this._loadingStageTimer)
      this._loadingStageTimer = null
    }
  }
  // ===========Shimmer 加载提示 End===========
})

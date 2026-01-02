const api = getApp().api
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const loadError = require('../../../behaviors/loadError')
const smartLoading = require('../../../behaviors/smartLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading, loadError, smartLoading],
  data: {},
  onLoad(options) {
    this.setData({
      detail: options
    })
  },
  onShow() {
    const isFirstLoad = !this.data._hasLoaded

    // 从后台返回，不刷新
    if (!isFirstLoad && this.isFromBackground()) {
      return
    }

    if (isFirstLoad) {
      // 首次加载：显示 loading
      this.startLoading()
      this.loadData(true)
    } else {
      // 从子页面返回：静默刷新（子页面可能有打卡操作）
      this.loadData(false)
    }
  },
  loadData(showLoading) {
    this.hideLoadError()
    const _this = this
    api.request(this, '/keyVocabulary/listWordRecord', {}, showLoading, 'GET', false).then((res) => {
      if (showLoading) {
        // 首次加载：直接 setData
        _this.setData(res)
      } else {
        // 静默刷新：diff 更新
        _this.diffSetData(res)
      }

      _this.markLoaded()
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.showRetry(_this)
    })
  },
  retryLoad() {
    this.hideLoadError()
    this.startLoading()
    this.loadData(true)
  },
  toKeyPage(e) {
    const id = e.currentTarget.dataset.id
    // 暂时只提供查看词汇列表功能，再次听写功能开发中
    this.navigateTo('../wrong_word/wrong_word?id=' + id)
  },
})
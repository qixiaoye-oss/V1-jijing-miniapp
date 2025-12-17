const api = getApp().api
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const loadError = require('../../../behaviors/loadError')

Page({
  behaviors: [pageGuard.behavior, pageLoading, loadError],

  data: {},
  onLoad(options) {
    this.setData({
      detail: options
    })
    this.startLoading()
    this.loadData()
  },
  onShow() {},
  loadData() {
    this.hideLoadError()
    const _this = this
    api.request(this, '/keyVocabulary/listWordRecord', {}, true).then(() => {
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.showRetry(_this)
    })
  },
  retryLoad() {
    this.startLoading()
    this.loadData()
  },
  toKeyPage(e) {
    const id = e.currentTarget.dataset.id
    // 暂时只提供查看词汇列表功能，再次听写功能开发中
    this.navigateTo('../wrong_word/wrong_word?id=' + id)
  },
})
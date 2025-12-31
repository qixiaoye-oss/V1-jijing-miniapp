const api = getApp().api
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const loadError = require('../../../behaviors/loadError')

Page({
  behaviors: [pageGuard.behavior, pageLoading, loadError],
  data: {},
  // ===========生命周期 Start===========
  onShow() {
    this.startLoading()
    this.listData()
  },
  // ===========生命周期 End===========
  // ===========业务操作 Start===========
  // 去往答题
  toDetail(e) {
    let item = e.currentTarget.dataset.item
    this.navigateTo(`../detail/index?id=${item.id}`)
  },
  // ===========业务操作 End===========
  // ===========数据获取 Start===========
  // 访问接口获取数据
  listData() {
    const _this = this
    api.request(this, '/popular/science/v1/miniapp/list', {}, true).then(() => {
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.showRetry(_this)
    })
  },
  // 重试加载
  retryLoad() {
    this.hideLoadError()
    this.startLoading()
    this.listData()
  },
  // ===========数据获取 End===========
  onShareAppMessage() {
    return api.share('考雅机经Open题库', this)
  }
})

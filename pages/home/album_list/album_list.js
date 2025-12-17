const api = getApp().api
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const loadError = require('../../../behaviors/loadError')

Page({
  behaviors: [pageGuard.behavior, pageLoading, loadError],
  data: {},
  onShow() {
    this.startLoading()
    this.listAlbum()
  },
  toChildPage(e) {
    const { id } = e.currentTarget.dataset
    this.navigateTo('/pages/home/set_list/set_list?aid=' + id)
  },
  listAlbum() {
    const _this = this
    api.request(this, '/album/listByKeyword', {
      sid: this.options.sid
    }, true, true).then(() => {
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.showRetry(_this)
    })
  },
  retryLoad() {
    this.hideLoadError()
    this.startLoading()
    this.listAlbum()
  },
  onShareAppMessage() {
    return api.share('飕飕听烤鸭版', this)
  }
})
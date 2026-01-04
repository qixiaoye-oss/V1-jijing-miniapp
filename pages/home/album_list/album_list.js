const api = getApp().api
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const loadError = require('../../../behaviors/loadError')
const smartLoading = require('../../../behaviors/smartLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading, loadError, smartLoading],
  data: {},
  onShow() {
    const isFirstLoad = !this.data._hasLoaded

    // 从后台返回，不刷新
    if (!isFirstLoad && this.isFromBackground()) {
      return
    }

    if (isFirstLoad) {
      // 首次加载：显示 loading
      this.startLoading()
      this.listAlbum(true)
    } else {
      // 从子页面返回：静默刷新（更新 tag 和进度条）
      this.listAlbum(false)
    }
  },
  toChildPage(e) {
    const { id } = e.currentTarget.dataset
    this.navigateTo('/pages/home/set_list/set_list?aid=' + id)
  },
  listAlbum(showLoading) {
    const _this = this
    api.request(this, '/album/listByKeyword', {
      sid: this.options.sid
    }, showLoading, 'GET', false).then((res) => {
      if (showLoading) {
        // 首次加载：直接 setData
        _this.setData(res)
      } else {
        // 静默刷新：diff 更新，只更新变化的 tag 和进度条
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
    this.listAlbum(true)
  }
})
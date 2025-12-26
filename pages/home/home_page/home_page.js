const api = getApp().api
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const loadError = require('../../../behaviors/loadError')

Page({
  behaviors: [pageGuard.behavior, pageLoading, loadError],
  data: {
    pageUrl: {
      forecast: '/pages/home/album_list/album_list',
      wrong_word: '/pages/dictation/wrong_list/wrong_list'
    },
    occupancyFlag: false
  },
  // ===========生命周期 Start===========
  onShow() {
    const query = wx.createSelectorQuery()
    query.selectViewport().boundingClientRect((rect) => {
      let availableWidth = rect.width - 40 - 10 - 20
      this.setData({
        occupancyFlag: availableWidth > 335
      })
    })
    query.exec()
  },
  onShowLogin() {
    this.startLoading()
    this.listSubject(true)
    this.listPopularScienceData()
  },
  onShareAppMessage() {
    return api.share('飕飕听烤鸭版', this)
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
      wx.navigateTo({
        url: this.data.noPermissionUrl,
      })
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
  listSubject(isPull) {
    const _this = this
    api.request(this, '/v2/home/list', {}, isPull).then(res => {
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.showRetry(_this)
    })
  },
  retryLoad() {
    this.hideLoadError()
    this.startLoading()
    this.listSubject(true)
    this.listPopularScienceData()
  },
  listPopularScienceData() {
    api.request(this, '/popular/science/v1/miniapp/home', {}, true)
  },
  // ===========数据获取 End===========
})

const api = require('../../../utils/api')
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const smartLoading = require('../../../behaviors/smartLoading')
let iaudio = getApp().iaudio
let audio

Page({
  behaviors: [pageGuard.behavior, pageLoading, smartLoading],
  data: {
    endTime: 0,
    stauts: 0,
    scrollIntoId: ''
  },
  // 只在 onLoad 加载一次，无需刷新
  onLoad(options) {
    this.startLoading()
    this.getDetail()
    audio = wx.createInnerAudioContext()
    audio.onEnded(() => {
      this.audioStop()
    })
  },
  onShow() {
    let list = wx.getStorageSync('listenings')
    list.forEach(i => {
      i['audioPlay'] = "stop"
    })
    this.setData({
      list: list
    })
  },
  audioStop() {
    let list = this.data.list
    list.forEach(i => {
      i['audioPlay'] = "stop"
    })
    this.setData({
      list: list
    })
  },
  playAudio(e) {
    iaudio.pause()
    audio.stop()
    this.audioStop()
    let list = this.data.list
    let nextIdx = e.currentTarget.dataset.idx
    this.setData({
      stauts: 1
    })
    audio.src = list[nextIdx].list[0].audioUrl
    list[nextIdx].audioPlay = 'play'
    this.setData({
      list: list
    })
    setTimeout(() => {
      audio.play()
    }, 500);
  },
  onHide() {
    audio.destroy()
  },
  onUnload() {
    audio.destroy()
  },
  toDetail(e) {
    let pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      index: e.currentTarget.dataset.idx
    })
    iaudio.pause()
    this.navigateBack()
  },
  getDetail() {
    const _this = this
    api.request(this, '/set/detail', {
      sid: this.options.sid,
    }, false, 'GET', false).then(res => {
      audio.src = res.detail.audioUrl
      _this.markLoaded()
      _this.setDataReady()
      _this.finishLoading()
      // 使用原生页面滚动到指定元素
      setTimeout(() => {
        const query = wx.createSelectorQuery()
        query.select('#ID' + _this.options.paragraphId).boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec((res) => {
          if (res[0] && res[1]) {
            wx.pageScrollTo({
              scrollTop: res[1].scrollTop + res[0].top - 100,
              duration: 300
            })
            _this.setData({
              scrollIntoId: "ID" + _this.options.paragraphId
            })
          }
        })
      }, 200);
    }).catch(() => {
      pageGuard.goBack(_this)
    })
  }
})
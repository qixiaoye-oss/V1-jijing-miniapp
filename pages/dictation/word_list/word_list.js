const api = require('../../../utils/api')
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
let iaudio = getApp().iaudio
let audio

Page({
  behaviors: [pageGuard.behavior, pageLoading],

  data: {
    endTime: 0,
    stauts: 0,
    scrollIntoId: ''
  },
  onLoad(options) {
    this.startLoading()
    this.getDetail(true)
    audio = wx.createInnerAudioContext()
    audio.onEnded(() => {
      let list = this.data.list
      list.forEach(i => {
        i.list.forEach(j => {
          j['audioPlay'] = 'stop'
        })
      });
      this.setData({
        list: list
      })
    })
  },
  onShow() {
    let list = wx.getStorageSync('listenings')
    list.forEach(i => {
      i.list.forEach(j => {
        j['audioPlay'] = 'stop'
      })
    });
    this.setData({
      list: list
    })

  },
  playAudio(e) {
    iaudio.pause()
    audio.stop()
    let list = this.data.list
    let nextIdx = e.currentTarget.dataset.idx
    list.forEach((i, idx) => {
      i.list.forEach(j => {
        j.audioPlay = 'stop'
      })
      if (nextIdx === idx) {
        i.list[0].audioPlay = 'play'
      }
    });
    this.setData({
      stauts: 1,
      list: list
    })
    audio.src = list[nextIdx].list[0].pronunciationAudioUrl
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
    audio.stop()
    this.navigateBack()
  },
  getDetail(isPull) {
    const _this = this
    api.request(this, '/set/detail', {
      sid: this.options.sid,
    }, isPull).then(res => {
      audio.src = res.detail.audioUrl
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
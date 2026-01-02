const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const smartLoading = require('../../../behaviors/smartLoading')
let iaudio = getApp().iaudio
let audio

Page({
  behaviors: [pageGuard.behavior, pageLoading, smartLoading],
  data: {
    list: [],
    endTime: 0,
    stauts: 0,
    scrollIntoId: ''
  },

  onLoad(options) {
    this.startLoading()

    // 从 storage 读取数据（spot_dictation 已存入）
    const list = wx.getStorageSync('listenings')
    if (!list || list.length === 0) {
      wx.showToast({ title: '数据加载失败', icon: 'none' })
      pageGuard.goBack(this)
      return
    }

    // 初始化播放状态
    list.forEach(i => {
      i['audioPlay'] = 'stop'
    })

    this.setData({
      list: list,
      scrollIntoId: 'ID' + options.paragraphId
    })

    this.markLoaded()
    this.setDataReady()
    this.finishLoading()

    // 滚动到指定位置
    setTimeout(() => {
      const query = wx.createSelectorQuery()
      query.select('#ID' + options.paragraphId).boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec((res) => {
        if (res[0] && res[1]) {
          wx.pageScrollTo({
            scrollTop: res[1].scrollTop + res[0].top - 100,
            duration: 300
          })
        }
      })
    }, 200)
  },

  onShow() {
    // 刷新列表状态（从 storage 同步最新状态）
    const storageList = wx.getStorageSync('listenings')
    if (storageList) {
      storageList.forEach(i => {
        i['audioPlay'] = 'stop'
      })
      this.setData({ list: storageList })
    }

    // 初始化音频（从 storage 读取音频路径）
    audio = wx.createInnerAudioContext()
    audio.src = wx.getStorageSync('tempAudioUrl')
    audio.onEnded(() => {
      this.audioStop()
    })
  },

  audioStop() {
    const { list } = this.data
    list.forEach(i => {
      i['audioPlay'] = 'stop'
    })
    this.setData({ list: list })
  },

  playAudio(e) {
    iaudio.pause()
    audio.stop()
    this.audioStop()

    const { list } = this.data
    const nextIdx = e.currentTarget.dataset.idx

    this.setData({ stauts: 1 })

    audio.src = list[nextIdx].list[0].audioUrl
    list[nextIdx].audioPlay = 'play'
    this.setData({ list: list })

    setTimeout(() => {
      audio.play()
    }, 500)
  },

  onHide() {
    if (audio) {
      audio.destroy()
    }
  },

  onUnload() {
    if (audio) {
      audio.destroy()
    }
  },

  toDetail(e) {
    const idx = e.currentTarget.dataset.idx

    // 设置上一页的 index
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    if (prevPage) {
      prevPage.setData({ index: idx })
    }

    iaudio.pause()
    this.navigateBack()
  }
})

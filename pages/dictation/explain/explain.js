const api = require('../../../utils/api')
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
let audio

Page({
  behaviors: [pageGuard.behavior, pageLoading],

  data: {
    param: {},
    wordPlay: 'stop',
    sentencePlay: 'stop'
  },
  onLoad: function (options) {
    this.startLoading()
    this.setData({
      param: options
    })
    this.getDetail(true)
    audio = wx.createInnerAudioContext()
    audio.onEnded(() => {
      this.stopAudio()
    })
  },
  playWordAudio() {
    this.stopAudio()
    audio.src = this.data.detail.pronunciationAudioUrl
    this.setData({
      wordPlay: 'play'
    })
    wx.nextTick(() => {
      audio.play()
    })
  },
  playSentenceAudio() {
    this.stopAudio()
    audio.src = this.data.detail.audioUrl
    this.setData({
      sentencePlay: 'play'
    })
    wx.nextTick(() => {
      audio.play()
    })
  },
  stopAudio() {
    if (!audio.paused) {
      audio.stop()
    }
    this.setData({
      wordPlay: 'stop',
      sentencePlay: 'stop'
    })
  },
  onHide() {
    this.stopAudio()
  },
  onUnload() {
    this.stopAudio()
  },
  getDetail(isPull) {
    const _this = this
    api.request(this, '/keyVocabulary/detail', {
      qid: this.options.qid,
      sid: this.options.sid
    }, isPull).then(() => {
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.goBack(_this)
    })
  }
})
const api = require('../../../utils/api')
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const smartLoading = require('../../../behaviors/smartLoading')

let audio

Page({
  behaviors: [pageGuard.behavior, pageLoading, smartLoading],

  data: {
    list: [],
    detail: null,
    currentPlayIndex: -1
  },

  onLoad: function (options) {
    this.startLoading()
    this.listQuestion()
    audio = wx.createInnerAudioContext()
    audio.onEnded(() => {
      this.stopAudio()
    })
  },

  listQuestion() {
    const _this = this
    api.request(this, '/keyVocabulary/listExercise', {
      eid: this.options.eid,
    }, false, 'GET', false).then(res => {
      const list = res.detail.detail.map(item => ({
        ...item,
        answerArr: item.answer.split("|"),
        isMark: item.status != 1, // 错误的默认标记
        wordPlay: 'stop',
        sentencePlay: 'stop'
      }))
      _this.setData({
        detail: res.detail,
        list: list
      })
      _this.markLoaded()
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.goBack(_this)
    })
  },

  switchChange(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.list[index]

    // 错误的题目不允许手动操作开关
    if (item.status != 1) {
      return
    }

    this.setData({
      [`list[${index}].isMark`]: e.detail.value
    })
  },

  playWordAudio(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.list[index]

    this.stopAudio()

    if (item.pronunciationAudioUrl) {
      audio.src = item.pronunciationAudioUrl
      this.setData({
        currentPlayIndex: index,
        [`list[${index}].wordPlay`]: 'play'
      })
      wx.nextTick(() => {
        audio.play()
      })
    }
  },

  playSentenceAudio(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.list[index]

    this.stopAudio()

    if (item.audioUrl) {
      audio.src = item.audioUrl
      this.setData({
        currentPlayIndex: index,
        [`list[${index}].sentencePlay`]: 'play'
      })
      wx.nextTick(() => {
        audio.play()
      })
    }
  },

  stopAudio() {
    if (audio && !audio.paused) {
      audio.stop()
    }
    const index = this.data.currentPlayIndex
    if (index >= 0) {
      this.setData({
        [`list[${index}].wordPlay`]: 'stop',
        [`list[${index}].sentencePlay`]: 'stop',
        currentPlayIndex: -1
      })
    }
  },

  onHide() {
    this.stopAudio()
  },

  onUnload() {
    this.stopAudio()
  },

  saveAndReturn() {
    if (this.data.saveLoading) {
      return
    }
    this.setData({
      saveLoading: true
    })

    // 收集标记的题目
    const list = this.data.list
    const markList = []
    for (let i = 0; i < list.length; i++) {
      if (list[i].isMark) {
        markList.push({
          id: list[i].id,
          questionId: list[i].questionId
        })
      }
    }

    const _this = this
    api.request(this, '/keyVocabulary/saveMarkWords', {
      eid: this.options.eid,
      markList: markList
    }, true, 'POST').then(res => {
      _this.navigateBack()
    }).catch(() => {
      _this.setData({ saveLoading: false })
    })
  }
})

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
        originalMark: item.status != 1, // 记录原始标记状态，用于判断是否有变化
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

    const _this = this
    const list = this.data.list
    const detail = this.data.detail
    const promises = []

    // 遍历所有题目，找出标记状态发生变化的
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      // 只处理正确题目的标记变化（错误题目不允许手动操作）

      if (item.status == 1 && item.isMark !== item.originalMark) {
        const params = {
          aid: detail.albumId,
          sid: detail.setId,
          bid: item.questionId,
          userChoice: item.userChoice
        }
        if (item.isMark) {
          // 新增标记
          promises.push(api.request(_this, '/keyVocabulary/saveCallout', params, false, 'GET', false))
        } else {
          // 取消标记
          promises.push(api.request(_this, '/keyVocabulary/delCallout', params, false, 'GET', false))
        }
      }
    }

    // 如果没有变化，直接返回
    if (promises.length === 0) {
      _this.navigateBack()
      return
    }

    // 等待所有请求完成
    Promise.all(promises).then(() => {
      _this.navigateBack()
    }).catch(() => {
      _this.setData({
        saveLoading: false
      })
    })
  }
})
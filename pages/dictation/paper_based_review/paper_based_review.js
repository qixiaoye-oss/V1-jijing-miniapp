const api = require('../../../utils/api')
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const smartLoading = require('../../../behaviors/smartLoading')

let audio

Page({
  behaviors: [pageGuard.behavior, pageLoading, smartLoading],

  data: {
    list: [],
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
    let list = wx.getStorageSync('listenings')
    let wordList = []
    list.forEach(i => {
      i.list.forEach(ci => {
        wordList.push({
          id: ci.id,
          status: 1,
          answerArr: ci.referenceAnswer.split("|"),
          chinese: ci.chinese,
          content: ci.content,
          audioUrl: ci.audioUrl,
          pronunciationAudioUrl: ci.pronunciationAudioUrl,
          parentChinese: i.chinese,
          wordPlay: 'stop',
          sentencePlay: 'stop'
        })
      })
    })
    this.setData({
      list: wordList
    })
    this.markLoaded()
    this.setDataReady()
    this.finishLoading()
  },

  switchChange(e) {
    let path = `list[` + e.currentTarget.dataset.index + `].status`
    this.setData({
      [path]: e.detail.value ? 2 : 1
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

  next() {
    if (this.data.saveLoading) {
      return
    }
    this.setData({
      saveLoading: true
    })
    let list = this.data.list
    let answers = []
    for (let i = 0; i < list.length; i++) {
      let answer = {
        id: list[i].id,
        status: list[i].status
      }
      answers.push(answer)
    }
    const _this = this
    api.request(this, '/keyVocabulary/saveExercise', {
      sid: this.options.sid,
      aid: this.options.aid,
      questionType: 2,
      mode: 'paper',
      paperExercise: answers
    }, true, 'POST').then(res => {
      _this.navigateBack()
    }).catch(() => {
      _this.setData({ saveLoading: false })
    })
  },
})

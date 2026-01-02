const api = require('../../../utils/api')
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const smartLoading = require('../../../behaviors/smartLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading, smartLoading],
  // 只在 onLoad 加载一次，无需刷新
  onLoad: function (options) {
    this.startLoading()
    this.listQuestion()
  },
  listQuestion() {
    let list = wx.getStorageSync('listenings')
    let wordList = []
    list.forEach(i => {
      i.list.forEach(ci => {
        wordList.push({
          id: ci.id,
          status: 1,
          answerArr: ci.referenceAnswer.split("|")
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
  change(e) {
    let item = {
      ...e.currentTarget.dataset,
      sid: this.options.sid,
      aid: this.options.aid,
      length: this.data.list.length
    }
    this.navigateTo('../explain/explain' + api.parseParams(item))
  },
  next() {
    if (this.data.saveLoading) {
      return
    }
    this.setData({
      saveLoading: true
    })
    // 重新保存一下纸笔的答题结果
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
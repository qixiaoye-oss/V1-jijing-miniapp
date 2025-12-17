const api = require('../../../utils/api')
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading],

  onShow() { },
  onLoad: function (options) {
    this.startLoading()
    this.listQuestion(true)
  },
  listQuestion(isPull) {
    const _this = this
    api.request(this, '/keyVocabulary/wrongWord', {
      id: this.options.id,
    }, true).then(res => {
      let list = res.list
      res.list.forEach(item => {
        item['status'] = 1
        item['answerArr'] = item.referenceAnswer.split("|")
      })
      _this.setData({
        list: list
      })
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.goBack(_this)
    })
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
    api.request(this, '/keyVocabulary/saveWrongExercise', {
      id: this.options.id,
      mode: 'paper',
      paperExercise: answers
    }, true, 'POST').then(res => {
      _this.navigateBack()
    }).catch(() => {
      _this.setData({ saveLoading: false })
    })
  }
})
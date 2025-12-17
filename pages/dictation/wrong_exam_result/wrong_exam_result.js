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
    api.request(this, '/keyVocabulary/wrongExerciseResult', {
      sid: this.options.sid,
    }, isPull).then(res => {
      res.list.forEach(item => {
        item['answerArr'] = item.answer.split("|")
      })
      _this.setData({
        [`list`]: res.list
      })
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.goBack(_this)
    })
  },
  change(e) {
    let item = e.currentTarget.dataset
    this.navigateTo('../explain/explain' + api.parseParams(item))
  },
  next() {
    this.navigateBack()
  }
})
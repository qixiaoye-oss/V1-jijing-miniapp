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
    const _this = this
    api.request(this, '/keyVocabulary/listExercise', {
      eid: this.options.eid,
    }, false, 'GET', false).then(res => {
      res.detail.detail.forEach(item => {
        item['answerArr'] = item.answer.split("|")
      })
      _this.setData({
        [`detail.detail`]: res.detail.detail
      })
      _this.markLoaded()
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
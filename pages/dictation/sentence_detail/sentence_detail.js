const api = require('../../../utils/api')
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading],

  data: {},
  onLoad(options) {
    this.startLoading()
    this.getDetail(true)
  },
  getDetail(isPull) {
    const _this = this
    api.request(this, '/keyVocabulary/mainDetail', {
      qid: this.options.qid,
      sid: this.options.sid,
    }, isPull).then(res => {
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.goBack(_this)
    })
  }
})
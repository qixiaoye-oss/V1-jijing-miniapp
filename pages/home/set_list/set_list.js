const api = getApp().api
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const loadError = require('../../../behaviors/loadError')

Page({
  behaviors: [pageGuard.behavior, pageLoading, loadError],
  data: {
    isKeyVocabulary: false
  },
  onShow() {
    this.startLoading()
    this.listSet()
  },
  toChildPage(e) {
    let item = e.currentTarget.dataset.item
    let param = {
      sid: item.id,
      aid: this.options.aid,
      eid: item.exerciseId,
      mode: 'computer'
    }
    let list = []
    let url = []
    list.push('句子版听写（纸笔）')
    url.push('/pages/dictation/spot_dictation/spot_dictation')
    list.push('句子版听写（机考）')
    url.push('/pages/dictation/spot_dictation/spot_dictation')
    // [暂时屏蔽] 以下三个入口用户使用频率极低
    // list.push('速刷版听写（纸笔）')
    // url.push('/pages/dictation/word_dictation/word_dictation')
    // list.push('速刷版听写（机考）')
    // url.push('/pages/dictation/word_dictation/word_dictation')
    // list.push('速刷版')
    // url.push('/pages/dictation/quick_answer/quick_answer')
    if (!api.isEmpty(item.exerciseId)) {
      list.push('成绩')
      url.push('/pages/dictation/result_list/result_list')
    }
    const _this = this
    wx.showActionSheet({
      itemList: list,
      success(res) {
        if (res.tapIndex == 0) { // 仅索引0为纸笔模式（屏蔽速刷版后索引已调整）
          param.mode = 'paper'
        }
        _this.navigateTo(url[res.tapIndex] + api.parseParams(param))
      }
    })
  },
  listSet() {
    const _this = this
    api.request(this, '/set/listByKeyword', {
      aid: this.options.aid,
    }, true, true).then(res => {
      res.list.forEach(item => {
        if (item.countByKeyVocabulary > 0) {
          _this.setData({
            isKeyVocabulary: true,
            aid: _this.options.aid
          })
        }
      })
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.showRetry(_this)
    })
  },
  retryLoad() {
    this.hideLoadError()
    this.startLoading()
    this.listSet()
  }
})

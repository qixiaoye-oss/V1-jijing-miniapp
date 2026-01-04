const api = getApp().api
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const loadError = require('../../../behaviors/loadError')
const smartLoading = require('../../../behaviors/smartLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading, loadError, smartLoading],
  data: {
    isKeyVocabulary: false
  },
  onShow() {
    const isFirstLoad = !this.data._hasLoaded

    // 从后台返回，不刷新
    if (!isFirstLoad && this.isFromBackground()) {
      return
    }

    if (isFirstLoad) {
      // 首次加载：显示 loading
      this.startLoading()
      this.listSet(true)
    } else {
      // 从子页面返回：静默刷新（更新 tag）
      this.listSet(false)
    }
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
  listSet(showLoading) {
    const _this = this
    api.request(this, '/set/listByKeyword', {
      aid: this.options.aid,
    }, showLoading, 'GET', false).then(res => {
      // 检查是否有关键词汇
      res.list.forEach(item => {
        if (item.countByKeyVocabulary > 0) {
          res.isKeyVocabulary = true
          res.aid = _this.options.aid
        }
      })

      if (showLoading) {
        // 首次加载：直接 setData
        _this.setData(res)
      } else {
        // 静默刷新：diff 更新，只更新变化的 tag
        _this.diffSetData(res)
      }

      _this.markLoaded()
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.showRetry(_this)
    })
  },
  retryLoad() {
    this.hideLoadError()
    this.startLoading()
    this.listSet(true)
  }
})

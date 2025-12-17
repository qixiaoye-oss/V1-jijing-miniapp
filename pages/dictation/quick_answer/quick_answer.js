let audio = null
let api = getApp().api
let nowPlayNumber = 1
const pageGuard = require('../../../behaviors/pageGuard')
const audioPageLoading = require('../../../behaviors/audioPageLoading')

Page({
  behaviors: [pageGuard.behavior, audioPageLoading],
  data: {
    autoPlayAudio: true,
    swiperCurrent: 0,
    groupCurrent: 0,
    questionCurrent: 0,
    // 播放设置
    status: 0,
    playNumber: 2,
    startRepeatPlay: false,
    numberSetWinShow: false,
    // 标注
    isMark: 0,
    // 文本显示
    showArticle: false,
    baseShowArticle: false,
  },
  onLoad: function (options) {
    this.startAudioPageLoading()
    this.listListening(true)
    audio = wx.createInnerAudioContext()
    audio.onEnded(() => {
      if (this.data.startRepeatPlay && nowPlayNumber < this.data.playNumber) {
        nowPlayNumber = nowPlayNumber + 1
        audio.play()
        return
      }
      this.setData({
        status: 2
      })
      if (this.data.autoPlayAudio) {
        this.nextQuestion()
      }
    })
    audio.onPlay(() => {
      this.setData({
        status: 1,
      })
    })
    audio.onCanplay(() => { })
    audio.onTimeUpdate(() => { })
  },
  onShow: function () {
    if (!api.isEmpty(this.data.index)) {
      let list = wx.getStorageSync('listenings')
      let index = Number(this.data.index) + 1
      let i = Number(this.data.index)
      this.setData({
        groupCurrent: i,
        swiperCurrent: index,
        schedule: ((index / list.length) * 100),
        showArticle: false,
        index: ''
      })
      this.stopAudio()
      this.playAudio()
    }
  },
  onReady: function () {
    let playCount = wx.getStorageSync('AUDIO_PLAY_COUNT')
    this.setData({
      playNumber: playCount,
      changePlayNumber: playCount,
    })
  },
  onHide: function () {
    audio.pause()
    this.setData({
      status: 0,
    })
  },
  onUnload: function () {
    audio.stop()
    audio.destroy()
    this.setData({
      status: 0,
    })
  },
  switchAutoPlay(e) {
    this.setData({
      autoPlayAudio: e.detail.value
    })
  },
  // 开始第一个单词的播放
  startPlayFirstAudio() {
    const that = this
    this.setData({
      swiperCurrent: 1,
      startRepeatPlay: true,
    })
    nowPlayNumber = 1
    if (this.data.autoPlayAudio) {
      setTimeout(() => {
        that.playAudio()
      }, 300)
    }
  },
  playAudio() {
    let list = wx.getStorageSync('listenings')
    audio.src = list[this.data.groupCurrent].list[this.data.questionCurrent].pronunciationAudioUrl
    this.setData({
      status: 1,
    })
    setTimeout(() => {
      audio.play()
    }, 500)
  },
  //重新播放
  listenAgain() {
    this.setData({
      startRepeatPlay: false,
    })
    this.stopAudio()
    this.playAudio()
  },
  stopAudio() {
    audio.stop()
    this.setData({
      status: 2,
    })
    if (this.data.startRepeatPlay && nowPlayNumber < this.data.playNumber) {
      nowPlayNumber = nowPlayNumber + 1
      audio.play()
      return
    }
  },
  nextQuestion() {
    // 停止当前的音频
    const that = this
    audio.stop()
    let len = this.data.list.length
    let nidx = this.data.groupCurrent + 1
    if (nidx >= len) {
      api.toast('已经最后一句啦！')
      return
    }
    let isMark = this.data.list[nidx].list[this.data.questionCurrent].isMark
    this.setData({
      groupCurrent: nidx,
      schedule: (((nidx + 1) / len) * 100),
      swiperCurrent: this.data.swiperCurrent + 1,
      startRepeatPlay: true,
      status: 0,
      isMark: isMark
    })
    nowPlayNumber = 1
    if (this.data.autoPlayAudio) {
      setTimeout(() => {
        that.playAudio()
      }, 300)
    }
  },
  //停止播放
  pauseAudio() {
    this.setData({
      startRepeatPlay: false,
    })
    nowPlayNumber = 1
    this.stopAudio()
  },
  returnPage() {
    this.navigateBack()
  },
  // 单词切换
  swiperSwitch(e) {
    this.isLastQuestion()
    if (e.detail.source !== "touch") {
      return
    }
    const that = this
    audio.stop()
    nowPlayNumber = 1
    let list = wx.getStorageSync('listenings')
    let si = e.detail.current < 1 ? 1 : e.detail.current
    let gc = e.detail.current < 1 ? 0 : e.detail.current - 1
    let isMark = list[gc].list[this.data.questionCurrent].isMark
    this.setData({
      swiperCurrent: e.detail.current,
      groupCurrent: gc,
      schedule: ((si / list.length) * 100),
      startRepeatPlay: true,
      status: 0,
      isMark: isMark
    })
    if (e.detail.current < 1) {
      return
    }
    audio.src = list[this.data.groupCurrent].list[this.data.questionCurrent].pronunciationAudioUrl
    if (this.data.autoPlayAudio) {
      setTimeout(() => {
        that.playAudio()
      }, 300)
    }
  },
  // 是否显示文本
  showArticle: function () {
    this.setData({
      showArticle: !this.data.showArticle
    })
  },
  // 播放设置
  numberSet() {
    this.setData({
      numberSetWinShow: true
    })
  },
  // 设置弹窗事件
  onSettingCancel() {
    this.setData({
      numberSetWinShow: false
    })
  },
  onSettingConfirm(e) {
    const { playNumber, showArticle, autoPlay } = e.detail
    this.setData({
      numberSetWinShow: false,
      baseShowArticle: showArticle,
      playNumber: playNumber,
      autoPlayAudio: autoPlay
    })
  },
  // 详解吐槽
  toExplain: function (e) {
    if (this.data.swiperCurrent === 0) {
      return
    }
    let list = wx.getStorageSync('listenings')
    this.navigateTo('../sentence_detail/sentence_detail?qid=' + list[this.data.groupCurrent].id + '&sid=' + this.options.sid)
  },
  // 标注考点词
  label: function () {
    let list = wx.getStorageSync('listenings')
    let id = list[this.data.groupCurrent].list[this.data.questionCurrent].id
    let isMark = list[this.data.groupCurrent].list[this.data.questionCurrent].isMark
    if (isMark == 1) {
      this.delLabel(id)
    } else {
      this.saveLabel(id)
    }
  },
  // 保存标注信息
  saveLabel(id) {
    api.request(this, '/keyVocabulary/saveCallout', {
      aid: this.options.aid,
      bid: id,
      sid: this.options.sid,
    }, false).then(res => {
      api.toast('标注成功')
      let path = `list[` + this.data.groupCurrent + `].list[` + this.data.questionCurrent + `].isMark`
      this.setData({
        [path]: 1,
        isMark: 1
      })
      wx.setStorageSync('listenings', this.data.list)
    })
  },
  delLabel(id) {
    api.request(this, '/keyVocabulary/delCallout', {
      aid: this.options.aid,
      bid: id,
      sid: this.options.sid,
    }, false).then(res => {
      api.toast('取消标注成功')
      let path = `list[` + this.data.groupCurrent + `].list[` + this.data.questionCurrent + `].isMark`
      this.setData({
        [path]: 0,
        isMark: 0
      })
      wx.setStorageSync('listenings', this.data.list)
    })
  },
  // 获取数据
  listListening(isPull) {
    const _this = this
    api.request(this, '/keyVocabulary/listOnlyFillAVacancy', {
      sid: this.options.sid,
      pType: 2
    }, isPull).then(res => {
      if (api.isEmpty(res.list)) {
        _this.finishAudioPageLoading()
        return
      }
      res.list.forEach(i => {
        i.list.forEach(j => {
          j['answerArr'] = j.referenceAnswer.split("|")
        })
      })
      wx.setStorageSync('listenings', res.list)
      _this.setData({
        schedule: ((1 / res.list.length) * 100),
        list: res.list
      })
      // 下载第一个音频并显示进度
      const audioUrl = res.list[0].list[0].pronunciationAudioUrl
      const downloadTask = wx.downloadFile({
        url: audioUrl,
        success: ({ tempFilePath, statusCode }) => {
          if (statusCode === 200) {
            audio.src = tempFilePath
            _this.setDataReady()
            _this.finishAudioPageLoading()
          }
        },
        fail() {
          // 下载失败时直接使用原始URL
          audio.src = audioUrl
          _this.setDataReady()
          _this.finishAudioPageLoading()
        }
      })
      downloadTask.onProgressUpdate((res) => {
        _this.updateAudioProgress(res.progress)
      })
    }).catch(() => {
      pageGuard.goBack(_this)
    })
  },
  // 判断是否最后一个
  isLastQuestion() {
    let ni = this.data.groupCurrent + 1
    let ll = this.data.list.length
    if (ni === ll) {
      this.saveQuickRecord()
    }
  },
  // 播放最后一个保存速刷记录
  saveQuickRecord() {
    api.request(this, '/keyVocabulary/saveRecord', {
      aid: this.options.aid,
      sid: this.options.sid,
    }, false)
  },
  toList: function () {
    // swiperCurrent 为 0 时是设置页，使用 list[0]；否则使用 list[swiperCurrent - 1]
    let index = this.data.swiperCurrent === 0 ? 0 : this.data.swiperCurrent - 1
    let paragraphId = this.data.list[index].id
    this.navigateTo('../word_list/word_list?sid=' + this.options.sid + "&paragraphId=" + paragraphId)
  },
})
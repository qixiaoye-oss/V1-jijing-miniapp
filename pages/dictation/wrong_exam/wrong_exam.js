let audio = null
let api = getApp().api
let nowPlayNumber = 1
const pageGuard = require('../../../behaviors/pageGuard')
const audioPageLoading = require('../../../behaviors/audioPageLoading')
const buttonGroupHeight = require('../../../behaviors/button-group-height')

Page({
  behaviors: [pageGuard.behavior, audioPageLoading, buttonGroupHeight],

  data: {
    paragraph: '',
    idx: 0,
    showArticle: false,
    baseShowArticle: false,
    tempShowArticle: false,
    selected: -1,
    schedule: 0,
    tipsStatus: false,
    showPl: true,
    padtop: 0,
    saveLoading: false,
    numberSetWinShow: false,
    playNumber: 2,
    changePlayNumber: 2,
    startRepeatPlay: false,
    canPlayFlag: false,
    swiperCurrent: 0,
    nowSign: ''
  },
  onLoad: function (options) {
    this.startAudioPageLoading()
    audio = wx.createInnerAudioContext()
    const that = this
    wx.getSystemInfo({
      success: function (res) {
        if (res.brand == 'iPhone') {
          that.setData({
            padtop: 8
          })
        }
      }
    });
    this.setData({
      status: 0,
      mode: options.mode
    })
    this.listListening(true)
    audio.onEnded(() => {
      if (this.data.startRepeatPlay && nowPlayNumber < this.data.playNumber) {
        nowPlayNumber = nowPlayNumber + 1
        // audio.src = list[this.data.idx].list[0].audioUrl
        audio.play()
        return
      }
      this.setData({
        status: 2
      })
    })
    audio.onPlay(() => {
      this.setData({
        status: 1,
      })
    })
    audio.onCanplay(() => {
      this.setData({
        canPlayFlag: true
      })
    })
    audio.onTimeUpdate(() => { })
  },
  onShow: function () {
    if (!wx.getStorageSync('close_listening_tips')) {
      this.setData({
        tipsStatus: true
      })
    }
    if (!api.isEmpty(this.data.index)) {
      let list = wx.getStorageSync('listenings')
      let index = Number(this.data.index) + 1
      let i = Number(this.data.index)
      this.setData({
        paragraph: list[i],
        idx: i,
        swiperCurrent: i,
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
  toList: function () {
    audio.pause()
    this.navigateTo('../wrong_sentence/wrong_sentence?id=' + this.options.id + "&paragraphId=" + this.data.paragraph.id)
  },
  toExplain: function () {
    this.navigateTo('../sentence_detail/sentence_detail?qid=' + this.data.paragraph.id + '&sid=' + this.options.sid)
  },
  onHide: function () {
    // this.zero()
  },
  onUnload: function () {
    this.zero()
    let tempUrl = wx.getStorageSync('tempAudioUrl')
    wx.getFileSystemManager().removeSavedFile({
      filePath: tempUrl
    })
    wx.removeStorageSync('tempAudioUrl')
  },
  startPlayAudio: function () {
    this.setData({
      startRepeatPlay: true,
    })
    nowPlayNumber = 1
    this.playAudio()
  },
  //开始播放
  playAudio: function () {
    if (!this.data.canPlayFlag) {
      api.toast("音频加载中，请稍后")
      return
    }
    let list = wx.getStorageSync('listenings')
    this.setData({
      paragraph: list[this.data.idx],
      status: 1,
      selected: 0,
    })
    audio.src = list[this.data.idx].list[this.data.selected].audioUrl
    audio.play()
  },
  //点击句子
  listenSentenceAgain: function (e) {
    this.stopAudio()
    let idx = e.currentTarget.dataset.idx
    let list = this.data.paragraph.list
    this.setData({
      startRepeatPlay: false,
      status: 1,
      selected: idx,
    })
    audio.src = list[idx].audioUrl
    audio.play()
  },
  //重新播放
  listenAgain: function () {
    this.setData({
      startRepeatPlay: false,
    })
    this.stopAudio()
    this.playAudio()
  },
  //播放下一个
  nextAudio() {
    // 停止当前的音频
    if (!audio.paused) {
      audio.stop()
    }
    let len = this.data.list.length
    let nidx = this.data.idx + 1
    if (nidx >= len) {
      api.toast('已经最后一句啦！')
      return
    }
    this.setData({
      idx: nidx,
      swiperCurrent: nidx,
      schedule: (((nidx + 1) / len) * 100),
      showArticle: false,
      startRepeatPlay: true,
    })
    nowPlayNumber = 1
    this.playAudio()
  },
  swiperSwitch(e) {
    this.autoFocus()
    if (e.detail.source !== "touch") {
      return
    }
    audio.stop()
    let len = this.data.list.length
    let nidx = e.detail.current
    this.setData({
      idx: nidx,
      swiperCurrent: nidx,
      schedule: (((nidx + 1) / len) * 100),
      showArticle: false,
      startRepeatPlay: true,
    })
    //
    nowPlayNumber = 1
    this.playAudio()
  },
  autoFocus() {
    this.setData({
      nowSign: ''
    })
    let timer = setTimeout(() => {
      this.setData({
        nowSign: this.data.list[this.data.swiperCurrent].id
      })
      clearTimeout(timer)
    }, 600);
  },
  //停止播放
  pauseAudio() {
    this.setData({
      startRepeatPlay: false,
    })
    nowPlayNumber = 1
    this.stopAudio()
  },
  stopAudio: function () {
    audio.stop()
    if (this.data.startRepeatPlay && nowPlayNumber < this.data.playNumber) {
      nowPlayNumber = nowPlayNumber + 1
      // audio.src = list[this.data.idx].list[0].audioUrl
      audio.play()
      return
    }
    this.setData({
      status: 2
    })
  },
  showArticle: function () {
    this.setData({
      showArticle: !this.data.showArticle
    })
  },
  close_tips() {
    wx.setStorageSync('close_listening_tips', "false")
    this.setData({
      tipsStatus: false
    })
  },
  changeArticleSetting() {
    this.setData({
      tempShowArticle: !this.data.tempShowArticle
    })
  },
  // 获取数据
  listListening(isPull) {
    const _this = this
    api.request(this, '/keyVocabulary/wrongList', {
      id: this.options.id,
    }, isPull).then(res => {
      wx.setStorageSync('listenings', res.list)
      _this.setData({
        list: res.list,
        paragraph: res.list[0],
        schedule: ((1 / res.list.length) * 100),
      })
      audio.src = res.list[0].list[0].audioUrl
      _this.autoFocus()
      _this.setDataReady()
      _this.finishAudioPageLoading()
      _this.updateButtonGroupHeight()
    }).catch(() => {
      pageGuard.goBack(_this)
    })
  },
  zero() {
    audio.stop()
    audio.destroy()
    this.setData({
      status: 0,
      selected: 0
    })
  },
  numberSet() {
    this.setData({
      numberSetWinShow: true
    })
  },
  cancel() {
    this.setData({
      tempShowArticle: this.data.baseShowArticle,
      numberSetWinShow: false,
      playNumber: this.data.playNumber
    })
  },
  check(e) {
    this.setData({
      changePlayNumber: e.detail.value
    })
  },
  handClick() {
    this.setData({
      numberSetWinShow: false,
      baseShowArticle: this.data.tempShowArticle,
      playNumber: this.data.changePlayNumber
    })
    wx.setStorageSync('AUDIO_PLAY_COUNT', this.data.changePlayNumber)
  },
  inputVal(e) {
    let list = wx.getStorageSync('listenings')
    let idx = e.currentTarget.dataset.idx
    list[this.data.idx].list[idx].userAnswer = e.detail
    let path = `paragraph.list[` + idx + `].userAnswer`
    this.setData({
      [path]: e.detail,
    })
    wx.setStorageSync('listenings', list)
  },
  // 保存成绩
  saveQue() {
    if (this.data.mode === 'paper') {
      this.redirectTo('../wrong_exam_record/wrong_exam_record?id=' + this.options.id)
      return
    }
    if (this.data.saveLoading) {
      return
    }
    this.setData({
      saveLoading: true
    })
    let list = wx.getStorageSync('listenings')
    let answers = []
    for (let i = 0; i < list.length; i++) {
      let clist = list[i].list
      for (let j = 0; j < clist.length; j++) {
        let answer = {
          questionId: clist[j].id,
          userChoice: clist[j].userAnswer,
          answer: clist[j].referenceAnswer
        }
        answers.push(answer)
      }
    }
    const _this = this
    api.request(this, '/keyVocabulary/saveWrongExercise', {
      id: this.options.id,
      mode: this.options.mode,
      exercise: answers
    }, true, 'POST').then(res => {
      _this.redirectTo('../wrong_exam_result/wrong_exam_result?sid=' + res.sid)
    }).catch(() => {
      _this.setData({ saveLoading: false })
    })
  },
})
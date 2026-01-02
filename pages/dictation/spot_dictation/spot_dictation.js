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
    wordCurrent: 0,
    showArticle: false,
    baseShowArticle: false,
    schedule: 0,
    tipsStatus: false,
    showPl: true,
    padTop: 0,
    saveLoading: false,
    numberSetWinShow: false,
    playNumber: 2,
    startRepeatPlay: false,
    canPlayFlag: false,
    swiperCurrent: 0,
    nowSign: '',
    articlePage: false,
    swiperHeight: '100%',
    shakeCorrectBtn: false, // "对答案"按钮晃动状态
  },
  onLoad: function (options) {
    audio = wx.createInnerAudioContext()
    const that = this
    wx.getSystemInfo({
      success: function (res) {
        if (res.brand == 'iPhone') {
          that.setData({
            padTop: 8
          })
        }
      }
    });
    this.setData({
      status: 0,
      mode: options.mode
    })
    this.startAudioPageLoading()
    this.listListening(true)
    audio.onEnded(() => {
      if (this.data.startRepeatPlay && nowPlayNumber < this.data.playNumber) {
        nowPlayNumber = nowPlayNumber + 1
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
      this.calculateProgress(this.data.index)
      this.setData({
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
    this.navigateTo('../sentence_list/sentence_list?sid=' + this.options.sid + "&paragraphId=" + this.data.paragraph.id)
  },
  onHide: function () { },
  onUnload: function () {
    this.zero()
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
      return
    }
    this.setData({
      status: 1,
    })
    audio.src = this.data.paragraph.list[0].audioUrl
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
  nextAudio(e) {
    // 按钮点击：只在 status === 2 时响应（防止重复点击）
    // Enter 键：任何时候都响应（可打断音频）
    if (e && e.type === 'tap' && this.data.status !== 2) {
      return
    }
    this.setData({ status: 1 })

    // 停止当前的音频
    if (!audio.paused) {
      audio.stop()
    }
    let len = this.data.list.length
    let nextWord = this.data.wordCurrent + 1
    if (nextWord >= len) {
      // 最后一张卡片：触发"对答案"按钮晃动动效
      this.setData({
        status: 2,
        shakeCorrectBtn: true
      })
      // 动画结束后重置晃动状态
      setTimeout(() => {
        this.setData({ shakeCorrectBtn: false })
      }, 600)
      return
    }
    this.calculateProgress(nextWord)
    this.setData({
      startRepeatPlay: true,
    })
    nowPlayNumber = 1
    this.playAudio()
  },
  swiperSwitch(e) {
    if (e.detail.source !== "touch") {
      return
    }
    audio.stop()
    let swiperCurrent = e.detail.current
    this.calculateProgress(swiperCurrent)
    this.setData({
      startRepeatPlay: true,
    })
    nowPlayNumber = 1
    this.playAudio()
  },
  autoFocus() {
    this.setData({
      nowSign: ''
    })
    let swiperCurrent = this.data.swiperCurrent
    let timer = setTimeout(() => {
      this.setData({
        nowSign: this.data.list[swiperCurrent].id
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
  closeTips() {
    wx.setStorageSync('close_listening_tips', "false")
    this.setData({
      tipsStatus: false
    })
  },
  // 获取数据
  listListening(isPull) {
    const _this = this
    api.request(this, '/keyVocabulary/list', {
      sid: this.options.sid,
      pType: 1
    }, isPull).then(res => {
      wx.setStorageSync('listenings', res.list)
      _this.setData({
        list: res.list,
        paragraph: res.list[0],
        schedule: (1 / res.list.length) * 100
      })
      // 下载音频并显示进度
      const audioUrl = res.list[0].list[0].audioUrl
      const downloadTask = wx.downloadFile({
        url: audioUrl,
        success: ({ tempFilePath, statusCode }) => {
          if (statusCode === 200) {
            audio.src = tempFilePath
            _this.setDataReady()
            _this.finishAudioPageLoading()
            _this.updateButtonGroupHeight()
          }
        },
        fail() {
          // 下载失败时直接使用原始URL
          audio.src = audioUrl
          _this.setDataReady()
          _this.finishAudioPageLoading()
          _this.updateButtonGroupHeight()
        }
      })
      downloadTask.onProgressUpdate((res) => {
        _this.updateAudioProgress(res.progress)
      })
      _this.autoFocus()
    }).catch(() => {
      pageGuard.goBack(_this)
    })
  },
  zero() {
    audio.stop()
    audio.destroy()
    this.setData({
      status: 0
    })
  },
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
    const { playNumber, showArticle } = e.detail
    this.setData({
      numberSetWinShow: false,
      baseShowArticle: showArticle,
      playNumber: playNumber
    })
  },
  inputVal(e) {
    let list = wx.getStorageSync('listenings')
    let idx = e.currentTarget.dataset.idx
    list[this.data.wordCurrent].list[idx].userAnswer = e.detail
    let path = `paragraph.list[` + idx + `].userAnswer`
    this.setData({
      [path]: e.detail,
    })
    wx.setStorageSync('listenings', list)
  },
  // 保存成绩
  saveQue() {
    if (this.data.mode === 'paper') {
      this.redirectTo('../paper_based_review/paper_based_review' + api.parseParams(this.options))
      return
    }
    if (this.data.saveLoading) {
      return
    }
    this.setData({
      saveLoading: true
    })
    const _this = this
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
    api.request(this, '/keyVocabulary/saveExercise', {
      sid: this.options.sid,
      aid: this.options.aid,
      questionType: 2,
      exercise: answers,
      mode: this.options.mode
    }, true, 'POST').then(res => {
      _this.redirectTo('../computer_based_review/computer_based_review?eid=' + res.eid)
    }).catch(() => {
      _this.setData({ saveLoading: false })
    })
  },
  //-------------计算进度
  calculateProgress(wordCurrent) {
    let list = wx.getStorageSync('listenings')
    let nowWordCurrent = Number(wordCurrent)
    this.setData({
      paragraph: list[nowWordCurrent],
      wordCurrent: nowWordCurrent,
      swiperCurrent: nowWordCurrent,
      schedule: ((nowWordCurrent + 1) / list.length) * 100,
      showArticle: false,
    })
    this.autoFocus()
  },
})
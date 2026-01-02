const api = getApp().api
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const smartLoading = require('../../../behaviors/smartLoading')
let audio

Page({
  behaviors: [pageGuard.behavior, pageLoading, smartLoading],
  data: {
    audioPlay: true,
    audioIndex: -1,
    wordList: [],
    showHidden: false
  },
  // 只在 onLoad 加载一次，无需刷新
  onLoad(options) {
    this.startLoading()
    this.listWord(options)
  },
  onShow() {
    // 仅初始化音频上下文
    const that = this
    audio = wx.createInnerAudioContext()
    audio.onEnded(() => {
      let path = `wordList[` + this.data.audioIndex + `].audioPlay`
      that.setData({
        [path]: 'waiting',
      })
    })
  },
  listWord(options) {
    const _this = this
    api.request(this, '/keyVocabulary/wrongWord', {
      ...options,
    }, false, 'GET', false).then(res => {
      res.list.forEach(item => {
        item['audioPlay'] = 'waiting'
        item['answerArr'] = item.referenceAnswer.split("|")
      })
      let list = [..._this.data.wordList, ...res.list]
      _this.setData({
        wordList: list
      })
      _this.markLoaded()
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.goBack(_this)
    })
  },
  operation(e) {
    let item = e.currentTarget.dataset.item
    if (item.isHidden == 1) {
      this.cancelCollection(item)
    } else {
      this.collection(item)
    }
  },
  collection(item) {
    let that = this
    wx.showActionSheet({
      itemList: ['隐藏单词'],
      success(res) {
        if (res.tapIndex === 0) {
          that.editDetail(false, item)
        }
      }
    })
  },
  cancelCollection(item) {
    let that = this
    wx.showActionSheet({
      itemList: ['取消隐藏单词'],
      success(res) {
        if (res.tapIndex === 0) {
          that.editDetail(true, item)
        }
      }
    })
  },
  editDetail(type, item) {
    let that = this
    api.request(this, '/keyVocabulary/hiddenWord', {
      id: item.id,
      type: type
    }, false).then(() => {
      let list = that.data.wordList
      let index = 0
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === item.id) {
          index = i;
          break;
        }
      }
      let path = `wordList[` + index + `].isHidden`
      that.setData({
        [path]: item.isHidden == 0 ? 1 : 0
      })
    })
  },
  playAudio(e) {
    audio.stop()
    if (this.data.audioIndex >= 0) {
      let path = `wordList[` + this.data.audioIndex + `].audioPlay`
      this.setData({
        [path]: 'waiting',
      })
    }
    let index = e.currentTarget.dataset.index
    let path = `wordList[` + index + `].audioPlay`
    audio.src = this.data.wordList[index].pronunciationAudioUrl
    this.setData({
      [path]: 'play',
      audioIndex: index
    })
    setTimeout(() => {
      audio.play()
    }, 500);
  },
  pauseAudio() {
    audio.stop()
    let path = `wordList[` + this.data.audioIndex + `].audioPlay`
    this.setData({
      [path]: 'waiting',
    })
  },
  review() {
    api.modal("本次打卡时间", this.getNowDate()).then(() => {
      api.request(this, '/keyVocabulary/reviewRecord', {
        id: this.options.id
      }, false).then(() => {
        // 显示打卡成功提示，2秒后返回上一页
        api.toast("打卡成功")
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      })
    })
  },
  getNowDate() {
    var date = new Date();
    var year = date.getFullYear(); //年份
    var month = date.getMonth() + 1; //月份
    var day = date.getDate(); //日
    var hour = function () { //获取小时
      return date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    }
    var minute = function () { //获取分钟
      return date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    }
    var second = function () { //获取秒数
      return date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    }
    return year + '-' + month + '-' + day + ' ' + hour() + ':' + minute() + ':' + second()
  },
  showHiddenWord() {
    this.setData({
      showHidden: !this.data.showHidden
    })
  }
})
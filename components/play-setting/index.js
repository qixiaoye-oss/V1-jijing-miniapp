/**
 * play-setting 播放设置弹窗组件
 * @description 用于听写页面的播放设置，包括播放次数、文章显示、自动播放等选项
 */
Component({
  properties: {
    // 是否显示弹窗
    show: {
      type: Boolean,
      value: false
    },
    // 播放次数
    playNumber: {
      type: Number,
      value: 2
    },
    // 是否显示文章（常开）
    showArticle: {
      type: Boolean,
      value: false
    },
    // 是否显示自动播放选项
    showAutoPlay: {
      type: Boolean,
      value: false
    },
    // 自动播放状态
    autoPlay: {
      type: Boolean,
      value: true
    }
  },

  data: {
    tempPlayNumber: 2,
    tempShowArticle: false,
    tempAutoPlay: true
  },

  observers: {
    'show': function(show) {
      if (show) {
        // 弹窗打开时，用当前值初始化临时值
        this.setData({
          tempPlayNumber: this.properties.playNumber,
          tempShowArticle: this.properties.showArticle,
          tempAutoPlay: this.properties.autoPlay
        })
      }
    }
  },

  methods: {
    // 选择播放次数
    onPlayNumberChange(e) {
      this.setData({
        tempPlayNumber: Number(e.detail.value)
      })
    },

    // 切换文章显示
    onArticleShowTap() {
      this.setData({
        tempShowArticle: !this.data.tempShowArticle
      })
    },

    // 切换自动播放
    onAutoPlayChange(e) {
      this.setData({
        tempAutoPlay: e.detail.value
      })
    },

    // 取消
    onCancel() {
      this.triggerEvent('cancel')
    },

    // 确认
    onConfirm() {
      wx.setStorageSync('AUDIO_PLAY_COUNT', this.data.tempPlayNumber)
      this.triggerEvent('confirm', {
        playNumber: this.data.tempPlayNumber,
        showArticle: this.data.tempShowArticle,
        autoPlay: this.data.tempAutoPlay
      })
    },

    // 点击遮罩
    onOverlayClick() {
      this.onCancel()
    }
  }
})

/**
 * audioBehavior - 音频播放控制行为
 * @description 提供基础的音频播放状态管理和重播计数逻辑
 * @usage 在页面中引入并添加到 behaviors 数组
 *
 * 使用方式:
 * 1. 在 onLoad 中调用 this.initAudio() 初始化音频
 * 2. 在 onUnload 中调用 this.destroyAudio() 销毁音频
 * 3. 通过 this.audio 访问音频实例
 * 4. 可选：覆盖 onAudioEnded() 方法实现自定义的播放结束逻辑
 */

let nowPlayNumber = 1

module.exports = Behavior({
  data: {
    // 播放状态: 0-未播放, 1-播放中, 2-播放完成
    status: 0,
    // 是否开启重复播放
    startRepeatPlay: false,
    // 音频是否准备就绪
    canPlayFlag: false,
    // 播放次数
    playNumber: 2,
  },

  methods: {
    /**
     * 初始化音频实例和事件监听
     * 应在 onLoad 中调用
     */
    initAudio() {
      this.audio = wx.createInnerAudioContext()

      // 播放结束事件
      this.audio.onEnded(() => {
        if (this.data.startRepeatPlay && nowPlayNumber < this.data.playNumber) {
          nowPlayNumber = nowPlayNumber + 1
          this.audio.play()
          return
        }
        this.setData({ status: 2 })
        // 调用页面自定义的播放结束回调
        if (typeof this.onAudioEnded === 'function') {
          this.onAudioEnded()
        }
      })

      // 开始播放事件
      this.audio.onPlay(() => {
        this.setData({ status: 1 })
      })

      // 音频准备就绪事件
      this.audio.onCanplay(() => {
        this.setData({ canPlayFlag: true })
      })

      // 时间更新事件（保留空实现，某些场景可能需要）
      this.audio.onTimeUpdate(() => {})

      // 读取存储的播放次数设置
      const playCount = wx.getStorageSync('AUDIO_PLAY_COUNT')
      if (playCount) {
        this.setData({ playNumber: playCount })
      }
    },

    /**
     * 销毁音频实例
     * 应在 onUnload 中调用
     */
    destroyAudio() {
      if (this.audio) {
        this.audio.stop()
        this.audio.destroy()
        this.audio = null
      }
      this.setData({ status: 0 })
    },

    /**
     * 播放音频
     * @param {string} src 音频地址
     */
    playAudioSrc(src) {
      if (!this.audio || !src) return
      this.audio.src = src
      this.setData({ status: 1 })
      this.audio.play()
    },

    /**
     * 停止播放
     */
    stopAudio() {
      if (!this.audio) return
      this.audio.stop()
      if (this.data.startRepeatPlay && nowPlayNumber < this.data.playNumber) {
        nowPlayNumber = nowPlayNumber + 1
        this.audio.play()
        return
      }
      this.setData({ status: 2 })
    },

    /**
     * 暂停播放（同时关闭重复播放）
     */
    pauseAudio() {
      this.setData({ startRepeatPlay: false })
      nowPlayNumber = 1
      this.stopAudio()
    },

    /**
     * 开始播放（设置重复播放标记）
     */
    startRepeatPlayAudio() {
      this.setData({ startRepeatPlay: true })
      nowPlayNumber = 1
    },

    /**
     * 重置播放计数（用于重新播放）
     */
    resetPlayCount() {
      this.setData({ startRepeatPlay: false })
      nowPlayNumber = 1
    }
  }
})

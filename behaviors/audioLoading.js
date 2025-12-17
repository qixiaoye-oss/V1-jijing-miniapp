/**
 * 音频加载进度 Behavior
 * 用于显示音频下载的圆饼进度
 */
module.exports = Behavior({
  data: {
    // 音频下载进度 (0-100)，默认100表示不显示遮罩
    audioDownProgress: 100
  },

  methods: {
    /**
     * 开始音频加载（重置进度为0）
     */
    startAudioLoading() {
      this.setData({ audioDownProgress: 0 })
    },

    /**
     * 更新音频加载进度
     * @param {number} progress - 进度值 (0-100)
     */
    updateAudioProgress(progress) {
      this.setData({ audioDownProgress: progress })
    },

    /**
     * 完成音频加载
     */
    finishAudioLoading() {
      this.setData({ audioDownProgress: 100 })
    }
  }
})

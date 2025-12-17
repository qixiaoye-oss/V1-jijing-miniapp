/**
 * 页面加载进度条 Behavior
 * 用于在页面数据加载时显示顶部进度条动画
 */
module.exports = Behavior({
  data: {
    // 加载进度条状态
    loading: false,
    loadProgress: 0
  },

  methods: {
    /**
     * 开始加载进度条动画
     */
    startLoading() {
      this.setData({
        loading: true,
        loadProgress: 0
      })
      this.simulateProgress()
    },

    /**
     * 模拟进度增长动画
     * 进度增长速度逐渐变慢，最多到90%
     */
    simulateProgress() {
      const that = this
      let progress = 0
      // 清除之前的定时器
      if (this.progressTimer) {
        clearInterval(this.progressTimer)
      }
      this.progressTimer = setInterval(() => {
        if (progress < 90) {
          // 模拟进度增长，速度逐渐变慢
          const increment = Math.max(1, (90 - progress) / 10)
          progress = Math.min(90, progress + increment)
          that.setData({
            loadProgress: progress
          })
        }
      }, 100)
    },

    /**
     * 完成加载，进度条快速到100%后隐藏
     */
    finishLoading() {
      // 清除模拟进度的定时器
      if (this.progressTimer) {
        clearInterval(this.progressTimer)
        this.progressTimer = null
      }
      // 快速完成到100%
      this.setData({
        loadProgress: 100
      })
      // 延迟隐藏进度条
      setTimeout(() => {
        this.setData({
          loading: false,
          loadProgress: 0
        })
      }, 300)
    }
  }
})

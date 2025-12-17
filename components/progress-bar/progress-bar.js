/**
 * Progress Bar Component
 * @description 可复用的进度条组件，支持 CSS 变量主题定制
 * @version 1.0.0
 */
Component({
  properties: {
    current: {
      type: Number,
      value: 1
    },
    total: {
      type: Number,
      value: 1
    }
  },

  data: {
    percent: 100,
    textMargin: '0px'
  },

  observers: {
    'current, total': function (current, total) {
      const validCurrent = Math.max(1, current || 1)
      const validTotal = Math.max(1, total || 1)
      const percent = (validCurrent / validTotal) * 100
      this.setData({
        percent,
        textMargin: this.calcTextMargin(percent)
      })
    }
  },

  methods: {
    /**
     * 计算进度文字的左边距，防止溢出
     * @param {number} percent - 当前百分比
     * @returns {string} CSS margin-left 值
     */
    calcTextMargin(percent) {
      return `max(0px, min(calc(${percent}% - 22px), calc(100% - 44px)))`
    }
  }
})

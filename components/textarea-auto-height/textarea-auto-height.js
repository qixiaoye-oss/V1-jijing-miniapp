let api = getApp().api
Component({
  properties: {
    value: {
      type: String
    },
    width: {
      type: String,
      value: '550rpx'
    },
  },
  lifetimes: {
    attached() {
      let that = this
      wx.getSystemInfo({
        success: function (res) {
          if (res.brand == 'iPhone') {
            that.setData({
              padtop: 9
            })
          }
        }
      });
    }
  },
  data: {
    height: 50,
    showPl: true,
    padtop: 0
  },
  methods: {
    inputFocus() {
      this.setData({
        showPl: false
      })
    },
    inputBlur() {
      if (api.isEmpty(this.data.value)) {
        this.setData({
          showPl: true
        })
      }
    },
    linechange(e) {
      this.setData({
        height: (e.detail.lineCount) * 50
      })
    },
    inputVal(e) {
      this.triggerEvent('input', e.detail.value)
      this.setData({
        value: e.detail.value,
      })
    }
  }
})
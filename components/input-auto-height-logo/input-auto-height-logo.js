let api = getApp().api
Component({
  properties: {
    value: {
      type: String
    },
    nowSign: {
      type: String
    },
    sign: {
      type: String
    },
    labelModel: {
      type: String,
      value: '1'
    }
  },
  observers: {
    nowSign(val) {
      const _this = this
      wx.getSystemInfo({
        success: function (res) {
          if (res.platform == 'windows' || res.platform == 'mac') {
            _this.setData({
              autoFocus: val == _this.data.sign
            })
          }
          if (res.platform == 'ios' && res.model.indexOf("iPad") > -1) {
            _this.setData({
              autoFocus: val == _this.data.sign
            })
          }
        }
      });
    }
  },
  lifetimes: {
    attached() {
      let that = this
      wx.getSystemInfo({
        success: function (res) {
          let padtop = 0
          if (res.brand == 'iPhone') {
            padtop = 8
          }
          that.setData({
            platform: res.platform,
            padtop: padtop,
          })
        }
      });
    }
  },
  data: {
    height: 50,
    showPl: true,
    padtop: 0,
    platform: "",
    autoFocus: false,
    lastEnterTime: 0
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
    },
    inputOver(e) {
      if (this.data.platform === 'android') {
        return
      }
      let time = new Date().getTime();
      let intervalTime = time - this.data.lastEnterTime
      if (intervalTime > 1000) {
        this.setData({
          lastEnterTime: time,
        })
        this.triggerEvent('enter', e.detail.value)
      }
    }
  }
})
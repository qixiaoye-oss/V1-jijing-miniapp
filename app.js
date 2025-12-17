var api = require('/utils/api')
var iaudio = wx.createInnerAudioContext()
var eaudio = wx.createInnerAudioContext()
const CustomHook = require('spa-custom-hooks')
let userData = {
  login: false
}
CustomHook.install({
  'Login': {
    name: 'Login',
    watchKey: 'login',
    deep: true,
    onUpdate(val) {
      return val;
    }
  }
}, userData)
App({
  api: api,
  iaudio: iaudio,
  eaudio: eaudio,
  onShow: function () {
    const accountInfo = wx.getAccountInfoSync();
    console.log(accountInfo.miniProgram) // 小程序本地版本号
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            api.modal('更新提示', '新版本已经准备好，是否重启应用？', false).then(res => {
              updateManager.applyUpdate()
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      api.modal('提示', '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。', false)
    }
  },
  onLaunch: function () {
    if (wx.setScreenBrightness) {
      // 保持屏幕常亮 true / false
      wx.setKeepScreenOn({
        keepScreenOn: true
      });
    }
    // 自动登录
    wx.login().then(data => {
      api.request(this, '/user/v1/login', {
        code: data.code
      }, true, false).then(res => {
        wx.setStorageSync('token', res.token)
        userData.login = true
      })
    })
    // 静音可以播放
    wx.setInnerAudioOption({
      mixWithOther: false,
      obeyMuteSwitch: false
    })
    if (!wx.getStorageSync('AUDIO_PLAY_COUNT')) {
      wx.setStorageSync('AUDIO_PLAY_COUNT', 2)
    }
  }
})
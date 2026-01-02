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

  // ============ Smart Loading 相关 ============
  // 后台返回标记
  _fromBackground: false,
  // 图片预览返回标记
  _fromImagePreview: false,
  // 后台隐藏时间
  _hideTime: 0,
  // 首页数据预加载缓存
  globalData: {
    homeDataCache: null,
    popularScienceCache: null,
    // 加载阶段：connecting -> logging -> ready
    loadingStage: 'connecting'
  },

  onShow: function () {
    // 标记从后台返回
    if (this._hideTime > 0) {
      this._fromBackground = true
    }
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

  onHide: function () {
    // 记录隐藏时间，用于判断后台返回
    this._hideTime = Date.now()
  },

  onLaunch: function () {
    if (wx.setScreenBrightness) {
      // 保持屏幕常亮 true / false
      wx.setKeepScreenOn({
        keepScreenOn: true
      });
    }
    // 自动登录
    const that = this
    // 更新加载阶段：开始登录
    that.globalData.loadingStage = 'logging'
    wx.login().then(data => {
      api.request(this, '/user/v1/login', {
        code: data.code
      }, true, false).then(res => {
        wx.setStorageSync('token', res.token)
        userData.login = true
        // 更新加载阶段：登录成功，开始加载数据
        that.globalData.loadingStage = 'ready'
        // 登录成功后预加载首页数据
        that._preloadHomeData()
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
  },

  /**
   * 预加载首页数据
   * 在登录成功后并行请求首页两个接口，缓存结果
   */
  _preloadHomeData: function () {
    const that = this

    // 并行请求首页数据
    Promise.all([
      // 首页列表数据
      api.request(null, '/v2/home/list', {}, false, false)
        .then(res => {
          that.globalData.homeDataCache = {
            data: res,
            timestamp: Date.now()
          }
        })
        .catch(() => {
          // 预加载失败不影响正常流程
        }),

      // 科普数据
      api.request(null, '/popular/science/v1/miniapp/home', {}, false, false)
        .then(res => {
          that.globalData.popularScienceCache = {
            data: res,
            timestamp: Date.now()
          }
        })
        .catch(() => {
          // 预加载失败不影响正常流程
        })
    ])
  },

  /**
   * 获取预加载的首页数据
   * @param {string} type - 数据类型：'home' | 'popularScience'
   * @param {number} maxAge - 缓存有效期（毫秒），默认30秒
   * @returns {Object|null} 缓存数据或 null
   */
  getPreloadCache: function (type, maxAge = 30000) {
    const cacheKey = type === 'home' ? 'homeDataCache' : 'popularScienceCache'
    const cache = this.globalData[cacheKey]

    if (!cache) return null

    // 检查缓存是否过期
    if (Date.now() - cache.timestamp > maxAge) {
      this.globalData[cacheKey] = null
      return null
    }

    // 使用后清除缓存，避免重复使用过期数据
    this.globalData[cacheKey] = null
    return cache.data
  }
})
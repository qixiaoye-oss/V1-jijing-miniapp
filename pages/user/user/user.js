const api = require('../../../utils/api')
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')
const smartLoading = require('../../../behaviors/smartLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading, smartLoading],
  data: {
    version: '1.0.0',
  },
  onShow: function () {
    // 只在首次加载时请求数据（用户信息不需要频繁刷新）
    const isFirstLoad = !this.data._hasLoaded
    if (!isFirstLoad) {
      return
    }

    this.startLoading()
    this.getUserInfo()

    // 获取版本号（仅正式版小程序有 version 字段）
    const accountInfo = wx.getAccountInfoSync()
    const version = accountInfo.miniProgram.version
    if (version) {
      this.setData({ version })
    }
  },
  toUpdateUserInfo() {
    this.navigateTo('/pages/user/login/login')
  },
  // 查看权限有效期
  showRole() {
    this.setData({
      showPopup: true
    })
  },
  // 接口调用-获取数据
  getUserInfo() {
    const _this = this
    api.request(this, '/user/v1/user/info', {}, true).then(() => {
      // "游客" 显示为 "免费版"
      if (_this.data.permission_duration === '游客') {
        _this.setData({ permission_duration: '免费版' })
      }
      _this.markLoaded()
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.finishProgress(_this)
    })
  },
})

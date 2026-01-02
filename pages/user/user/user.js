var api = require('../../../utils/api')
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading],
  data: {
    version: '1.0.0',
  },
  onShow: function () {
    this.startLoading()
    this.getUserInfo()
    // 获取版本号（仅正式版小程序有 version 字段）
    const accountInfo = wx.getAccountInfoSync()
    const version = accountInfo.miniProgram.version
    if (version) {
      this.setData({ version })
    }
  },
  onShareAppMessage: function () {
    return api.share('考雅机经Open题库', this)
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
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.finishProgress(_this)
    })
  },
})

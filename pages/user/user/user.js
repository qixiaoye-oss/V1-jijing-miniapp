var api = require('../../../utils/api')
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading],
  data: {
    version: '1.0.2',
  },
  onShow: function () {
    this.startLoading()
    this.getUserInfo()
    const miniProgram = wx.getAccountInfoSync();
    this.setData({
      version: miniProgram.miniProgram.version,
    })
  },
  onShareAppMessage: function () {
    return api.share('用户中心', this)
  },
  toUpdateUserInfo() {
    this.navigateTo('/pages/user/login/login')
  },
  // 用户权限管理
  toUpdateAuth() {
    this.navigateTo('/pages/teacher/widget/widget')
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
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.finishProgress(_this)
    })
  },
})

var api = require('../../../utils/api')
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading],
  data: {
    checked: false
  },
  onReady() {
    this.startLoading()
    this.loadUserInfo()
  },
  loadUserInfo() {
    const _this = this
    api.request(this, '/user/v1/user/info', {}, true).then(() => {
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.finishProgress(_this)
    })
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    const _this = this
    api.uploadFileToOSS(avatarUrl, 'user/avatar/', this).then(res => {
      _this.setData({
        [`user.headUrl`]: res
      })
    }).catch(() => {
      // 上传失败，已在 api 中 toast
    })
  },
  formSubmit(e) {
    const {
      nickName,
      headUrl
    } = e.detail.value
    this.uploadHead(headUrl, nickName)
  },
  //上传头像
  uploadHead(headUrl, nickName) {
    if (api.isEmpty(headUrl)) {
      api.toast('请选择用户头像')
      return
    }
    if (api.isEmpty(nickName)) {
      api.toast('请填写用户昵称')
      return
    }
    const _this = this
    _this.updateUser(headUrl, nickName);
  },
  updateUser(headUrl, nickName) {
    const _this = this
    api.request(this, '/user/v1/user/update', {
      nickName: nickName,
      avatarUrl: headUrl
    }, true, "POST").then(res => {
      _this.navigateBack()
    }).catch(() => {
      // 更新失败，已在 api 中 toast
    })
  }
})
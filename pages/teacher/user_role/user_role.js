const api = getApp().api
const pageGuard = require('../../../behaviors/pageGuard')
const pageLoading = require('../../../behaviors/pageLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading],
  data: {
    inputVal: "",
    hideScroll: true,
    inputShowed: true,
    userList: [],
    roleList: [],
  },
  onLoad() {
    this.setDataReady()
  },
  inputTyping(e) {
    this.cancelTimer('searchUser')
    this.setData({
      inputVal: e.detail.value,
      hideScroll: false,
      inputShowed: true
    })
    this.registerTimer('searchUser', () => {
      this.listUser()
    }, 1000)
  },
  clearInput() {
    this.cancelTimer('searchUser')
    this.setData({
      inputVal: "",
      hideScroll: true,
      inputShowed: true
    })
  },
  hideInput() {
    this.cancelTimer('searchUser')
    this.setData({
      inputVal: "",
      hideScroll: true,
      inputShowed: true,
      userList: []
    });
  },
  offline: function (e) {
    this.setData({
      hideScroll: true,
      inputShowed: false,
      userId: e.currentTarget.id,
      userName: e.currentTarget.dataset.item.nickName,
    });
    // 查询已经关联的角色
    this.listUserRole(e.currentTarget.id)
  },
  listUser() {
    api.request(this, '/user/v1/check/user', {
      no: this.data.inputVal
    }, true).catch(() => {
      // 搜索失败，已在 api 中 toast
    })
  },
  listUserRole(userId) {
    api.request(this, '/user/v1/role/user', {
      userId: userId
    }, true).catch(() => {
      // 查询失败，已在 api 中 toast
    })
  },
  submit: function (e) {
    let param = {
      roleUser: e.detail.value.roleResource.join(','),
      userId: e.detail.value.userId
    }
    api.request(this, '/user/v1/save/user/role', param, true, "POST").then(res => {
      api.toast("保存成功")
    }).catch(() => {
      // 保存失败，已在 api 中 toast
    })
  },
})
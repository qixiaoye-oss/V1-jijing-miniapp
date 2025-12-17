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
    permissionsList: [],
  },
  onLoad() {
    this.startLoading()
    this.listDict()
  },
  onReady() { },
  onShow() { },
  onHide() { },
  onUnload() { },
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
  listDict() {
    const _this = this
    api.request(this, '/sys/albumLabel', {}, true).then(() => {
      _this.setDataReady()
      _this.finishLoading()
    }).catch(() => {
      pageGuard.finishProgress(_this)
    })
  },
  listUserRole(userId) {
    let that = this
    api.request(this, '/user/v1/permissions/user', {
      userId: userId
    }, true).then(res => {
      let list = res.permissionsList
      if (list.length == 0) {
        list.push({
          resourceLabel: '',
          effectiveDate: '',
          expiryDate: '',
          dictIndex: -1
        })
      } else {
        for (let i = 0; i < list.length; i++) {
          const p = list[i];
          that.data.sheetList.forEach((dict, index) => {
            if (dict.value == p.resourceLabel) {
              p['dictIndex'] = index
            }
          });
        }
      }
      that.setData({
        permissionsList: list
      })
    }).catch(() => {
      // 查询失败，已在 api 中 toast
    })
  },
  labelChange(e) {
    let index = e.currentTarget.dataset.index
    let path1 = `permissionsList[` + index + `].resourceLabel`
    let path2 = `permissionsList[` + index + `].dictIndex`
    this.setData({
      [path1]: this.data.sheetList[e.detail.value].value,
      [path2]: e.detail.value
    })
  },
  effectiveDateChange(e) {
    let index = e.currentTarget.dataset.index
    let path = `permissionsList[` + index + `].effectiveDate`
    this.setData({
      [path]: e.detail.value,
    })
  },
  expiryDateChange(e) {
    let index = e.currentTarget.dataset.index
    let path = `permissionsList[` + index + `].expiryDate`
    this.setData({
      [path]: e.detail.value,
    })
  },
  addList() {
    let list = this.data.permissionsList
    list.push({
      resourceLabel: '',
      effectiveDate: '',
      expiryDate: '',
      dictIndex: -1
    })
    this.setData({
      permissionsList: list
    })
  },
  submit: function (e) {
    let that = this
    let list = []
    this.data.permissionsList.forEach(item => {
      list.push({
        ...item,
        userId: that.data.userId
      })
    })
    api.request(this, '/user/v1/save/permissions', list, true, "POST").then(res => {
      api.toast("保存成功")
    }).catch(() => {
      // 保存失败，已在 api 中 toast
    })
  },
})
// pages/me/me.js
Page({
  data: {
    userInfo: {}
  },

  /**
   * 页面加载
   */
  onLoad() {
    // 获取本地的用户信息
    let userInfo = wx.getStorageSync('currentUser')
    this.setData({ userInfo })
  }
})

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
  },

  // 查看行程信息
  myPost() {
    wx.navigateTo({
      url: '/pages/myPost/myPost'
    })
  }
})

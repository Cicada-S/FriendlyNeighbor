// pages/community/community.js
const app = getApp()

const db = wx.cloud.database()
const Community = db.collection('Community')

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    communityList: [] // 小区列表
  },

  /**
   * 页面显示
   */
  onShow() {
    // 获取小区
    this.getCommunity()
  },

  // 获取小区
  getCommunity() {
    Community.get().then(res => {
      this.setData({
        communityList: res.data
      })
    })
  },

  // 跳转到添加小区
  toAddCommunity() {
    wx.navigateTo({
      url: '/pages/addCommunity/addCommunity'
    })
  }
})

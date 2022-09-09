// pages/community/community.js
const app = getApp()

const db = wx.cloud.database()
const Community = db.collection('Community')

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    search: '', // 搜索
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

  // 确定搜索时触发
  onSearch(event) {
    wx.showToast({
      title: `搜索内容${event.detail}`,
      icon: 'none',
      duration: 1500
    })
  },

  // 跳转到添加小区
  onClick() {
    wx.navigateTo({
      url: '/pages/addCommunity/addCommunity'
    })
  }
})

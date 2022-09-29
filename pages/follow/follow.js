// pages/follow/follow.js
const app = getApp()

const db = wx.cloud.database()
const CommunityOfInterest = db.collection('CommunityOfInterest')

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
  async getCommunity() {
    let _openid = wx.getStorageSync('currentUser')._openid
    // 获取小区
    let { data } = await CommunityOfInterest.where({_openid}).get()
    this.setData({ communityList: data })
  },

  // 取消关注
  unFollow(event) {
    wx.showModal({
      title: '提示',
      content: '确定取消关注该小区吗？',
      success (res) {
        if (res.confirm) {
          console.log('取消关注', event.currentTarget.id)
        }
      }
    })
  }
})

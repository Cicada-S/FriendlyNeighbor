// pages/me/me.js
const db = wx.cloud.database()
const UserCommunity = db.collection('UserCommunity')

Page({
  data: {
    userInfo: {}, // 用户信息
    community: {} // 用户小区
  },

  /**
   * 页面加载
   */
  onLoad() {
    // 获取本地的用户信息
    let userInfo = wx.getStorageSync('currentUser')
    this.setData({ userInfo })
    this.getUserCommunity(userInfo._openid)
  },

  // 获取所在的小区
  async getUserCommunity(_openid) {
    let { data } = await UserCommunity.where({_openid}).get() 
    data.forEach(item => {
      // 判断是否已经加入小区
      if(!item.status) {
        this.setData({community: item})
        wx.setStorageSync('myCommunity', item)
      }
    })
  },

  // 查看行程信息
  myPost() {
    wx.navigateTo({
      url: '/pages/myPost/myPost'
    })
  },

  // 好物
  myOldThings() {
    wx.navigateTo({
      url: '/pages/myOldThings/myOldThings'
    })
  },

  // 关注
  myInterest() {
    wx.navigateTo({
      url: '/pages/follow/follow'
    })
  },

  
  // 意见 建议
  suggestion() {
    wx.showToast({
      title: '请加微信 188 2590 6482 沟通！',
      icon: 'none',
      duration: 5000
    })
  },
  
  // 跳转到管理小区
  toCommunity() {
    wx.navigateTo({
      url: '/pages/community/community'
    })
  },

  // 跳转到我的小区
  toMyCommunity() {
    return;
    if(this.data.community) {
      wx.navigateTo({
        url: '/pages/myCommunity/myCommunity'
      })
    } else {
      wx.navigateTo({
        url: '/pages/community/community?type=join'
      })
    }
  }
})

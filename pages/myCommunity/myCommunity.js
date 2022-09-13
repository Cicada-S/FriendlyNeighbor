// pages/myCommunity/myCommunity.js
Page({
  data: {

  },

  /**
   * 页面加载
   */
  onLoad(options) {
    console.log('options', options)
  },
  
  // 加入小区
  joinCommunity() {
    wx.navigateTo({
      url: '/pages/community/community?type=join'
    })
  }
})

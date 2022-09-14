// pages/myCommunity/myCommunity.js
Page({
  data: {
    communityInfo: {
      qrCodePath: '',
      name: '三水一品',
      province: '广东省',
      city: '佛山市',
      county: '三水区'
    }
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    console.log('options', options)
  },
  
  // 更换小区
  changeCommunity() {
    wx.navigateTo({
      url: '/pages/community/community?type=join'
    })
  }
})

// pages/myCommunity/myCommunity.js
const db = wx.cloud.database()
const UserCommunity = db.collection('UserCommunity')

Page({
  data: {
    communityInfo: {
      qrCodePath: '',
      name: '三水一品',
      province: '广东省',
      city: '佛山市',
      county: '三水区'
    },
    application: {}
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    console.log('options', options)
  },

  onShow() {
    this.getUserCommunity()
  },
  
  // 获取申请表
  async getUserCommunity() {
    let _openid = wx.getStorageSync('currentUser')._openid
    let { data } = await UserCommunity.where({_openid}).get()
    console.log('result', result)
    /* data.forEach(item => {
      if(!item.status) {
        this.setData({})
      }
    }) */
  },

  // 更换小区
  changeCommunity() {
    wx.navigateTo({
      url: '/pages/community/community?type=join'
    })
  }
})

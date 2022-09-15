// pages/myCommunity/myCommunity.js
const db = wx.cloud.database()
const UserCommunity = db.collection('UserCommunity')
const Community = db.collection('Community')

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
    // 1. 获取关系表
    let { data } = await UserCommunity.where({_openid}).get()

    // 2. 遍历获取到的数据 判断数据的status
    data.forEach(async item => {
      if(!item.status) {
        // 2.1 如果 status === 0 则根据 communityId 获取社区表
        let { data } = await Community.where({_id: item.communityId}).get()
        this.setData({ communityInfo: data[0] })
      } else {
        // 2.2 如果 status !== 0 则将数据渲染到页面的申请中模块
        this.setData({ application: item })
      }
    })

  },

  // 更换小区
  changeCommunity() {
    wx.navigateTo({
      url: '/pages/community/community?type=join'
    })
  }
})

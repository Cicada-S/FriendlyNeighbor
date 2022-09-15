// pages/myCommunity/myCommunity.js
const db = wx.cloud.database()
const UserCommunity = db.collection('UserCommunity')
const Community = db.collection('Community')

Page({
  data: {
    communityInfo: {}, // 所在的小区
    application: {} // 申请的小区
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    console.log('options', options)
  },

  /**
   * 页面显示
   */
  onShow() {
    // 获取申请表
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
  },

  // 取消申请
  onCancel(event) {
    wx.showModal({
      title: '提示',
      content: '是否取消加入该小区的申请！',
      success: (res) => {
        if (res.confirm) {
          // 删除申请数据表 并更新data
          UserCommunity.doc(event.target.id).remove()
          this.setData({ application: {} })
        }
      }
    })
  },

  // 驳回申请
  onReject(event) {
    console.log('event', event)
  },

  // 通过申请
  onAdopt(event) {
    console.log('event', event)
  },

  // 踢除成员
  onKick(event) {
    console.log('event', event)
  }
})

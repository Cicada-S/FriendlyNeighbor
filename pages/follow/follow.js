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
    let { communityList } = this.data
    let id = event.target.id
    let _openid = wx.getStorageSync('currentUser')._openid

    // 删除数据表
    CommunityOfInterest.where({ _openid, communityId: id}).remove()
    .then(res => {
      console.log('res', res)
    })

    // 将data中的该条数据删除
    let newCommunityList = communityList.filter(item => item._id !== id)
    // 更新data
    this.setData({communityList: newCommunityList})


    /* wx.showModal({
      title: '提示',
      content: '确定取消关注该小区吗？'
    }).then(res => {
      if (res.confirm) {
        
      }
    }) */
  },

  // 跳转到未关注的小区
  toNotFollow() {
    wx.navigateTo({
      url: '/pages/notFollow/notFollow'
    })
  }
})

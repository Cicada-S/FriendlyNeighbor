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
  getCommunity(value) {
    // 对name字段模糊查询
    let data = {}
    if(value) data.name =  db.RegExp({ regexp: value, options: 'i'})
 
    // 获取小区
    Community.where(data).get().then(res => {
      this.setData({
        communityList: res.data
      })
    })
  },

  // 确定搜索时触发
  async onSearch(event) {
    wx.showLoading({
      title: '查找中...',
    })
    await this.getCommunity(event.detail)
    wx.hideLoading()
  },

  // 跳转到添加小区
  onClick() {
    wx.navigateTo({
      url: '/pages/addCommunity/addCommunity'
    })
  }
})

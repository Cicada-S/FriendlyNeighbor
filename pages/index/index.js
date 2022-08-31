// index.js
import { toDates } from '../../utils/util'
import { getdate } from '../../utils/pastTime'

const db = wx.cloud.database()
const user = db.collection('User')

Page({
  data: {
    search: '', // 搜索
    postList: [], // 帖字列表
  },

  /**
   * 页面加载
   */
  onLoad() {
    // 判断用户是否登录过
    this.getUserInfo()
    // 获取帖子
    this.getPostList()
  },

  // 判断用户是否登录过
  getUserInfo() {
    user.get().then(res => {
      if(res.data.length === 1) {
        wx.setStorageSync('currentUser', res.data[0])
      } else {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    })
  },

  // 搜索
  search() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  // 获取帖子
  async getPostList() {
    let { result } = await wx.cloud.callFunction({name: 'getPostList'})

    result.data.forEach(item => {
      // 处理最早时间和最迟时间
      item.beginTime = toDates(item.beginTime, 'display')
      item.endTime = toDates(item.endTime, 'display')
      // 处理发布时间
      item.createTime = getdate(item.createTime)
    })

    this.setData({ postList: result.data })
  },

  // 跳转到发布帖子
  toPublish() {
    wx.navigateTo({
      url: '/pages/publish/publish'
    })
  }
})

// index.js
import { toDates } from '../../utils/util'
import { getdate } from '../../utils/pastTime'

const db = wx.cloud.database()
const _ = db.command
const user = db.collection('User')

Page({
  data: {
    postList: [], // 帖字列表
    pageIndex: 1, // 当前分页
    pageSize: 12, // 每次获取数据条数
    reachBottom: false, // 是否到底部
  },

  /**
   * 页面加载
   */
  async onLoad(options) {
    this.setData({
      pageIndex: 1,
      postList: [],
      reachBottom: false
    })

    // 判断用户是否登录
    if(!wx.getStorageSync('currentUser')) {
      // 判断用户是否登录过
      await this.getUserInfo(options.communityId)
      // 获取用户社区信息
      await this.getUserCommunity()
    }

    // 获取行程信息
    if(wx.getStorageSync('currentUser')) this.getPostList()
  },

  // 获取用户社区信息
  getUserCommunity() {
    console.log('getUserCommunity')
    return new Promise((resolve, reject) => {
    let currentUser = wx.getStorageSync('currentUser')
      db.collection('UserCommunity').where({'_openid': currentUser._openid, 'status': 0}).get()
      .then(res => {
        if(res.data.length === 1) {
          currentUser.userCommunity = res.data[0]
          wx.setStorageSync('currentUser', currentUser)
        }
        resolve(100)
      })
    })
  },

  // 判断用户是否登录过
  getUserInfo(communityId) {
    console.log('getUserInfo')
    return new Promise((resolve, reject) => {
      user.get().then(res => {
        if(res.data.length === 1) {
          wx.setStorageSync('currentUser', res.data[0])
          resolve(100);
        } else {
          resolve(100);
          wx.navigateTo({
            url: '/pages/login/login?communityId=' + communityId
          })
        }
      })
    })
  },

  // 搜索
  search() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  // 获取行程信息
  getPostList() {

    console.log('getPostList')

    // 查询条件
    let whereConditiion = {}
    // 判断本地是否有 searchTerm
    if(wx.getStorageSync('searchTerm')) whereConditiion = this.getConditiion()

    //只能查询自己的社区或者关注社区的信息
    let currentUser = wx.getStorageSync('currentUser')
    let communityIds = []
    communityIds.push(currentUser.userCommunity.communityId)
    whereConditiion.communityId = _.in(communityIds)

    // skip(20 * (pageIndex - 1)).limit(20)
    const skin = this.data.pageSize * (this.data.pageIndex - 1)
    db.collection('HitchhikingInformation').where(whereConditiion)
    .skip(skin) // 从指定系列后的结果开始返回
    .limit(this.data.pageSize) // 每次查询数量
    .orderBy('createTime', 'desc') // 排序
    .get().then(res => {
      // 下一页没有数据了
      if(res.data.length === 0) {
        this.setData({
          reachBottom: true,
          pageIndex: this.data.pageIndex - 1
        })
      }

      // 处理时间
      res.data.forEach(item => {
        // 处理最早时间和最晚时间
        item.beginTime = toDates(item.beginTime, 'display')
        item.endTime = toDates(item.endTime, 'display')
        // 处理发布时间
        item.createTime = getdate(item.createTime)
      })

      let oldList = this.data.postList
      let newList = oldList.concat(res.data) // 合并数据
      this.setData({ postList: newList })
    })
    .catch(err => {
      console.log('err',err)
    })
  },

  // 获取形成信息的筛选条件
  getConditiion() {
    // 查询条件
    let whereConditiion = {}
    let searchTerm = wx.getStorageSync('searchTerm')

    // 类型
    if(searchTerm.radio) {
      whereConditiion.type = Number(searchTerm.radio)
    }

    // 出发地址
    if(searchTerm.departPlace) {
      whereConditiion.departPlace = db.RegExp({
        regexp: searchTerm.departPlace,
        options: 'i'
      })
    }
    // 到达地址
    if(searchTerm.destination) {
      whereConditiion.destination = db.RegExp({
        regexp: searchTerm.destination,
        options: 'i'
      })
    }
    // 时间
    if(searchTerm.timeStamp) {
      let { beginTime, endTime } = searchTerm.timeStamp
      // date 数据类型为 Object  时间戳数据类型为 Number

      if(beginTime) { // 只查询开始时间
        whereConditiion.endTime = _.gte(new Date(beginTime))
      }
      if(endTime) { // 只查询结束时间
        whereConditiion.beginTime = _.lte(new Date(endTime))
      }
    }
    return whereConditiion
  },

  // 跳转到行程信息详情
  toPost(event) {
    wx.navigateTo({
      url: `/pages/post/post?id=${event.target.id}`
    })
  },

  // 跳转到发布行程信息
  toPublish() {
    let currentUser = wx.getStorageSync('currentUser')
    if(currentUser.userCommunity) {
      wx.navigateTo({
        url: '/pages/publish/publish'
      })
    } else {
      wx.showToast({
        title: '您还未加入小区！',
        icon: 'error',
        duration: 2000
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      pageIndex: 1,
      postList: [],
      reachBottom: false
    })
    this.getPostList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

    if(this.data.reachBottom){
      console.info("no data============")
      return
    }

    this.setData({
      pageIndex: this.data.pageIndex + 1
    })

    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 500
    })
    this.getPostList()
  }
})

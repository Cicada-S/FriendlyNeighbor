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
    pageSize: 4, // 每次获取数据条数
    reachBottom: false, // 是否到底部
  },

  /**
   * 页面加载
   */
  onLoad() {
    // 判断用户是否登录过
    this.getUserInfo()
    // 获取行程信息
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

  // 获取行程信息
  getPostList() {
    console.log('getPostList')
    // 查询条件
    let whereConditiion = {}
    // 判断本地是否有 searchTerm
    if(wx.getStorageSync('searchTerm')) whereConditiion = this.whereConditiion()

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
        // 处理最早时间和最迟时间
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
  whereConditiion() {
    // 查询条件
    let whereConditiion = {}
    let searchTerm = wx.getStorageSync('searchTerm')
    // 类型
    whereConditiion.type = searchTerm.radio
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
    let { beginTime, endTime } = searchTerm.timeStamp
    console.log('beginTime', beginTime)
    console.log('endTime', endTime)
    // date 数据类型为 Object  时间戳数据类型为 Number
    if(beginTime && endTime) {
      return whereConditiion.beginTime = _.gte(new Date(beginTime)).and(_.lte(new Date(endTime)))
    } else if(beginTime) { // 只查询开始时间
      return whereConditiion.endTime = _.gte(new Date(beginTime))
    } else if(endTime) { // 只查询结束时间
      return whereConditiion.beginTime = _.lte(new Date(endTime))
    }

    // 清空行程信息
    this.setData({ postList: [] })

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
    wx.navigateTo({
      url: '/pages/publish/publish'
    })
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
  },

  /**
   * 监听页面卸载
   */
  onUnload() {
    wx.removeStorageSync('searchTerm')
  }
})

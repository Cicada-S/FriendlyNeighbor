// index.js
import { toDates } from '../../utils/util'
import { getdate } from '../../utils/pastTime'

const db = wx.cloud.database()
const user = db.collection('User')

Page({
  data: {
    search: '', // 搜索
    postList: [], // 帖字列表
    pageIndex: 1,
    pageSize: 4,
    reachBottom: false,
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
  getPostList() {

        //查询条件
    let whereConditiion = {}
    // if (this.data.searchValue) {
    //   whereConditiion.name = db.RegExp({
    //     regexp: this.data.searchValue,
    //     options: 'i',
    //   })
    // }

    //skip(20 * (pageIndex - 1)).limit(20)
    const skin = this.data.pageSize * (this.data.pageIndex - 1);
    console.log('this.data.pageIndex = ' + this.data.pageIndex)
    db.collection('HitchhikingInformation').where(whereConditiion).skip(skin).limit(this.data.pageSize).orderBy('createTime', 'desc')
    .get().then(res => {
      //下一页没有数据了
      if(res.data.length == 0){
        this.setData({
          reachBottom: true,
          pageIndex: this.data.pageIndex -1
        })
        return
      }

      res.data.forEach(item => {
        // 处理最早时间和最迟时间
        item.beginTime = toDates(item.beginTime, 'display')
        item.endTime = toDates(item.endTime, 'display')
        // 处理发布时间
        item.createTime = getdate(item.createTime)
      })

      let oldList = this.data.postList
      let newList = oldList.concat(res.data)
      this.setData({ postList: newList })
    })

  },

  // 跳转到帖子详情
  toPost(event) {
    wx.navigateTo({
      url: `/pages/post/post?id=${event.target.id}`
    })
  },

  // 跳转到发布帖子
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
  }
})

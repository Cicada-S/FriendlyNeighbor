// pages/post/post.js
let app = getApp()

// 引入date
import { toDates } from '../../utils/util'
import { getdate } from '../../utils/pastTime'

const db = wx.cloud.database()
const HitchhikingInformation = db.collection('HitchhikingInformation')
const User = db.collection('User')

Page({

  // onShareAppMessage: function (res) {
    
  //   console.info('onShareAppMessageonShareAppMessageonShareAppMessageonShareAppMessageonShareAppMessageonShareAppMessage')
  //   return {
  //     title: '自定义转发标题',
  //     path: '/page/user?id=123'
  //   }
  // },

  data: {
    bottomLift: app.globalData.bottomLift,
    postInfo: {}, // 行程信息信息
    value: '', // 评论
    commentSum: 0, // 评论数量
    focus: false, // 评论框焦点
    commentType: false, // false 为父评
    placeholder: '评论...', // 评论框占位符
    toUid: '', // 被评论者id
    toNickName: '', // 被评论者昵称
    replyType: 0, // 0: 子评 1: 回复
    fatherCommentId: '', // 父评id
    commentList: [], // 评论列表
    inputBottom: 0,
    show: false // 转发框的显示状态
  },

  /**
   * 页面加载
   */
  async onLoad(options) {
    // 判断是否为刚发布 跳转过来的
    if(wx.getStorageSync('newPost')) this.setData({show: true})

    if(!wx.getStorageSync('currentUser')){
      console.info('获取用户数据，缓存本地')

      // 获取用户信息
      await this.getUserInfo(options.id)
      // 获取用户社区信息
      await this.getUserCommunity()
    }

    // 获取行程信息信息
    this.getPostInfo(options.id)
    // 获取评论
    this.getComment(options.id)
  },

  getUserCommunity(){
    return new Promise((resolve, reject) => {
    let currentUser = wx.getStorageSync('currentUser')
      db.collection('UserCommunity').where({'_openid': currentUser._openid, 'status': 0}).get()
      .then(res => {
        if(res.data.length >= 1) {
          currentUser.userCommunity = res.data[0]
          wx.setStorageSync('currentUser', currentUser)
        }
        resolve(100)
      })
    })
  },

  // 判断用户是否登录过
  getUserInfo(hitchhikingInformationId) {
    return new Promise((resolve, reject) => {
      User.get().then(res => {
        if(res.data.length === 1) {
          wx.setStorageSync('currentUser', res.data[0])
          resolve(100);
        } else {
          resolve(100);
          wx.navigateTo({
            url: '/pages/login/login?hitchhikingInformationId='+hitchhikingInformationId
          })
        }
      })
    });
  },

  // 获取行程信息信息
  async getPostInfo(id) {
    HitchhikingInformation.doc(id).get()
    .then(res => {
      // 处理最早时间和最晚时间
      res.data.beginTime = toDates(res.data.beginTime, 'display')
      res.data.endTime = toDates(res.data.endTime, 'display')
      // 处理发布时间
      res.data.createTime = getdate(res.data.createTime)
      // 更新data
      this.setData({ postInfo: res.data })
    })
  },

  // 获取评论
  async getComment(id) {
    let { result } = await wx.cloud.callFunction({
      name: 'getComment',
      data: { id }
    })

    let { commentSum } = this.data
    // 将发布时间改成文字  计算评论数量
    result.data.forEach(item => {
      ++commentSum
      item.createTime = getdate(item.createTime)
      item.child_comment.forEach(child => {
        ++commentSum
        child.createTime = getdate(child.createTime)
      })
    })
    this.setData({ commentList: result.data, commentSum })
  },

  // 复制手机号
  copyPhone() {
    wx.setClipboardData({ data: this.data.postInfo.phone })
    .then(() => {
      wx.showToast({
        title: '复制手机号成功',
        icon: 'none',
        duration: 1500
      })
    })
  },

  // 拨打电话
  dialPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.postInfo.phone
    })
  },

  // 评论
  hairComment() {
    let content = this.data.value
    if(typeof content === "undefined" || content === null || content.trim() === ""){
      return
    }

    if(this.data.commentType) {
      this.sonComment() // 子级评论
    } else {
      this.fatherComment() // 父级评论
    }

    // 计算评论数量
    this.setData({
      commentSum: ++this.data.commentSum,
      focus: false,
      commentType: false,
      placeholder: '评论...'
    })
  },

  // 父级评论
  fatherComment() {
    let { value, commentList, postInfo } = this.data
    let userInfo = wx.getStorageSync('currentUser')

    let data = {
      postId: postInfo._id,
      _openid: userInfo._openid,
      nickName: userInfo.nick_name,
      avatarUrl: userInfo.avatar_url,
      createTime: new Date(),
      content: value
    }

    wx.cloud.callFunction({
      name: 'addComment',
      data
    }).then(res => {

      if(res.result.code == 1){
        wx.showToast({
          title: res.result.error,
          icon: 'error',
          duration: 2000
        })
        return
      }

      data._id = res.result.data
      data.createTime = getdate(data.createTime)
      data.child_comment = [] // 添加上child_comment属性 否则子评会报错
      commentList.unshift(data)
      // 更新data
      this.setData({ commentList, value: '' })
    })
  },

  // 子级评论
  sonComment() {
    let { value, commentList, postInfo, toUid, toNickName, replyType, fatherCommentId } = this.data
    let userInfo = wx.getStorageSync('currentUser')

    let data = {
      post_id: postInfo._id,
      _openid: userInfo._openid,
      nickName: userInfo.nick_name,
      avatarUrl: userInfo.avatar_url,
      createTime: new Date(),
      content: value,
      agree: 0,
      toUid,
      toNickName,
      replyType,
      fatherCommentId
    }

    wx.cloud.callFunction({
      name: 'addComment',
      data
    }).then(res => {

      if(res.result.code == 1){
        wx.showToast({
          title: res.result.error,
          icon: 'error',
          duration: 2000
        })
        return
      }

      data._id = res.result.data
      data.createTime = getdate(data.createTime)
      // 将子评添加到指定的父评下
      commentList.forEach(item => {
        if(item._id === fatherCommentId) item.child_comment.push(data)
      })
      // 更新data
      this.setData({ commentList, value: '' })
    })
  },

  // 点击父级评论 的回调函数
  replyComment(event) {
    let { id, dataset } = event.currentTarget

    this.setData({
      focus: true,
      placeholder: `回复 @${dataset.name}`,
      commentType: true,
      toUid: dataset._openid,
      toNickName: dataset.name,
      replyType: 0,
      fatherCommentId: id
    })
  },

  // 点击子级评论 的回调函数
  answerComment(event) {
    let { id, dataset } = event.currentTarget

    this.setData({
      focus: true,
      placeholder: `回复 @${dataset.name}`,
      commentType: true,
      toUid: dataset._openid,
      toNickName: dataset.name,
      replyType: 1,
      fatherCommentId: id
    })
  },

  // 评论框获取焦点
  inputFocus(event) {
    this.setData({ inputBottom: event.detail.height })
  },

  // 评论框失去焦点
  inputBlur() {
    this.setData({ inputBottom: 0 })
    if(!this.data.value) {
      this.setData({
        commentType: false,
        placeholder: '评论...'
      })
    }
  },

  // 空状态时返回首页
  toHome() {
    wx.switchTab({url: '/pages/index/index'})
  },

  // 取消分享
  onCancel() {
    this.setData({ show: false })
  },

  /**
   * 用户点击右上角转发
   */
  onShareAppMessage() {
    this.setData({ show: false })
    let { type, departPlace, destination } = this.data.postInfo
    let travel = type === '1' ? '人找车' : '车找人'
    let title = `${travel}，出发：${departPlace} -> 到达：${destination}`
    return { title }
  },

  /**
   * 页面卸载
   */
  onUnload() {
    wx.removeStorageSync('newPost')
  }
})

// pages/post/post.js
let app = getApp()

// 引入date
import { toDates } from '../../utils/util'
import { getdate } from '../../utils/pastTime'

const db = wx.cloud.database()
const HitchhikingInformation = db.collection('HitchhikingInformation')

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    postInfo: {}, // 帖子信息
    value: '', // 评论
    focus: false, // 评论框焦点
    commentType: false, // false 为父评
    placeholder: '评论...', // 评论框占位符
    toUid: '', // 被评论者id
    toNickName: '', // 被评论者昵称
    replyType: 0, // 0: 子评 1: 回复
    fatherCommentId: '', // 父评id
    commentList: [
      {
        _id: '123131',
        _openid: '13213412',
        postType: 0,
        postId: '12314',
        nickName: 'Cicada',
        avatarUrl: '/static/images/post/user.jpg',
        content: '我带了一个26寸的行李箱',
        createTime: '1小时前',
        child_comment: [
          {
            _id: '1231',
            fatherCommentId: '123131',
            _openid: '13213412',
            nickName: 'Cicada',
            avatarUrl: '/static/images/post/user.jpg',
            toUid: '4214423',
            toNickName: 'Ting',
            replyType: 0,
            content: '斯人若彩虹',
            createTime: '50分钟前'
          }
        ]
      }
    ]
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    this.getPostInfo(options.id)
  },

  // 获取帖子信息
  async getPostInfo(id) {
    let { data } = await HitchhikingInformation.doc(id).get()
    // 处理最早时间和最迟时间
    data.beginTime = toDates(data.beginTime, 'display')
    data.endTime = toDates(data.endTime, 'display')
    // 处理发布时间
    data.createTime = getdate(data.createTime)
    this.setData({ postInfo: data })
  },

  // 复制手机号
  copyPhone() {
    wx.setClipboardData({ data: this.data.postInfo.phone })
    .then(() => {
      wx.showToast({
        title: '复制成功',
        icon: 'none',
        duration: 2000
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
    console.log(this.data.value)

    if(this.data.commentType) {
      this.sonComment() // 子级评论
    }else {
      this.fatherComment() // 父级评论
    }
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
  }
})

// pages/idleInfo/idleInfo.js
const app = getApp()

import { getdate } from '../../utils/pastTime'

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    idleInfo: {}, // 闲物详情
    commentList: [], // 评论列表
    active: 0, // 标签栏
    commentSum: 0, // 评论数量
    value: '', // 评论
    focus: false, // 评论框焦点
    commentType: false, // false 为父评
    placeholder: '评论...', // 评论框占位符
    toUid: '', // 被评论者id
    toNickName: '', // 被评论者昵称
    replyType: 0, // 0: 子评 1: 回复
    fatherCommentId: '', // 父评id
    inputBottom: 0 // 评论框的底部距离
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    // 获取闲物详情
    this.getIdleInfo(options.id)
    // 获取评论
    this.getComment(options.id)
  },

  // 获取闲物详情
  async getIdleInfo(id) {
    const { result } = await wx.cloud.callFunction({
      name: 'getIdleInfo',
      data: { id }
    })

    // 处理首图
    let firstList = result.data.firstList.map(item => item.path)
    result.data.firstList = firstList

    this.setData({ idleInfo: result.data })
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
    wx.setClipboardData({ data: this.data.idleInfo.phone })
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
    wx.makePhoneCall({ phoneNumber: this.data.idleInfo.phone })
  },

  // 切换标签栏
  onChange(event) {
    this.setData({ active: event.detail.name })
  },

  // 评论
  async hairComment() {
    let content = this.data.value
    if(typeof content === "undefined" || content === null || content.trim() === '') return

    // 禁用发送按钮 发送成功后再解除
    this.setData({ isDisabled: true })

    if(this.data.commentType) {
      await this.sonComment() // 子级评论
    } else {
      await this.fatherComment() // 父级评论
    }
  },

  // 父级评论
  fatherComment() {
    let { value, commentList, idleInfo } = this.data
    let userInfo = wx.getStorageSync('currentUser')

    let data = {
      postId: idleInfo._id,
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

      if(res.result.code == 1) {
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
      this.commentRes(commentList)
    })
  },

  // 子级评论
  sonComment() {
    let { value, commentList, idleInfo, toUid, toNickName, replyType, fatherCommentId } = this.data
    let userInfo = wx.getStorageSync('currentUser')

    let data = {
      post_id: idleInfo._id,
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
      this.commentRes(commentList)
    })
  },

  // 评论成功清除更新data
  commentRes(commentList) {
    this.setData({
      commentList,
      commentSum: ++this.data.commentSum,
      focus: false,
      commentType: false,
      placeholder: '评论...',
      value: '',
      isDisabled: false
    })
  },

  // 点击父级评论 的回调函数
  replyComment(event) {
    let { id, dataset } = event.detail

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
    let { id, dataset } = event.detail

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
})

// pages/opinion/opinion.js
Page({
  data: {
    commentList: [],
    value: '', // 评论
    placeholder: '评论...', // 评论框占位符
    focus: false, // 评论框焦点
    isDisabled: false, // 是否禁用发送按钮
    commentType: false, // false 为父评
    toUid: '', // 被评论者id
    toNickName: '', // 被评论者昵称
    replyType: 1, // 0: 子评 1: 回复
    fatherCommentId: '' // 父评id
  },

  /**
   * 页面加载
   */
  onLoad(options) {

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

  // 发表评论
  comment() {

  },

  // 评论
  async hairComment() {
    let content = this.data.value
    if(content.trim()) return

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
      this.commentRes(commentList)
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
      this.commentRes(commentList)
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
  }
})

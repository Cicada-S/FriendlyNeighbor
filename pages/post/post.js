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
    postInfo: {},
    commentList: [
      {
        _id: '123131',
        _openid: '13213412',
        postType: 0,
        postId: '12314',
        nick_name: 'Cicada',
        avatar_url: '/static/images/post/user.jpg',
        content: '我带了一个26寸的行李箱',
        createTime: '1小时前',
        child_comment: [
          {
            _id: '1231',
            fatherCommentId: '123131',
            _openid: '13213412',
            nick_name: 'Cicada',
            avatar_url: '/static/images/post/user.jpg',
            to_uid: '4214423',
            to_nick_name: 'Ting',
            reply_type: 0,
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

  // 父级评论
  replyComment(event) {
    let { id, dataset } = event.currentTarget
    console.log(id, dataset)
  },

  // 子级评论
  answerComment(event) {
    let { id, dataset } = event.currentTarget
    console.log(id, dataset)
  }
})

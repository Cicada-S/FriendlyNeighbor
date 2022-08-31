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
        nick_name: 'Cicada',
        avatar_url: '/static/images/post/user.jpg',
        comment_details: '我带了一个26寸的行李箱',
        comment_date: '1小时前',
        comment_identity: 0
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
  }
})

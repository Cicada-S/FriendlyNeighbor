// pages/post/post.js
let app = getApp()

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    postInfo: {
      _id: '12313',
      nick_name: 'Cicada',
      avatar_url: '/static/images/post/user.jpg',
      price: '12',
      phone: '15088888888',
      remark: '我带了一个26寸的行李箱',
      beginTime: '08月30 12:00',
      endTime: '08月30 13:00',
      departPlace: '三水广场',
      destination: '广州商贸中心'
    },
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
    console.log('页面加载', options)
  }
})

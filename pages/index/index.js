// index.js
const db = wx.cloud.database()
const user = db.collection('User')

Page({
  data: {
    search: '', // 搜索
    postList: [
      {
        _id: '1',
        communityId: '1',
        _openid: 'fsdfadsadda',
        name: 'Cicada',
        avatar_url: '/static/images/index/user.jpg',
        type: 1,
        beginTime: '8月30 12:00',
        endTime: '8月30 15:00',
        departPlace: '汤臣一品',
        destination: '广州商贸中心',
        price: 20,
        phone: '15088888888',
        remark: '还有两个位置',
        createTime: '2小时前'
      },
      {
        _id: '2',
        communityId: '1',
        _openid: 'gasfadsfafe',
        name: 'Ting',
        avatar_url: '/static/images/index/user.jpg',
        type: 0,
        beginTime: '8月30 12:00',
        endTime: '8月30 15:00',
        departPlace: '汤臣一品',
        destination: '广州商贸中心',
        price: 20,
        phone: '15088888888',
        remark: '我带了一个22寸的行李箱',
        createTime: '2小时前'
      }
    ], // 帖字列表
  },

  /**
   * 页面加载
   */
  onLoad() {
    // 判断用户是否登录过
    this.getUserInfo()
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
  }
})

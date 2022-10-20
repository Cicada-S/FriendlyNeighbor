// pages/login/login.js
const db = wx.cloud.database()
const User = db.collection('User')
const UserCommunity = db.collection('UserCommunity')
const Community = db.collection('Community')

Page({
  data: {
    icon: '/static/images/login/icon.png',
    isLogin: true,
    userInfo: {},
    user: {},
    infoId: '', // 帖子或好物id
    communityInfo: {}, // 社区信息
    type: '', // post IdleItem
    coordinate: [
      {x: -20, y: 80},
      {x: 680, y: 150},
      {x: 300, y: 250},
      {x: -20, y: 450},
      {x: 580, y: 540},
      {x: 200, y: 700},
      {x: 450, y: 900},
      {x: 150, y: 1100},
      {x: 650, y: 1200},
      {x: 180, y: 1460},
    ]
  },

    /**
   * 页面加载
   */
  onLoad(options) {
    // 获取社区信息
    this.getCommunity(options.communityId)
  
    if(options.id) this.setData({
      infoId: options.id,
      type: options.type
    })
  },

  // 获取社区信息
  async getCommunity(id) {
    console.log('id', id)
    let { data } = await Community.doc(id).get()
    this.setData({ communityInfo: data })
  },

  // 登录的回调函数
  getUserProfile() {
    // 获取用户信息
    wx.getUserProfile({ desc: "用于个人信息展示" })
    .then(res => {
      // 用户数据
      let user = {
        avatar_url: res.userInfo.avatarUrl,
        nick_name: res.userInfo.nickName,
        gender: res.userInfo.gender,
        phone: '',
        create_date: new Date()
      }

      // 將用戶添加到 用户数据表
      User.add({data: user}).then(() => {
        // 将用户添加到 用户社区关系表
        const { _id, name } = this.data.communityInfo
        UserCommunity.add({data: {
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          // communityId: '5a845e43632ed2f000391944385091ac',
          communityId: _id,
          // communityName: '保利御江南',
          communityName: name,
          reasonsForApplying: '',
          status: 0,
          createTime: new Date()
        }})
      })
      .then(() => {
        console.log(this.data.type)
        switch (this.data.type) {
          case 'post': // 跳转行程信息详情页
            console.log('post')
            wx.reLaunch({
              url: '/pages/post/post?id=' + this.data.infoId
            })
            break;
          case 'idleItem': // 跳转好物详情页
            console.log('idleItem') 
            wx.reLaunch({
              url: '/pages/idleInfo/idleInfo?id=' + this.data.infoId
            })
            break;
          default: // 跳转到首页
            console.log('index') 
            wx.reLaunch({
              url: '/pages/index/index'
            })
            break;
        }
      })
    })
  }
})

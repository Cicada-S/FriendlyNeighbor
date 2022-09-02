// pages/login/login.js
const db = wx.cloud.database()
const User = db.collection('User')

Page({
  data: {
    icon: '/static/images/login/icon.png',
    isLogin: true,
    user: {},
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

  // 登录的回调函数
  getUserProfile() {
    // 获取用户信息
    wx.getUserProfile({
      desc: "用于个人信息展示",
      // 允许授权
      success: res => {
        let user = {
          communityId: 'b69f67c06308217312ba80a2010779b0',
          communityName: '汤臣一品',
          avatar_url: res.userInfo.avatarUrl,
          nick_name: res.userInfo.nickName,
          gender: res.userInfo.gender,
          phone: '',
          create_date: new Date()
        }
        this.setData({
          isLogin: false,
          userInfo: res.userInfo,
          user
        })
      }
    })
  },

  // 授权手机号的回调函数
  async getPhoneNumber(event) {
    const errMsg = event.detail.errMsg
    // 同意授权则执行下面代码
    if (errMsg === "getPhoneNumber:ok") {
      const cloudId = event.detail.cloudID
      const cloudIdList = [cloudId]
      wx.showLoading({
        title: '获取中',
        mask: true
      })
      const cloudFunRes = await wx.cloud.callFunction({
        name: "getMobile",
        data: { cloudIdList }
      })
  
      const jsonStr = cloudFunRes.result.dataList[0].json
      const jsonData = JSON.parse(jsonStr)
      const phoneNumber = jsonData.data.phoneNumber
  
      // 获取本地的用户信息
      let { user, userInfo } = this.data
      user.phone = phoneNumber
      userInfo.phone = phoneNumber
      // 将用户信息保存到本地
      wx.setStorageSync('currentUser', userInfo)
      wx.hideLoading()

      // 將用戶添加到数据库
      User.add({ data: user }).then(() => {
        // 跳转到首页
        wx.reLaunch({
          url: '/pages/index/index'
        })
      })
    }
  }
})

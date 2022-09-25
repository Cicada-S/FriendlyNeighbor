// pages/login/login.js
const db = wx.cloud.database()
const User = db.collection('User')
const UserCommunity = db.collection('UserCommunity')

Page({
  data: {
    icon: '/static/images/login/icon.png',
    isLogin: true,
    userInfo: {},
    user: {},
    hitchhikingInformationId: '',
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
    if(options.hitchhikingInformationId){
      this.setData({ hitchhikingInformationId: options.hitchhikingInformationId})
    }
  },

  // 登录的回调函数
  getUserProfile() {

    let that = this
    // 获取用户信息
    wx.getUserProfile({
      desc: "用于个人信息展示",
      // 允许授权
      success: res => {

        let user = {
          avatar_url: res.userInfo.avatarUrl,
          nick_name: res.userInfo.nickName,
          gender: res.userInfo.gender,
          phone: '',
          create_date: new Date()
        }

        // 將用戶添加到数据库
        User.add({data: user, success: () => {

            UserCommunity.add({data: {
              nickName: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl,
              communityId: '5a845e43632ed2f000391944385091ac',
              communityName: '保利御江南',
              reasonsForApplying: '',
              status: 0,
              createTime: new Date()
            },
            success: () => {
                if(that.data.hitchhikingInformationId){
                  // 跳转行程信息详情页
                  wx.reLaunch({
                    url: '/pages/post/post?id=' + that.data.hitchhikingInformationId
                  })
                }else{
                  // 跳转到首页
                  wx.reLaunch({
                    url: '/pages/index/index'
                  })
                }
              }
            })

        }})

 

      }
    }) 
  }
})

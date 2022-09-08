// pages/community/community.js
const app = getApp()

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    communityList: [
      {
        _id: '231231',
        name: '汤臣一品',
        qrCodePath: '',
        province: '广东省',
        city: '广州市',
        county: '花都区',
      },
      {
        _id: '212312',
        name: '汤臣二品',
        qrCodePath: '',
        province: '广东省',
        city: '广州市',
        county: '花都区',
      }
    ]
  },

  // 跳转到添加小区
  toAddCommunity() {
    console.log('toAddCommunity')
  }
})

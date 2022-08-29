// pages/publish/publish.js
const app = getApp()

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    radio: '0', // 类型
    phone: '', // 手机号
    price: '', // 价格
    departPlace: '', // 出发地
    destination: '', // 到达地
    beginTime: '', // 最早出发时间
    endTime: '', // 最迟出发时间
    remark: '' // 备注
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    console.log('页面加载')
  },

  // 切换类型
  onRadioChange(event) {
    this.setData({ radio: event.detail })
  }
})

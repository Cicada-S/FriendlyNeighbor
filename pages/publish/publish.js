// pages/publish/publish.js
Page({
  data: {
    radio: '1', // 类型
    phone: '', // 手机号
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
  },

})

// pages/publish/publish.js
const app = getApp()
// 引入toDates将时间戳转换成时间
import { toDates } from '../../utils/util'

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
    remark: '', // 备注
    // 时间选择器
    timeType: '', // 时间类型 开始 结束
    show: false, // 时间选择器的显示状态
    timeStamp: { // 用于传给后端的时间戳
      beginTime: '',
      endTime: '',
    },
    minDate: new Date().getTime(), // 可选的最小时间
    currentDate: new Date().getTime(), // 当前时间
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

  // 选择时间
  selectTime(event) {
    this.setData({
      timeType: event.currentTarget.id,
      show: true
    })
  },

  // 时间选择器 点击取消和遮罩层 的回调函数
  onCancel() {
    this.setData({ show: false })
  },

  // 时间选择器 点击确定 的回调函数
  onConfirm(event) {
    console.log(event)
    let newDate = event.detail
    this.setData({
      [this.data.timeType]: toDates(newDate),
      ['timeStamp.' + this.data.timeType]: newDate,
      show: false
    })
  },

  // 发布帖子
  onRelease() {
    wx.showLoading({
      title: '发布中...'
    })

    let { 
      radio, phone, price, 
      departPlace, destination, 
      timeStamp, remark
    } = this.data

    let data = {
      communityId: wx.getStorageSync('currentUser').communityId,
      type: radio,
      beginTime: timeStamp.beginTime,
      endTime: timeStamp.endTime,
      departPlace,
      destination,
      price,
      phone,
      remark
    }

    wx.cloud.callFunction({
      name: 'addPost',
      data
    }).then(() => {
      wx.hideLoading()
      wx.showToast({
        title: '发布成功！',
        icon: 'success',
        duration: 1000
      })
      setTimeout(() => {
        wx.navigateBack({ delta: 1 })
      }, 1000)
    })
  }
})

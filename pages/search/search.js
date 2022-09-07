// pages/search/search.js
// 引入toDates将时间戳转换成时间
import { toDates } from '../../utils/util'

Page({
  data: {
    radio: '0', // 类型
    departPlace: '', // 出发地址
    destination: '', // 到达地址
    // 时间选择器
    show: false, // 时间选择器的显示状态
    beginTime: '', // 最早出发时间
    endTime: '', // 最迟出发时间
    timeType: '', // 时间类型 开始 结束
    timeStamp: { // 用于传给后端的时间戳
      beginTime: '',
      endTime: '',
    },
    minDate: new Date(2022, 1, 1).getTime(), // 可选的最小时间
    currentDate: new Date().getTime(), // 当前时间
  },

  // 切换类型
  onRadioChange(event) {
    this.setData({ radio: event.detail })
  },

  /**
   * 选择时间
   */ 
  selectTime(event) {
    this.setData({
      timeType: event.currentTarget.id,
      show: true
    })
  },

  // 时间选择器 点击确定 的回调函数
  onTimeConfirm(event) {
    let newDate = event.detail
    this.setData({
      [this.data.timeType]: toDates(newDate),
      ['timeStamp.' + this.data.timeType]: newDate,
      show: false
    })
  },

  // 时间选择器 点击取消和遮罩层 的回调函数
  onTimeCancel() {
    this.setData({ show: false })
  },

  // 取消 的回调函数
  cancel() {
    this.setData({
      radio: '0',
      departPlace: '',
      destination: '',
      beginTime: '',
      endTime: '',
      'timeStamp.beginTime': '',
      'timeStamp.endTime': '',
    })
    wx.removeStorageSync('searchTerm')
    wx.navigateBack({ delta: 1 })

    // 清除index的行程数据
    /* let pages = getCurrentPages() // 获取当前页面栈
    let prevPage = pages[pages.length - 2] // 获取到上一层页面栈
    // 将数据设置到上一层的 data 中
    prevPage.setData({postList: []}) */
    // 返回上一层
    // wx.navigateBack({delta: 1})

    // 
    wx.switchTab({
      url: 'pages/index/index'
    })
  },

  // 确定 的回调函数
  search() {
    let { radio, departPlace, destination, beginTime, endTime, timeStamp } = this.data
    let searchTerm = {
      radio,
      departPlace,
      destination,
      beginTime,
      endTime,
      timeStamp
    }

    wx.setStorageSync('searchTerm', searchTerm)
    // wx.navigateBack({ delta: 1 })
    console.log('111',111)
    wx.reLaunch({
      url: 'pages/index/index'
    })
  }
})

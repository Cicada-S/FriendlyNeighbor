// pages/search/search.js
// 引入toDates将时间戳转换成时间
import { toDates } from '../../utils/util'

Page({
  data: {
    radio: '0', // 类型
    // 时间选择器
    show: false, // 时间选择器的显示状态
    beginTime: '', // 最早出发时间
    endTime: '', // 最迟出发时间
    timeType: '', // 时间类型 开始 结束
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
  onLoad() {

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
  }
})

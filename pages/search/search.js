// pages/search/search.js
const app = getApp()
// 引入toDates将时间戳转换成时间
import { toDates } from '../../utils/util'

Page({
  data: {
    value: '', // 搜索
    show: false, // 筛选模态框的显示状态
    focus: false, // 搜索框焦点
    radio: '0', // 类型
    // 小区选择器
    communityName: '', // 小区名字
    showCommunity: false, // 小区选择器的显示状态
    columns: ['汤臣一品'], // 小区列表
    // 时间选择器
    showTime: false, // 时间选择器的显示状态
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
    // 搜索框获取焦点
    this.setData({ focus: true })
  },

  // 搜索时触发
  onSearch() {
    console.log(this.data.value)
  },

  // 点击筛选
  onScreen() {
    this.setData({ show: true })
  },

  // 关闭筛选模态框
  onClose() {
    this.setData({ show: false })
  },

  // 切换类型
  onRadioChange(event) {
    this.setData({ radio: event.detail })
  },

  /**
   * 选择小区
   */ 
  community() {
    this.setData({ showCommunity: true })
  },

  // 小区选择器 点击确定 的回调函数
  onCommunityConfirm(event) {
    this.setData({
      communityName: event.detail.value,
      showCommunity: false
    })
  },

  // 小区选择器 点击取消和遮罩层 的回调函数
  onCommunityCancel() {
    this.setData({ showCommunity: false })
  },

  /**
   * 选择时间
   */ 
  selectTime(event) {
    this.setData({
      timeType: event.currentTarget.id,
      showTime: true
    })
  },

  // 时间选择器 点击确定 的回调函数
  onTimeConfirm(event) {
    let newDate = event.detail
    this.setData({
      [this.data.timeType]: toDates(newDate),
      ['timeStamp.' + this.data.timeType]: newDate,
      showTime: false
    })
  },

  // 时间选择器 点击取消和遮罩层 的回调函数
  onTimeCancel() {
    this.setData({ showTime: false })
  }
})

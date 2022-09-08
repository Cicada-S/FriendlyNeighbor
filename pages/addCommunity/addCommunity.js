// pages/addCommunity/addCommunity.js
const app = getApp()

// 引入省市区数据
import { areaList } from '@vant/area-data'

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    name: '', // 小区名
    show: false, // 选择器的显示状态
    areaList, // 全国城市的信息
    city: '', // 选择的地区
  },

  // 选择地区
  selectCity() {
    this.setData({ show: true })
  },

  // 取消 点击遮罩层 关闭选择器
  onCancel() {
    this.setData({ show: false })
  },

  // 点击确定时触发
  onConfirm(event) {
    let city = []
    event.detail.values.forEach(item => city.push(item.name))
    this.setData({
      show: false,
      city
    })
  },

  // 添加小区
  addCommunity() {
    let { name, city } = this.data
    // 判断小区名和地区是否为空
    if(this.isEmpty(name, city)) {
      console.log('调用云函数')
    }
  },

  // 判断小区名和地区是否为空
  isEmpty(name, city) {
    if(!name) {
      wx.showToast({
        title: '小区名不能为空!',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if(!city.length) {
      wx.showToast({
        title: '地区不能为空!',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    return true
  }
})

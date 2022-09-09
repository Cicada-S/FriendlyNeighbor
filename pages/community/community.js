// pages/community/community.js
const app = getApp()

// 引入省市区数据
import { areaList } from '@vant/area-data'

const db = wx.cloud.database()
const Community = db.collection('Community')

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    search: '', // 搜索
    city: '', // 地区
    area: '', // 区
    show: false, // 选择器的显示状态
    areaList, // 全国城市的信息
    communityList: [] // 小区列表
  },

  /**
   * 页面显示
   */
  onShow() {
    // 获取小区
    this.getCommunity()
  },

  // 获取小区
  getCommunity(value) {
    // 对name字段模糊查询
    let data = {}
    if(value) data.name =  db.RegExp({ regexp: value, options: 'i'})
 
    // 获取小区
    Community.where(data).get().then(res => {
      this.setData({
        communityList: res.data
      })
    })
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
    let area = ''
    if(city[2].length > 4) {
      area = '...' + city[2].substring(city[2].length - 3, city[2].length)
    } else {
      area = city[2]
    }
    this.setData({ show: false, city, area })
  },

  // 确定搜索时触发
  async onSearch(event) {
    wx.showLoading({
      title: '查找中...',
    })
    await this.getCommunity(event.detail)
    wx.hideLoading()
  },

  // 跳转到添加小区
  onClick() {
    wx.navigateTo({
      url: '/pages/addCommunity/addCommunity'
    })
  }
})

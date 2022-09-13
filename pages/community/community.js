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
    address: [], // 地区
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
  getCommunity() {
    let { search, address } = this.data
    let data = {}
    // 对name字段模糊查询
    if(search) data.name = db.RegExp({ regexp: search, options: 'i'})
    // 对地区查询
    if(address) {
      data.province = address[0]
      data.city = address[1]
      data.county = address[2]
    }

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

  // 点击遮罩层 关闭选择器
  onOverlay() {
    this.setData({ show: false })
  },

  // 点击取消时 清除选择的地区
  onCancel() {
    this.setData({
      address: [],
      area: '',
      show: false
    })
    // 获取小区
    this.getCommunity()
  },

  // 点击确定时触发
  onConfirm(event) {
    let address = []
    event.detail.values.forEach(item => address.push(item.name))
    let area = ''
    if(address[2].length > 4) {
      area = '...' + address[2].substring(address[2].length - 3, address[2].length)
    } else {
      area = address[2]
    }
    this.setData({ show: false, address, area })

    // 获取小区
    this.getCommunity()
  },

  // 确定搜索时触发
  async onSearch() {
    wx.showLoading({ title: '查找中...' })
    await this.getCommunity()
    wx.hideLoading()
  },

  // 点击二维码放大预览的处理函数
  onPreview(event) {
    wx.previewImage({
      current: event.target.id,
      urls: [event.target.id]
    })
  },

  // 跳转到小区详情
  toCommunityInfo(event) {
    wx.navigateTo({
      url: `/pages/communityInfo/communityInfo?id=${event.currentTarget.id}`
    })
  },

  // 跳转到添加小区
  onClick() {
    wx.navigateTo({
      url: '/pages/addCommunity/addCommunity'
    })
  }
})

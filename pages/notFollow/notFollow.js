// pages/notFollow/notFollow.js
const db = wx.cloud.database()
const Community = db.collection('Community')
const CommunityOfInterest = db.collection('CommunityOfInterest')

// 引入省市区数据
import { areaList } from '@vant/area-data'

Page({
  data: {
    search: '', // 搜索
    address: [], // 地区
    area: '', // 区
    show: false, // 选择器的显示状态
    areaList, // 全国城市的信息
    communityList: [] // 小区列表
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    this.getCommunity()
  },

  // 获取小区列表
  async getCommunity() {
    wx.showLoading({title: '获取中...'})

    const { _openid } = wx.getStorageSync('currentUser')
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
    const community = await Community.where(data).get()
    // 获取关注的小区
    const followRes = await CommunityOfInterest.where({_openid}).get()

    // 将已关注的小区去除
    const communityList = community.data.filter(citem => {
      return !followRes.data.some(fitem => citem._id === fitem.communityId)
    })

    // 关闭load
    wx.hideLoading()
    // 更新data
    this.setData({ communityList })
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

  // 关注小区
  follow(event) {
    const { _id, name, province, city, county } = event.currentTarget.dataset.item

    wx.showModal({
      title: '提示',
      content: '确定关注该小区吗？',
    }).then(res => {
      if (res.confirm) {
        // 创建关注
        CommunityOfInterest.add({data: {
          communityId: _id,
          communityName: name,
          communityProvince: province,
          communityCity: city,
          communityCounty: county,
          createTime: new Date()
        }})

        let { communityList } = this.data
        const currentUser = wx.getStorageSync('currentUser')
        const communityOfInterest = currentUser.communityOfInterest || []
        // 遍历将关注的小区状态改成true
        communityList.forEach(item => {
          if(item._id === _id) {
            communityOfInterest.push(item)
            item.isFollow = true
          }
        })
        // 更新data
        this.setData({ communityList })
        // 更新本地
        currentUser.communityOfInterest = communityOfInterest
        wx.setStorageSync('currentUser', currentUser)
      }
    })
  },

  // 取关小区
  unFollow(event) {
    let id = event.target.id
    let { communityList } = this.data
    let _openid = wx.getStorageSync('currentUser')._openid

    // 删除数据表
    CommunityOfInterest.where({communityId: id}).remove()

    // 更新本地
    const currentUser = wx.getStorageSync('currentUser')
    const newFollowList = currentUser.communityOfInterest.filter(item => item._id !== id)
    currentUser.communityOfInterest = newFollowList
    wx.setStorageSync('currentUser', currentUser)
    
    // 找出该条数据将其 isFollow 改成 false
    communityList.forEach(item => {
      if(item._id === id) item.isFollow = false
    })
    console.log('new', communityList)

    // 更新data
    this.setData({ communityList })
  }
})

// pages/community/community.js
const app = getApp()

// 引入省市区数据
import { areaList } from '@vant/area-data'

const db = wx.cloud.database()
const Community = db.collection('Community')
const UserCommunity = db.collection('UserCommunity')
const CommunityManager = db.collection('CommunityManager')
const CommunityOfInterest = db.collection('CommunityOfInterest')

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    isChoice: false, // 是否为选择小区状态
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
    console.log(options.type)
    if(options.type) this.setData({ isChoice: true })
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
      // 如果为选择小区状态 则不渲染所在的小区
      let data = res.data
      if(this.data.isChoice) {
        let communityId = wx.getStorageSync('currentUser').userCommunity.communityId
        data = res.data.filter(item => {
          if(item._id !== communityId) return item
        })
      }
      // 更新data
      this.setData({ communityList: data })
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
    // 判断为选择小区 则不跳转
    if(this.data.isChoice) return
    wx.navigateTo({
      url: `/pages/communityInfo/communityInfo?id=${event.currentTarget.id}`
    })
  },

  // 跳转到添加小区
  onClick() {
    wx.navigateTo({
      url: '/pages/addCommunity/addCommunity'
    })
  },

  // 申请加入小区
  onJoin(event) {
    let { dataset, id } = event.currentTarget
    let userInfo = wx.getStorageSync('currentUser')

    wx.showModal({
      title: '提示',
      content: '确定加入该小区吗？',
      async success (res) {
        if (res.confirm) {
          // 删除所在的小区关系表 (如果开启管理员模式 需要将这两行代码删除)
          await UserCommunity.where({ _openid: userInfo._openid }).remove()
          // 删除社区管理员数据表 (如果开启管理员模式 在管理员审核通过的时候再删除该表)
          await CommunityManager.where({ _openid: userInfo._openid }).remove()

          // 创建新的小区关系表
          const result = await UserCommunity.add({data: {
            nickName: userInfo.nick_name,
            avatarUrl: userInfo.avatar_url,
            communityId: id,
            communityName: dataset.name,
            reasonsForApplying: '',
            // status: 1,
            status: 0,
            createTime: new Date()
          }})
          wx.navigateBack({ delta: 1 })

          // 删除关注中的这个小区
          await CommunityOfInterest.where({
            _openid: userInfo._openid,
            communityId: id
          }).remove()
          
          // 获取个人信息和更新
          const currentUser = wx.getStorageSync('currentUser')
          const { data } = await UserCommunity.doc(result._id).get()
          currentUser.userCommunity = data
          wx.setStorageSync('currentUser', currentUser)
        }
      }
    })
  }
})

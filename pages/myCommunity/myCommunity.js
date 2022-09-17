// pages/myCommunity/myCommunity.js
const db = wx.cloud.database()
const _ = db.command
const UserCommunity = db.collection('UserCommunity')
const Community = db.collection('Community')
const CommunityManager = db.collection('CommunityManager')

Page({
  data: {
    communityInfo: {}, // 所在的小区
    application: {}, // 申请的小区
    adminInfo: {}, // 管理员身份
    applyAdmin: {}, // 申请管理员
    memberList: [], // 成员
    applyMember: [] // 申请中的成员
  },

  /**
   * 页面显示
   */
  onShow() {
    // 获取申请表
    this.getUserCommunity()
    // 获取成员
    // this.getMemberList()
  },

  // 获取申请表
  async getUserCommunity() {
    let _openid = wx.getStorageSync('currentUser')._openid
    // 1. 获取关系表
    let communityData = await UserCommunity.where({_openid}).get()
    let managerData = await CommunityManager.where({_openid}).get()

    // 处理数据
    this.handleData(communityData, ['communityInfo', 'application'])
    this.handleData(managerData, ['adminInfo', 'applyAdmin'])
  },

  // 处理申请表数据
  handleData({data}, type) {
    // 2. 遍历获取到的数据 判断数据的status
    data?.forEach(async item => {
      if(!item.status) {
        // 2.1 如果 status === 0 则根据 communityId 获取社区表
        if(type[0] === 'communityInfo') {
          let { data } = await Community.where({_id: item.communityId}).get()
          this.setData({ [type[0]]: data[0] })
          return
        }
        this.setData({ [type[0]]: data[0] })
        if(type[0] === 'adminInfo') this.getMemberList()
      } else {
        // 2.2 如果 status !== 0 则将数据渲染到页面的申请中模块
        this.setData({ [type[1]]: item })
      }
    })
  },

  // 获取成员
  getMemberList() {
    UserCommunity.where({
      communityId: wx.getStorageSync('myCommunity').communityId,
      _openid: _.eq(this.data.adminInfo._openid)
    }).orderBy('createTime', 'desc').get()
    .then(res => {
      let memberList = []
      let applyMember = []
      res.data.forEach(item => {
        item.status ? applyMember.push(item) : memberList.push(item)
      })

      this.setData({
        memberList,
        applyMember
      })
    })
  },

  // 更换小区
  changeCommunity() {
    wx.navigateTo({
      url: '/pages/community/community?type=join'
    })
  },

  // 申请成为管理员
  applyAdmin() {
    wx.showModal({
      title: '提示',
      content: '确定申请成为小区管理员吗！'
    }).then(async res => {
      if (res.confirm) {
        let userInfo = wx.getStorageSync('currentUser')
        // 添加管理员申请表
        let result = await CommunityManager.add({data: {
          communityId: this.data.communityInfo._id,
          managerOpenId: userInfo._openid,
          managerNickName: userInfo.nick_name,
          status: 1,
          applyTime: new Date(),
          adoptTime: new Date()
        }})
        this.setData({ 'applyAdmin._id': result._id })
      }
    })
  },

  // 取消小区申请
  cancelCommunity(event) {
    wx.showModal({
      title: '提示',
      content: '是否取消加入该小区的申请！',
      success: (res) => {
        if (res.confirm) {
          // 删除申请数据表 并更新data
          UserCommunity.doc(event.target.id).remove()
          this.setData({ application: {} })
        }
      }
    })
  },

  // 取消管理员申请
  cancelAdmin(event) {
    wx.showModal({
      title: '提示',
      content: '是否取消成为管理员的申请！',
      success: (res) => {
        if (res.confirm) {
          // 删除申请数据表 并更新data
          CommunityManager.doc(event.target.id).remove()
          this.setData({ applyAdmin: {} })
        }
      }
    })
  },

  // 驳回申请
  onReject(event) {
    console.log('event', event)
  },

  // 通过申请
  onAdopt(event) {
    console.log('event', event)
  },

  // 踢除成员
  onKick(event) {
    console.log('event', event)
  }
})

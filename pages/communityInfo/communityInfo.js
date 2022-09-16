// pages/communityInfo/communityInfo.js
const db = wx.cloud.database()
const UserCommunity = db.collection('UserCommunity')
const CommunityManager = db.collection('CommunityManager')

Page({
  data: {
    search: '',
    adminList: [], // 管理员
    memberList: [] // 普通成员
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    // 获取小区 成员/管理员
    this.getCommunityUser(options.id)
  },

  // 获取小区 成员/管理员
  async getCommunityUser(id) {
    let member = await UserCommunity.where({communityId: id, status: 0}).get()
    let admin = await CommunityManager.where({communityId: id}).get()

    // 将管理员的普通用户去除
    let newMember = admin.data.length ? [] : member.data
    member.data.forEach(mItem => {
      admin.data.forEach(aItem => {
        if(mItem._openid !== aItem._openid) newMember.push(mItem)
      })
    })
   
    this.setData({
      memberList: newMember,
      adminList: admin.data
    })
  },

  // 确定搜索时触发
  onSearch(event) {
    console.log('event.detail', event.detail)
  },

  // 通过的处理函数
  onAdopt(event) {
    console.log('event.target.id', event.target.id)
  },

  // 驳回的处理函数
  onReject(event) {
    console.log('event.target.id', event.target.id)
  },

  // 免职的处理函数
  onDetele(event) {
    console.log('event.target.id', event.target.id)
  },

  // 踢除的处理函数
  onKick(event) {
    console.log('event.target.id', event.target.id)
  }
})

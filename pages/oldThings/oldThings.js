// pages/oldThings/oldThings.js
Page({
  data: {
    listData: [], // 列表数据
    pageIndex: 1, // 当前分页
    pageSize: 5, // 每次获取数据数量
    reachBottom: false // 是否到底部
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    // 获取闲置物品
    this.getIdleItem()
  },

  // 获取闲置物品
  async getIdleItem() {
    const { pageIndex, pageSize, reachBottom } = this.data

    if(reachBottom) return

    const data = { pageIndex, pageSize }
    const { result } = await wx.cloud.callFunction({
      name: 'getIdleItem',
      data
    })
    this.setData({ listData: result.data })
  },

  // 跳转到闲物详情
  toIdleInfo(event) {
    wx.navigateTo({
      url: `/pages/idleInfo/idleInfo?id=${event.currentTarget.id}`
    })
  },

  // 跳转到发布页面
  toRelease() {
    wx.navigateTo({
      url: '/pages/release/release'
    })
  }
})

// pages/oldThings/oldThings.js
Page({
  data: {
    listData: [], // 列表数据
    searchValue: '', // 搜索
    pageIndex: 1, // 当前分页
    pageSize: 10, // 每次获取数据数量
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
  async getIdleItem(searchValue) {
    const { pageIndex, pageSize, reachBottom, listData } = this.data

    if(reachBottom) return

    const data = { pageIndex, pageSize }
    // 判断是否有搜索内容
    if(searchValue) data.searchValue = searchValue
    const { result } = await wx.cloud.callFunction({
      name: 'getIdleItem',
      data
    })

    // 如果没有数据了则将 reachBottom 设为 true
    if(!result.data.length) this.setData({ reachBottom: true })

    let newListData = result.data.length ? result.data : []
    if(pageIndex > 1) newListData = listData.concat(result.data)

    // 更新data
    this.setData({ listData: newListData })
  },

  // 搜索
  onSearch(event) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 500
    })
    this.getIdleItem(event.detail.searchValue)
    this.setData({searchValue: event.detail.searchValue})
  },

  // 跳转到好物详情
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
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
   onPullDownRefresh: async function() {
    this.setData({
      pageIndex: 1,
      listData: [],
      reachBottom: false
    })
    await this.getIdleItem()
    // 解决下拉刷新不回弹
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(this.data.reachBottom)
    if(this.data.reachBottom) return

    this.setData({
      pageIndex: this.data.pageIndex + 1
    })

    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 500
    })
    this.getIdleItem(this.data.searchValue)
  }
})

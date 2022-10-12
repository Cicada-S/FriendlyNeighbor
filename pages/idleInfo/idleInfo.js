// pages/idleInfo/idleInfo.js
Page({
  data: {
    idleInfo: {}
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    // 获取闲物详情
    this.getIdleInfo(options.id)
  },

  // 获取闲物详情
  async getIdleInfo(id) {
    const { result } = await wx.cloud.callFunction({
      name: 'getIdleInfo',
      data: { id }
    })

    this.setData({ idleInfo: result.data })
  }
})

// pages/myPost/myPost.js
import { toDates } from '../../utils/util'
import { getdate } from '../../utils/pastTime'

Page({
  data: {
    postList: []
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    console.log(options)

    // 获取帖子
    this.getPostList()
  },

  // 获取帖子
  async getPostList() {
    let { result } = await wx.cloud.callFunction({name: 'getPostList'})

    result.data.forEach(item => {
      // 处理最早时间和最迟时间
      item.beginTime = toDates(item.beginTime, 'display')
      item.endTime = toDates(item.endTime, 'display')
      // 处理发布时间
      item.createTime = getdate(item.createTime)
    })

    this.setData({ postList: result.data })
  }
})

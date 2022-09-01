// pages/myPost/myPost.js
import { toDates } from '../../utils/util'
import { getdate } from '../../utils/pastTime'

const db = wx.cloud.database()
const HitchhikingInformation = db.collection('HitchhikingInformation')

Page({
  data: {
    postList: []
  },

  /**
   * 页面加载
   */
  onLoad() {
    // 获取帖子
    this.getPostList()
  },

  // 获取帖子
  async getPostList() {
    let result = await HitchhikingInformation.where({ 
      _openid: wx.getStorageSync('currentUser')._openid 
    }).get()

    result.data.forEach(item => {
      // 处理最早时间和最迟时间
      item.beginTime = toDates(item.beginTime, 'display')
      item.endTime = toDates(item.endTime, 'display')
      // 处理发布时间
      item.createTime = getdate(item.createTime)
    })

    this.setData({ postList: result.data })
  },

  // 删除帖子
  noDelete(event) {
    wx.showModal({
      title: '提示',
      content: '确定删除帖子吗？',
      success: (res) => {
        if (res.confirm) {
          HitchhikingInformation.doc(event.detail.id).remove()
          .then(() => {
            // 更新data
            let newPostList = this.data.postList.filter(item => {
              if(item._id !== event.detail.id) return item
            })
            this.setData({ postList: newPostList })
          })
        }
      }
    })
  }
})

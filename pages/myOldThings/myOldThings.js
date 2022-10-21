// pages/myOldThings/myOldThings.js
const db = wx.cloud.database()
const IdleItem = db.collection('IdleItem')
const IdleItemSpecification = db.collection('IdleItemSpecification')
const IdleItemVideoImage = db.collection('IdleItemVideoImage')

Page({
  data: {
    listData: [], // 列表数据
    pageIndex: 1, // 当前分页
    pageSize: 10, // 每次获取数据数量
    reachBottom: false, // 是否到底部
    isEmpty: false
  },

  /**
   * 页面加载
   */
  onLoad() {
    // 获取闲置物品
    this.getIdleItem()
  },

  // 获取闲置物品
  async getIdleItem() {
    const { pageIndex, pageSize, reachBottom, listData } = this.data

    if(reachBottom) return

    const openId = wx.getStorageSync('currentUser')._openid

    const data = { pageIndex, pageSize, openId }
    const { result } = await wx.cloud.callFunction({
      name: 'getIdleItem',
      data
    })

    // 如果没有数据了则将 reachBottom 设为 true
    if(!result.data.length) this.setData({ reachBottom: true })

    if(!result.data.length && !this.data.listData.length) this.setData({ isEmpty: true })

    let newListData = result.data.length ? result.data : []
    if(pageIndex > 1) newListData = listData.concat(result.data)

    // 更新data
    this.setData({ listData: newListData })
  },

  // 删除行程信息
  noDelete(event) {
    wx.showModal({
      title: '提示',
      content: '确定该物品信息吗？',
      success: (res) => {
        if (res.confirm) {
          // 删除好物数据表
          IdleItem.doc(event.target.id).remove()
          .then(() => {
            // 更新data
            let newListData = this.data.listData.filter(item => {
              if(item._id !== event.target.id) return item
            })
            // 数据是否为空
            if(!newListData.length) this.setData({isEmpty: true})
            // 更新data
            this.setData({ listData: newListData })
          })
          // 删除规格数据表
          IdleItemSpecification.where({ IdleItemId:event.target.id }).remove()
          // 删除云存储的图片
          this.deleteFile(event.target.id)
        }
      }
    })
  },

  // 删除云存储的图片
  async deleteFile(id) {
    const { data } = await IdleItemVideoImage.where({ IdleItemId: id }).get()
    const fileList = data.map(item => item.path)
    // 删除图片
    wx.cloud.deleteFile({ fileList })
    .then(() => {
      // 删除图片数据表
      IdleItemVideoImage.where({ IdleItemId: id }).remove()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if(this.data.reachBottom) return

    this.setData({
      pageIndex: this.data.pageIndex + 1
    })

    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 500
    })
    this.getIdleItem()
  }
})

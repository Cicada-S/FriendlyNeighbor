// pages/release/release.js
const db = wx.cloud.database()

Page({
  data: {
    name: '', // 商品名称
    price: null, // 价格
    radio: '0', // 取货方式
    phone: '', // 手机号
    remark: '' // 备注
  },

  // 切换取货方式
  onRadioChange(event) {
    this.setData({ radio: event.detail })
  },

  // 授权手机号的回调函数
  async getPhoneNumber(event) {
    const errMsg = event.detail.errMsg
    // 同意授权则执行下面代码
    if (errMsg === "getPhoneNumber:ok") {
      const cloudId = event.detail.cloudID
      const cloudIdList = [cloudId]
      wx.showLoading({
        title: '获取中',
        mask: true
      })
      const cloudFunRes = await wx.cloud.callFunction({
        name: "getMobile",
        data: { cloudIdList }
      })

      const jsonStr = cloudFunRes.result.dataList[0].json
      const jsonData = JSON.parse(jsonStr)
      const phoneNumber = jsonData.data.phoneNumber

      wx.hideLoading()
      this.setData({ phone: phoneNumber })
      db.collection('User').doc(wx.getStorageSync('currentUser')._id).update({data: { phone: phoneNumber }})
    }
  },

  // 发布
  onRelease() {
    console.log('发布')
  }
})

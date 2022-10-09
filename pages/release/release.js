// pages/release/release.js
const db = wx.cloud.database()

Page({
  data: {
    name: '', // 商品名称
    price: null, // 价格
    radio: '0', // 取货方式
    phone: '', // 手机号
    remark: '', // 备注
    specifications: [{key: '', value: ''}], // 规格
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

  // 删除规格
  delSpec(event) {
    let id = event.target.id
    let { specifications } = this.data
    let newSpecifications = specifications.filter((item, index) => index != id)
    console.log('newSpecifications', newSpecifications)
    this.setData({ specifications: newSpecifications })
  },

  // 监听规格中输入框的值
  onChangeSpec(event) {
    let { index, type } = event.currentTarget.dataset
    // 将 event.detail 赋值到对应的index上
    this.setData({
      [`specifications[${index}].${type}`]: event.detail
    })
  },

  // 添加规格
  addSpec() {
    console.log('addSpec')
    let { specifications } = this.data
    specifications.push({key: '', value: ''})
    this.setData({ specifications })
  },

  // 发布
  onRelease() {
    console.log('发布')
  }
})

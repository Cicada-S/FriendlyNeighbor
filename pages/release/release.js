// pages/release/release.js
const app = getApp()
const db = wx.cloud.database()

const type = {
  first: 'firstList',
  details: 'detailsList',
}

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    name: '', // 商品名称
    price: null, // 价格
    radio: '0', // 取货方式
    phone: '', // 手机号
    remark: '', // 备注
    specifications: [{key: '', value: ''}], // 规格
    firstList: [], // 首图的数据
    detailsList: [], // 详情图的数据
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
    let { specifications } = this.data
    specifications.push({key: '', value: ''})
    this.setData({ specifications })
  },

  // 文件读取完成后
  afterRead(event) {
    this.data[type[event.target.id]].push(...event.detail.file)
    this.setData({
      [type[event.target.id]]: this.data[type[event.target.id]]
    })
  },

  // 删除图片的方法
  onDelete(event) {
    const id = event.target.id
    let newList = this.data[type[id]]?.filter((item, index) => index !== event.detail.index)
    this.setData({
      [type[id]]: newList
    })
  },

  // 发布
  onRelease() {
    let { bottomLift, specifications, firstList, detailsList, ...form } = this.data
    let newSpec = []
    // 将规格的每一个属性取出来
    specifications.forEach(item => newSpec.push(...Object.values(item)))
    const isEmptyArr = [...Object.values(form), ...newSpec, firstList, detailsList]
    let emoty = true
    // 遍历判断每一项是否为空
    isEmptyArr.forEach(item => {
      if(this.isEmpty(item)) {
        emoty = false
        return wx.showToast({
          title: '所有选项都是必填项！',
          icon: 'none',
          duration: 2000
        })
      }
    })
    
    if(emoty) {
      console.log('发布')
    }
  },

  // 判断是否为空
  isEmpty(target) {
    const bol = target !== undefined && target !== null
    const type = bol ? this.getVariableType(target) : '[object String]'
    const value = bol ? target : ''
    switch(type) {
    case '[object Object]':
      return Object.keys(value).length < 1
    case '[object Array]':
      return value.length < 1
    default:
      return String.prototype.trim.call(value) === ''
    }
  },

  getVariableType(variable) {
    return Object.prototype.toString.call(variable)
  }
})

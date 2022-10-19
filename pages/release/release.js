// pages/release/release.js
const app = getApp()
const db = wx.cloud.database()

import { uuid } from "../../utils/uuid"
import { pathOfDate } from "../../utils/util"

const type = {
  first: 'firstList',
  details: 'detailsList'
}
// 添加到数据表中的图片path
let upCloudImage = {
  first: [],
  details: []
}

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    name: '', // 商品名称
    price: null, // 价格
    radio: '0', // 取货方式
    phone: '', // 手机号
    remark: '', // 备注
    specifications: [{name: '', value: ''}], // 规格
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
    specifications.push({name: '', value: ''})
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
  async onRelease() {
    let { bottomLift, specifications, firstList, detailsList, remark, ...form } = this.data
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
      wx.showLoading({title: '发布中...'})
      
      // 将图片上传到云存储
      await this.upCloud(firstList, 'first')
      await this.upCloud(detailsList, 'details')

      const { nick_name, avatar_url } = wx.getStorageSync('currentUser')
      form.nickName = nick_name
      form.avatarUrl = avatar_url
      // 给每个规格添加上order
      specifications.forEach((item, index) => item.order = index)
      // upCloudImage转成数组
      const newUpCloudImage = Object.values(upCloudImage).flat()
      const data = {
        IdleItem: form,
        IdleItemSpecification: specifications,
        IdleItemVideoImage: newUpCloudImage
      }

      // 发布好物的请求
      const { result } = await wx.cloud.callFunction({
        name: 'addIdleItem',
        data
      })

      // 发布成功
      if(result.code === 0) {
        console.log('result', result)
        wx.hideLoading()
        // 清空upCloudImage
        upCloudImage = { first: [], details: [] }
        wx.showToast({
          title: '发布成功！',
          icon: 'success',
          duration: 1000
        })

        wx.redirectTo({url: `/pages/idleInfo/idleInfo?id=${result.data._id}`})
        wx.setStorageSync('newIdleItem', true)
      }
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
  },

  // 将图片上传到云存储
  upCloud(imageList, type) {
    let worker = []
    // 遍历上传图片
    imageList.forEach((item, index) => {
      let cloudPath = pathOfDate() + uuid() + item.url.match(/.[^.]+$/)[0]
      // 上传图片
      let process = wx.cloud.uploadFile({
        cloudPath,
        filePath: item.url
      })
      .then(res => {
        // 标记图片 首图为 0 详情图为 1 
        let typeID = type === 'first' ? 0 : 1
        upCloudImage[type].push({
          path: res.fileID,
          type: typeID,
          order: index
        })
      })
      worker.push(process)
    })
    return Promise.all(worker)
  }
})

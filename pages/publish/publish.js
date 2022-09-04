// pages/publish/publish.js
const app = getApp()
// 引入toDates将时间戳转换成时间
import { toDates } from '../../utils/util'

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    radio: '0', // 类型
    numberOfPeople: '', // 人数/座位
    phone: '', // 手机号
    price: '', // 价格
    departPlace: '', // 出发地
    destination: '', // 到达地
    beginTime: '', // 最早出发时间
    endTime: '', // 最迟出发时间
    remark: '', // 备注
    // 时间选择器
    timeType: '', // 时间类型 开始 结束
    show: false, // 时间选择器的显示状态
    timeStamp: { // 用于传给后端的时间戳
      beginTime: '',
      endTime: '',
    },
    minDate: new Date().getTime(), // 可选的最小时间
    currentDate: new Date().getTime(), // 当前时间
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    console.log('页面加载')
    // 数据回显
    this.dataEcho('people')
  },

  // 切换类型
  onRadioChange(event) {
    this.setData({ radio: event.detail })
    let type = event.detail === '0' ? 'people' : 'vehicle'
    // 数据回显
    this.dataEcho(type)
  },

  // 数据回显
  dataEcho(type) {
    let { phone, price, departPlace, destination, remark, numberOfPeople } = wx.getStorageSync(type)
    this.setData({
      phone,
      price,
      departPlace,
      destination,
      remark,
      numberOfPeople
    })
  },

  // 选择时间
  selectTime(event) {
    this.setData({
      timeType: event.currentTarget.id,
      show: true
    })
  },

  // 时间选择器 点击取消和遮罩层 的回调函数
  onCancel() {
    this.setData({ show: false })
  },

  // 时间选择器 点击确定 的回调函数
  onConfirm(event) {
    console.log(event)
    let newDate = event.detail
    this.setData({
      [this.data.timeType]: toDates(newDate),
      ['timeStamp.' + this.data.timeType]: newDate,
      show: false
    })
  },

  // 发布行程信息
  onRelease() {
    let {
      radio, phone, price,
      departPlace, destination,
      timeStamp, remark, numberOfPeople
    } = this.data

    let userInfo = wx.getStorageSync('currentUser')

    let data = {
      communityId: userInfo.communityId,
      nick_name: userInfo.nick_name,
      avatar_url: userInfo.avatar_url,
      communityName: userInfo.communityName,
      type: radio,
      numberOfPeople,
      phone,
      price,
      departPlace,
      destination,
      beginTime: timeStamp.beginTime,
      endTime: timeStamp.endTime,
      remark
    }

    const { communityId, nick_name, avatar_url, communityName, type, ...empty } = data
    delete empty.remark

    let flag = false
    Object.values(empty).forEach((value, index) => {
      if(flag) return
      let text = [radio==0?'座位':'人数', '手机号', '价格', '出发地', '到达地', '最早时间', '最迟时间']
      if(!String(value).trim()) {
        flag = true
        return wx.showToast({
          title: `${text[index]}不能为空！`,
          icon: 'none',
          duration: 1000
        })
      }
    })

    if(!flag) {
      data.beginTime = new Date(timeStamp.beginTime)
      data.endTime = new Date(timeStamp.endTime)

      wx.showLoading({
        title: '发布中...'
      })
      let type = data.type === '0' ? 'people' : 'vehicle'
      wx.setStorageSync(type, data)
      // 添加行程信息
      wx.cloud.callFunction({
        name: 'addPost',
        data
      }).then(() => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功！',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack({ delta: 1 })
        }, 1000)
      })
    }
  }
})

// pages/publish/publish.js
const app = getApp()
const db = wx.cloud.database()

// 引入toDates将时间戳转换成时间
import { toDates } from '../../utils/util'

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    radio: '0', // 类型
    numberOfPeople: 4, // 人数/座位
    phone: '', // 手机号
    price: 0, // 价格
    departPlace: '', // 出发地
    destination: '', // 到达地
    beginTime: '', // 最早出发时间
    endTime: '', // 最晚出发时间
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
    if(wx.getStorageSync('defaultType')) {
      this.dataEcho(wx.getStorageSync('defaultType'))
    }
  },

  // 切换类型
  onRadioChange(event) {
    let quantity = event.detail === '1' ? 1 : 4
    this.setData({
      radio: event.detail,
      numberOfPeople: quantity
    })

    let type = event.detail === '0' ? 'people' : 'vehicle'
    // 数据回显
    this.dataEcho(type)
  },

  // 数据回显
  dataEcho(type) {
    if(wx.getStorageSync(type)) {
      let radio = type == 'people' ? '0' : '1'
      let { phone, price, departPlace, destination, numberOfPeople } = wx.getStorageSync(type)
      this.setData({
        phone,
        price,
        departPlace,
        destination,
        numberOfPeople,
        radio
      })
    }
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
    let newDate = event.detail

    // 如果最晚/最早如果没有值，赋予它一直跟最早/最晚一样的值
    if(this.data.timeType === 'beginTime') {
      if(!this.data.endTime) this.setData({
        endTime: toDates(newDate),
        'timeStamp.endTime': newDate
      })
    } else {
      if(!this.data.beginTime) this.setData({
        beginTime: toDates(newDate),
        'timeStamp.beginTime': newDate
      })
    }

    // 更新data
    this.setData({
      [this.data.timeType]: toDates(newDate),
      ['timeStamp.' + this.data.timeType]: newDate,
      show: false
    })
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
      this.setData({
        'phone': phoneNumber
      })
      wx.hideLoading()
      db.collection('User').doc(wx.getStorageSync('currentUser')._id).update({data: { phone: phoneNumber }})
    }
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
      communityId: userInfo.userCommunity.communityId,
      nick_name: userInfo.nick_name,
      avatar_url: userInfo.avatar_url,
      communityName: userInfo.userCommunity.name,
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
      let text = [radio==0?'座位':'人数', '手机号', '价格', '出发地', '到达地', '最早时间', '最晚时间']
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
      data.beginTime = timeStamp.beginTime
      data.endTime = timeStamp.endTime

      wx.showLoading({ title: '发布中...' })
      let type = data.type === '0' ? 'people' : 'vehicle'

      // 如果是人找车，价格设置为0
      if(data.type === '1') {
        data.price = 0
      }
      data.type = Number(data.type)
      wx.setStorageSync(type, data)
      wx.setStorageSync('defaultType', type)

      // 添加行程信息
      wx.cloud.callFunction({
        name: 'addPost',
        data
      }).then((res) => {
        wx.hideLoading()

        if(res.result.code == 1){
          wx.showToast({
            title: res.result.error,
            icon: 'error',
            duration: 2000
          })
          return
        }

        // 删除首页搜索缓存
        wx.removeStorageSync('searchTerm')

        wx.showToast({
          title: '发布成功！',
          icon: 'success',
          duration: 1000
        })

        wx.redirectTo({url: `/pages/post/post?id=${res.result.data._id}`})
        wx.setStorageSync('newPost', true)
      })
    }
  },

  // 反转地址
  reversal() {
    this.setData({
      departPlace: this.data.destination,
      destination: this.data.departPlace
    })
  }
})

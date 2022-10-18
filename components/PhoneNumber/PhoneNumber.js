// components/PhoneNumber/PhoneNumber.js
const db = wx.cloud.database()
const _ = db.command
const GetPhoneNumberLog = db.collection('GetPhoneNumberLog')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phone: {
      optionalTypes: [String, Number],
      value: null
    },
    openId: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 复制手机号
    copyPhone() {
      // 创建获取手机号日志
      const result = this.getPhoneLog(0)

      // 复制手机号
      if(result) wx.setClipboardData({ data: this.data.phone })
      .then(() => {
        wx.showToast({
          title: '复制手机号成功',
          icon: 'none',
          duration: 1500
        })
      })
    }, 

    // 拨打电话
    dialPhone() {
      // 创建获取手机号日志
      const result = this.getPhoneLog(1)

      // 拨打电话
      if(result) wx.makePhoneCall({
        phoneNumber: this.data.phone
      })
    },

    // 创建获取手机号日志
    async getPhoneLog(type) {
      const _openid = wx.getStorageSync('currentUser')._openid
      const openIdBeingCalled = this.data.openId
      // 获取当前时间把 Date 对象的日期部分转换为字符串 1971/01/01
      const today = new Date().toLocaleDateString()
  
      // 查询日志
      const { data } = await GetPhoneNumberLog.where({
        _openid,
        createTime: _.and(_.gte(new Date(today+" 00:00:00")),_.lte(new Date(today+" 23:59:59")))
      }).get()
  
      console.log('data', data)
      // 判断当天的日志数量
      if(data.length >= 6) {
        wx.showToast({
          title: '每天只能获取6个手机号',
          icon: 'error',
          duration: 2000
        })
        return false
      } else {
        let iseEstablish = false 
        data.forEach(item => {
          if(item.openIdBeingCalled === openIdBeingCalled) iseEstablish = true
        })
        // 判断是否创建了数据表
        if(!iseEstablish) {
          // 新建日志表
          GetPhoneNumberLog.add({data: {
            openIdBeingCalled,
            type,
            createTime: new Date()
          }})
        }
        return true
      }
    }
  }
})

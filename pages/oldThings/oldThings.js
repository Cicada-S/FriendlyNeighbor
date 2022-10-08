// pages/oldThings/oldThings.js
Page({
  data: {
    listData: [
      {
        _id: '12314',
        name: '测试',
        price: 123,
        deliveryMethod: 0, 
        remark: '打发顺丰达SV艾弗森',
        phone: '12314124',
        createTime: '',
        path: '',
      },
      {
        _id: '12314',
        name: '测试',
        price: 123,
        deliveryMethod: 0, 
        remark: '个省份顺丰顺丰二妃山润肤乳设的粉色',
        phone: '12314124',
        createTime: '',
        path: '',
      },
      {
        _id: '12314',
        name: '测试',
        price: 123,
        deliveryMethod: 0, 
        remark: '发的完全对称我去人才完成W大外侧是人工费是否为啊啊啊',
        phone: '12314124',
        createTime: '',
        path: '',
      },
      {
        _id: '12314',
        name: '测试',
        price: 123,
        deliveryMethod: 0, 
        remark: '安达市大所多撒多群',
        phone: '12314124',
        createTime: '',
        path: '',
      }
    ]
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    console.log('options', options)
  },

  // 跳转到发布页面
  toRelease() {
    wx.navigateTo({
      url: '/pages/release/release'
    })
  }
})

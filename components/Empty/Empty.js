// components/Empty/Empty.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'search'
    },
    tips: {
      type: String,
      value: '没有数据啦~'
    },
    path: {
      type: String,
      value: 'index'
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
    onJump() {
      const { path } = this.data
      wx.switchTab({url: `/pages/${path}/${path}`})
    }
  }
})

// components/CommentBox/CommentBox.js
let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String, 
      value: ''
    },
    focus: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: String,
      value: '评论...'
    },
    isDisabled: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bottomLift: app.globalData.bottomLift,
    inputBottom: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 评论
    hairComment() {
      this.triggerEvent('hairComment')
    },

    // 评论框获取焦点
    inputFocus(event) {
      this.setData({ inputBottom: event.detail.height })
    },

    // 评论框失去焦点
    inputBlur() {
      this.triggerEvent('inputBlur')
      this.setData({ inputBottom: 0 })
    }
  }
})

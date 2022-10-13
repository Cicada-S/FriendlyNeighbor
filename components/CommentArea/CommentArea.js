// components/CommentArea/CommentArea.js
let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentList: {
      type: Object,
      value: {}
    },
    commentSum: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bottomLift: app.globalData.bottomLift
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击父评论
    replyComment(event) {
      let { id, dataset } = event.currentTarget
      this.triggerEvent('replyComment', { id, dataset })
    },

    // 点击子评论
    answerComment(event) {
      let { id, dataset } = event.currentTarget
      this.triggerEvent('answerComment', { id, dataset })
    }
  }
})

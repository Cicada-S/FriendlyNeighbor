// components/PostItem/PostItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    postItem: {
      type: Object,
      value: {}
    },
    operation: {
      type: Boolean,
      value: false
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
    // 删除
    noDelete(event) {
      this.triggerEvent('noDelete', {
        id: event.target.id
      })
    }
  }
})

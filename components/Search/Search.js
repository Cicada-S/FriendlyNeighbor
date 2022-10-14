// components/Search/Search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    searchValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    search() {
      if(!this.data.searchValue) return

      this.triggerEvent('search', {
        searchValue: this.data.searchValue
      })
    }
  }
})

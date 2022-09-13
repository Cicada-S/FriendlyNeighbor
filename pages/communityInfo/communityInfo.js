// pages/communityInfo/communityInfo.js
Page({
  data: {
    search: '',
    memberList: [
      {
        _id: '1231',
        nickName: 'Cicada',
        avatarUrl: '',
        status: 1
      },
      {
        _id: '231131',
        nickName: 'Ting',
        avatarUrl: '',
        status: 0
      },
      {
        _id: '31231',
        nickName: 'Cicada',
        avatarUrl: '',
        status: 0
      }
    ]
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    console.log('页面加载', options.id)
  },

  // 确定搜索时触发
  onSearch(event) {
    console.log('event.detail', event.detail)
  },

  // 通过的处理函数
  onAdopt(event) {
    console.log('event.target.id', event.target.id)
  },

  // 删除的处理函数
  onDetele(event) {
    console.log('event.target.id', event.target.id)
  }
})

// app.js
// 引入checkUpdateVersion检测小程序是否为最新版本
// import { checkUpdateVersion } from '../../utils/check'

App({
  globalData: {
    stateheight: 0, // 手机状态栏高度
    navhegiht: 0, // 导航栏高度
    customheight: 0, // 自定以导航栏高度
    bottomLift: 0, // 底部距离
  },

  onLaunch() {
    wx.cloud.init({
      env: 'cloud1-9gd9p087be4105a2',
      // env: 'prod-4gajjv6022f1fb50',
      traceUser: true
    })

    // 版本自动更新代码
    // checkUpdateVersion()

    this.getPhoneHeight()
    this.getSystemInfo()
  },

  // 获取 状态栏 导航栏 自定义导航栏 高度
  getPhoneHeight() {
    // 获取手机状态栏信息和高度
    const phoneinfo = wx.getSystemInfoSync()
    const stateheight = phoneinfo.statusBarHeight
    // 获取胶囊按钮的信息
    const button = wx.getMenuButtonBoundingClientRect()
    // 获取导航栏高度
    const navhegiht = button.height + (button.top - stateheight) * 2
    // 计算自定义导航栏高度
    const customheight = navhegiht + stateheight
    // 赋值
    this.globalData.stateheight = stateheight
    this.globalData.navhegiht = navhegiht
    this.globalData.customheight = customheight
  },

  // 获取 iPhoneX底部 高度
  getSystemInfo() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.bottomLift = res.screenHeight - res.safeArea.bottom;
      }
    })
  }
})

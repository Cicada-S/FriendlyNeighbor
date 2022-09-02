// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const cloudIdList = event.cloudIdList

  try {
    const result = await cloud.openapi.cloudbase.getOpenData({
      openid: openid,
      cloudidList: cloudIdList
    })

    return result
  }
  catch (err) {
    console.error('transaction error')
    return {
      code: 1,
      success: false
    }
  }
}

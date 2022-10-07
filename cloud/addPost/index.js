// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let { userInfo, ...data } = event

  //内容安全监测
  const msgSecCheckRes = await cloud.callFunction({
    name: 'msgSecCheck',
    data: { text: departPlace + destination + remark }
  })
  if (msgSecCheckRes.result.errcode != 0) {
    return {
      code: 1,
      error: '文字內容违规',
      success: false,
    }
  }

  data._openid = cloud.getWXContext().OPENID
  data.createTime =  new Date()
  data.beginTime = new Date(data.beginTime)
  data.endTime = new Date(data.endTime)

  const result = await db.collection('HitchhikingInformation').add({data})

  return {
    code: 0,
    data: result,
    success: true
  }
}

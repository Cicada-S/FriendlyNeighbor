// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  let result = await db.collection('HitchhikingInformation')
  .orderBy('createTime', 'desc').get()
  console.log(result)

  return {
    code: 0,
    data: result.data,
    success: true
  }
}

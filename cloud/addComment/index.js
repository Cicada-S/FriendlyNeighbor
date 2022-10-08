// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // 解决在手机上传数据时多出来的userInfo字段
  let { userInfo, ...data } = event

  try {
    //内容安全监测
    const msgSecCheckRes = await cloud.callFunction({
      name: 'msgSecCheck',
      data: { text: data.content }
    })
    if (msgSecCheckRes.result.errcode != 0) {
      return {
        code: 1,
        error: '文字內容违规',
        success: false,
      }
    }

    let result = {}
    if(data.fatherCommentId) {
      result = await db.collection('SonComment').add({data})
    } else {
      result = await db.collection('FatherComment').add({data})
    }

    return {
      code: 0,
      data: result._id,
      success: true      
    }
  }
  catch(err) {
    console.error('transaction error')
    return {
      code: 1,
      success: false
    }
  }
}

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 添加数据表
    let community = await db.collection('Community').add({
      data: {
        _openid: cloud.getWXContext().OPENID,
        name: event.name,
        qrCodePath: '',
        province: event[0],
        city: event[1],
        county: event[2],
        status: 0,
        createTime: new Date()
      }
    })
  
    // 生成小程序码
    const result = await cloud.openapi.wxacode.getUnlimited({
      "scene": community._id,
      "checkPath": false
    })
  
    // 将生成的小程序码存储到云空间
    const upload = await cloud.uploadFile({
      cloudPath: Date.now() + '.png', // 小程序码的文件名
      fileContent: result.buffer // 要上传文件资源的路径
    })
  
    // 更新数据表 将数据表的 qrCodePath 属性重新赋值成小程序码的文件路径
    db.collection('Community').doc(community._id).update({data: { qrCodePath: upload.fileID }})

    return {
      code: 0,
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

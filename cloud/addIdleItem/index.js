// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { IdleItem, IdleItemSpecification, IdleItemVideoImage } = event

  // 给数据添加上发布者id和创建时间
  IdleItem._openid = cloud.getWXContext().OPENID
  IdleItem.createTime = new Date()

  try {
    // 添加闲置物品
    let result = await db.collection('IdleItem').add({data: IdleItem})

    // 闲置物品图片
    await IdleItemVideoImage.forEach(item => {
      item.IdleItemId = result._id
      db.collection('IdleItemVideoImage').add({data: item})
    })
    // 闲置物品规格
    await IdleItemSpecification.forEach(item => {
      item.IdleItemId = result._id
      db.collection('IdleItemSpecification').add({data: item})
    })

    // 成功返回
    return {
      code: 0,
      data: result,
      success: true
    }
  }
  catch(err) {
    console.error('transaction error')
    // 失败返回
    return {
      code: 1,
      error: err,
      success: false
    }
  }
}

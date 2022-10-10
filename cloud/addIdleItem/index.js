// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('event', event)

  const { IdleItem, IdleItemSpecification, IdleItemVideoImage } = event

  // 给数据添加上发布者id和创建时间
  IdleItem._openid = cloud.getWXContext().OPENID
  IdleItem.createTime = new Date()

  try {
    // 添加闲置物品
    await db.collection('IdleItem').add({data: IdleItem})
    .then(res => {
      // 闲置物品图片
      Object.values(IdleItemVideoImage).forEach(item => {
        item.IdleItemId = res._id
        db.collection('IdleItemVideoImage').add({data: item})
      })
      // 闲置物品规格
      IdleItemSpecification.forEach(item => {
        item.IdleItemId = res._id
        db.collection('IdleItemSpecification').add({data: item})
      })
    })
    // 成功返回
    return {
      code: 0,
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

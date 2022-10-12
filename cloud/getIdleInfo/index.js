// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await db.collection('IdleItem').aggregate()
    .match({ _id: event.id }) // 筛选
    .lookup({ // 查询首图
      from: 'IdleItemVideoImage',
      let: { idleItemId: '$_id' },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$IdleItemId', '$$idleItemId']),
          $.eq(['$type', 0])
        ])))
        .sort({order: 1})
        .done(),
      as: 'firstList'
    })
    .lookup({ // 查询详情图
      from: 'IdleItemVideoImage',
      let: { idleItemId: '$_id' },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$IdleItemId', '$$idleItemId']),
          $.eq(['$type', 1])
        ])))
        .sort({order: 1})
        .done(),
      as: 'detailsList'
    })
    .lookup({ // 查询规格
      from: 'IdleItemSpecification',
      let: { idleItemId: '$_id' },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$IdleItemId', '$$idleItemId'])
        ])))
        .sort({order: 1})
        .done(),
      as: 'specification'
    })
    .end()

    return {
      code: 0,
      data: result.list[0],
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

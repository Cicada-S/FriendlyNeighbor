// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  // 搜索内容
  const screen = {} 
  if(event.searchValue) screen.name = db.RegExp({
    regexp: event.searchValue,
    options: 'i'
  })

  if(event.openId) screen._openid = event.openId

  try {
    const result = await db.collection('IdleItem').aggregate()
    .match(screen) // 筛选
    .sort({ createTime: -1 }) // 排序
    .skip(event.pageSize * (event.pageIndex - 1)) // 跳过第n条开始查询
    .limit(event.pageSize) // 每次查询的数量
    .lookup({ // 查询首图的第一张图片
      from: 'IdleItemVideoImage',
      let: { idleItemId: '$_id' },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$IdleItemId', '$$idleItemId']),
          $.eq(['$type', 0]),
          $.eq(['$order', 0])
        ])))
        .done(),
      as: 'pathUrl'
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
    }).end()

    console.log(result.list)

    return {
      code: 0,
      data: result.list,
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

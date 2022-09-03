// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  // 联表查询
  let result = await db.collection('FatherComment').aggregate()
  .match({postId: event.id})
  .sort({createTime: -1})
  .lookup({
    from: 'SonComment',
    let: { fatherCommentId: '$_id' },
    pipeline: $.pipeline()
      .match(_.expr($.and([
        $.eq(['$fatherCommentId', '$$fatherCommentId'])
      ])))
      .sort({
        createTime: 1
      })
      .done(),
    as: 'child_comment'
  }).end()

  return {
    code: 0,
    data: result.list,
    success: true
  }
}

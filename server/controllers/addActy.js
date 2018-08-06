const { mysql } = require('../qcloud')

module.exports = async ctx => {
  const { name, avatarUrl, motto, imgUrl } = ctx.query
  var uid = Math.random()
  var activity = {
    Uid: uid,
    UName: name,
    UMotto: motto,
    UavatarUrl: avatarUrl,
    imgUrl: imgUrl
  }
  console.log(activity)
  try {
    await mysql('ActivitiesInfo').insert(activity)
    ctx.state.data = {
      msg: 'success'
    }
  } catch (e) {
    console.log(e)
    ctx.state = {
      code: -1,
      data: {
        msg: '评论失败:' + e.sqlMessage  //数据库报错信息
      }
    }
  }
}
const { mysql } = require('../qcloud')

module.exports = async (ctx) => {
  const { uid } = ctx.query

  try {
    uids = await mysql('following').select().where('fromUid', uid)
    var _uids = []
    for(var i in uids){
      _uids.push(uids[i]['toUid'])
    }
    var followers = await mysql('userInfo').select().whereIn('uid', _uids)
    if (followers.length === 0) {
      followers = []
    }
    ctx.body = {
      code: 1,
      followers: followers
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: -1,
      data: e.sqlMessage
    }
  }
}
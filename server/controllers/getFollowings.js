const { mysql } = require('../qcloud')

module.exports = async (ctx) => {
  const { uid } = ctx.query

  try {
    uids = await mysql('following').select('toUid').where('fromUid', uid)
    var _uids = []
    for(var i in uids){
      _uids.push(uids[i]['toUid'])
    }
    followers = await mysql('userInfo').select().whereIn('uid', _uids)
    ctx.bdoy = {
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
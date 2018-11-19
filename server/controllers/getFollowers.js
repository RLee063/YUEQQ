const { mysql } = require('../qcloud')

module.exports = async (ctx) => {
  const { uid } = ctx.query

  try {
    uids = await mysql('following').select('toUid').where('toUid',uid)
    followers = await mysql('userInfo').select().whereIn('uid',uids)
    ctx.bdoy = {
      code:1,
      followers:followers
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: -1,
      data: e.sqlMessage
    }
  }
}
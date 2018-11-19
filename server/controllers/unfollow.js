const { mysql } = require('../qcloud')

module.exports = async (ctx) => {
  const { fromUid, toUid } = ctx.query

  try {

    await mysql('following').where('fromUid',fromUid).andWhere('toUid',toUid).del()

  } catch (e) {
    console.log(e)
    ctx.body = {
      code: -1,
      data: e.sqlMessage
    }
  }
}
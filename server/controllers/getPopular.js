const { mysql } = require('../qcloud')
var tool = require('./tool.js')

module.exports = async (ctx) => {
  const { fromUid, toUid } = ctx.query

  try {
    var activities = await mysql('ActivityInfo').select().whereRaw('StartTime > ?', [tool.getNowFormatDate()]).andWhere('disbanded', 0).orderBy('currentNum', 'desc').limit(3)
    ctx.body = {
      code:1,
      data:activities
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: -1,
      data: e.sqlMessage
    }
  }
}
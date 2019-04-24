    const { mysql } = require('../qcloud')

module.exports = async (ctx) => {
  const {aid, uid} = ctx.query

  try {
    var act = (await mysql('ActivityInfo').select('currentNum').where('aid',aid))[0]
    var user = (await mysql('userInfo').select().where('uid',uid))[0]
    if(act['currentNum']>= act['maxNum']){
      ctx.body = {
        code: -1,
        msg:'活动人数已满'
      }
    } else if (act['creditLimit'] > user['credit']) {
      ctx.body = {
        code: -2,
        msg: '信用值不足'
      }
    }{
      await mysql('userAct').insert({
        aid: aid,
        uid: uid
      })
      await mysql('ActivityInfo').where('aid', aid).increment('currentNum',1)

      ctx.body = {
        code: 1
      }
    }

  }catch(e){
    console.log(e)
    ctx.body = {
      code: -1,
      data: e.sqlMessage
    }
  }
}


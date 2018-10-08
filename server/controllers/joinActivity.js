const { mysql } = require('../qcloud')

module.exports = async (ctx) => {
  const {aid, uid} = ctx.query

  try {
    await mysql('userAct').insert({
      aid:aid,
      uid:uid
    })

    ctx.body = {
      code: 1
    }
  }catch(e){
    console.log(e)
    ctx.body = {
      code: -1,
      data: e.sqlMessage
    }
  }
}
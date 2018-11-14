const { mysql } = require('../qcloud')

module.exports = async (ctx) => {
  const {aid, uid} = ctx.query

  try {
    await mysql('userAct').insert({
      aid:aid,
      uid:uid
    })
    currentNum = (await mysql('ActivityInfo').select('currentNum').where('aid',aid))[0]['currentNum']
    await mysql('ActivityInfo').where('aid',aid).update({'currentNum':currentNum + 1})

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
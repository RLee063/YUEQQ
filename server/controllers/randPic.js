const { mysql } = require('../qcloud')

module.exports = async (ctx) => {
  const { aid } = ctx.query
  try {
    var pics = await mysql('picture').select()
    var n = Math.floor(Math.random()*pics.length)
    
    ctx.body={
      code:1,
      data:pics[n]
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: -1,
      data: {
        msg: 'failed\n' + e.sqlMessage
      }
    }
  }
}
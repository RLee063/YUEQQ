const { mysql } = require('../qcloud')
module.exports = async ctx => {
  try{
    var ans = await mysql.select().table('ActivitiesInfo')
    ctx.body = []
  }
  catch(e){
    console.log(e)
  }
}
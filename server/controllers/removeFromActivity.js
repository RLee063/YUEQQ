const { mysql } = require('../qcloud')

module.exports = async (ctx) => {
  var { aid, members } = ctx.query
  members = members.split(',')
  try {
    for(var i in members){
      await mysql('userAct').where('uid', members[i]).andWhere('aid', aid).del()
      await mysql('ActivityInfo').where('aid', aid).increment('currentNum', -1)
    }


  } catch (e) {
    console.log(e)
    ctx.body = {
      code: -1,
      data: e.sqlMessage
    }
  }
}
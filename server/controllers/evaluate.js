const { mysql } = require('../qcloud')
var sports = new Array('basketball', 'badminton','pingpong','tennis','soccer','running')

module.exports = async (ctx) => {
  const {aid,uid,members} = ctx.query
  try{
    var sportType = (await mysql('ActivityInfo').select('sportType').where('aid', aid))[0]['sportType']
    for (var i in members) {
      await mysql('userInfo').where('uid', members[i]['uid']).increment(sports[sportType], members[i]['evaluation'] * 10)
    }
    await mysql('userAct').where('aid', aid).andWhere('uid', uid).update('evaluated',1)
  }catch(e){
    console.log(e)
    ctx.body = {
      code: -1,
      data: {
        msg: 'failed\n' + e.sqlMessage
      }
    }
  }

}
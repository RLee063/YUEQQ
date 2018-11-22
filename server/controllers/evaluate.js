const { mysql } = require('../qcloud')
var sports = new Array('basketball', 'badminton','pingpong','tennis','soccer','running')

module.exports = async (ctx) => {
  var {aid,uid,up,down} = ctx.query
  // if(up != ""){
  //   up = up.split(',')
  // }
  // if(down != ""){
  //   down = down.split(',')
  // }
  try{
    // var sportType = (await mysql('ActivityInfo').select('sportType').where('aid', aid))[0]['sportType']
    // for (var i in up) {
    //   await mysql('userInfo').where('uid', up[i]).increment(sports[sportType], 10)
    // }
    // for (var i in down) {
    //   await mysql('userInfo').where('uid', down[i]).increment(sports[sportType], -10)
    // }
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
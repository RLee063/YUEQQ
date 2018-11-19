const { mysql } = require('../qcloud')
var sports = new Array('basketball', 'badminton', 'pingpong', 'tennis', 'soccer', 'running')

function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}

module.exports = async(ctx) =>{
  const {uid} = ctx.query
  try{
    var me = (await mysql('userInfo').select().where('uid', uid))[0]
    var others = await mysql('userInfo').select().whereRaw('uid != ?', [uid])
    for(var i in others){
      others[i]['similarity'] = 0
      for(var j in sports){
        others[i]['similarity'] += (me[sports[j]] - others[i][sports[j]]) * (me[sports[j]] - others[i][sports[j]])
      }
    }
    ctx.body = {
      code:1,
      data: others.sort(compare('similarity'))
    }
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
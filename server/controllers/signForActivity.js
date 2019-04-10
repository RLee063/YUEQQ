const {mysql} = require('../qcloud')

module.exports = async(ctx) => {
    var {members,aid} = ctx.query
    members = members.split(',')
    try{
      //签到
        for(var i in members){
            await mysql('userAct').where('aid',aid).andWhere('uid',members[i]).update({'signed':1})
        }
      //降低缺席者的信用值
      var unsigned = await mysql('userAct').select().where('aid',aid).andWhere('signed',0)
      for(var i in unsigned){
        await mysql('userInfo').where('uid', unsigned[i]['uid']).increment('credit',-1)
      }
    } catch(e){
        console.log(e)
        ctx.body = {
          code: -1,
          data: {
            msg: 'failed\n' + e.sqlMessage
          }
        }
    }

}
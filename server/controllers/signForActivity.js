const {mysql} = require('../qcloud')

module.exports = async(ctx) => {
    const{members,aid} = ctx.query
    members = members.split(',')
    try{
        for(var i in members){
            await mysql('userAct').where('aid',aid).andWhere('uid',members[i]['uid']).update({'signed':members[i]['signed']})
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
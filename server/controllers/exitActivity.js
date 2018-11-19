const {mysql} = require('../qcloud')

module.exports = async(ctx) => {
    const{aid,uid} = ctx.query
    try{
      await mysql('userAct').where('aid',aid).andWhere('uid',uid).del()
      await mysql('ActivityInfo').where('aid', aid).increment('currentNum',-1)
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
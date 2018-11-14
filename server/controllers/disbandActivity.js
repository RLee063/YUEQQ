const {mysql} = require('../qcloud')

module.exports = async(ctx) =>{
    const{aid} = ctx.query
    try{
        await mysql('ActivityInfo').where('aid',aid).update({'disbanded':1})
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
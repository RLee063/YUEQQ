const {mysql} = require('../qcloud')
var tool = require('./tool.js')

module.exports = async(ctx) => {
    const {aid} = ctx.query
    try{
        await mysql('ActivityInfo').where('aid',aid).update({'endTime':tool.getNowFormatDate()})
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
const {mysql} = require('../qcloud')
var sports = new Array('basketball', 'badminton', 'pingpong', 'tennis', 'soccer', 'running')

module.exports = async(ctx) => {
    const {uid} = ctx.query
    try {
        resInfo = (await mysql('userInfo as ui').select().where('ui.uid',uid))

        if(resInfo.length === 0){
            ctx.body = {
                code : -1,
                data : {
                    msg : '该用户不存在'
                }
            }
        } else{
            resInfo[0]['skills'] = []
            for(var i in sports){
              resInfo[0]['skills'].push(resInfo[0][sports[i]])            

            }

            ctx.body = {
                code : 1,
                data : resInfo
            }
        }
    } catch (e) {
        console.log('failed to query userInfo' + e.sqlMessage)
        ctx.body = {
        code: -1,
        data: {
          msg: '查询失败' + e.sqlMessage
        }
      }
    }
}
const {mysql} = require('../qcloud')

module.exports = async(ctx) => {
    const {uid} = ctx.query
    try {
        resInfo = (await mysql('UserInfo as ui').join('UserAvatar as ua', 'ua.uid','ui.uid').join('UserHomePic as uhp','ui.uid','uhp.uid').where('ui.uid',uid))

        if(resInfo.length === 0){
            ctx.body = {
                code : -1,
                data : {
                    msg : '该用户不存在'
                }
            }
        } else{

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
const {mysql} = require('../qcloud')

module.exports = async(ctx) => {
    const {uid} = ctx.query
    try {
        var resInfo = await mysql.select().from('UserInfo').where('Uid',uid)
        var resAvtar = await mysql.select().from('UserAvatar').where('Uid',uid)
        var resHomePic = await mysql.select().from('UserHomePic').where('Uid',uid)

        if(resInfo.length === 0){
            ctx.body = {
                code : -1,
                data : {
                    msg : '该用户不存在'
                }
            }
        } else{
            var user = {
                uid : resInfo[0]['Uid'],
                nickName : resInfo[0]['NickName'],
                sex : resInfo[0]['Sex'],
                age : resInfo[0]['Age'],
                Motto : resInfo[0]['Motto'],
                avatarUrl : resAvtar[0]['AvatarUrl'],
                homePicUrl : resHomePic[0]['HomePicUrl']
            }
            ctx.body = {
                code : 1,
                data : user
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
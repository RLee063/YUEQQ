const {mysql} = require('../qcloud')
module.exports = async (ctx) => {

  console.log('login success!')
  var user = {
    Uid: ctx.state.data.userinfo['openId'],
    Age: 0,
    NickName: ctx.state.data.userinfo['nickName'],
    Sex: ctx.state.data.userinfo['gender'],
    Motto: ''
  }

  if ((await mysql.select().from('UserInfo').where('Uid', ctx.state.data.userinfo['openId'])).length === 1) {
    console.log('already registed,now update it')
    try {
      //update 
      await mysql('UserInfo').where('Uid',user['Uid']).update(user)
      await mysql('UserAvatar').where('Uid',user['Uid']).update({AvatarUrl:ctx.state.data.userinfo['avatarUrl']})
      await mysql('UserHomePic').where('Uid',user['Uid']).update({HomePicUrl:''})        
    } catch (e) {
      console.log('failed to update userInfo')
      console.log(e)
    }
  }
  else {
    console.log('first login,now register')
    try {
      await mysql('UserInfo').insert(user)

      await mysql('UserAvatar').insert({
        Uid : user['Uid'],
        AvatarUrl:ctx.state.data.userinfo['avatarUrl']
      })
      
      await mysql('UserHomePic').insert({
        Uid : user['Uid'],
        HomePicUrl:''
      })  
    } catch (e) {
      console.log(e)
    }
  }


}
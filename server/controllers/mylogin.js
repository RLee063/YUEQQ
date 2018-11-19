const {mysql} = require('../qcloud')
module.exports = async (ctx) => {

  console.log('login success!')
  var user = {
    Uid: ctx.state.data.userinfo['openId'],
    Age: 0,
    NickName: ctx.state.data.userinfo['nickName'],
    Sex: ctx.state.data.userinfo['gender'],
    avatarUrl: ctx.state.data.userinfo['avatarUrl']
  }

  if ((await mysql.select().from('userInfo').where('Uid', ctx.state.data.userinfo['openId'])).length === 1) {
    console.log('already registed,now update it')
    try {
      //update 
      await mysql('userInfo').where('Uid',user['Uid']).update(user)
      ctx.body['first'] = 1
    } catch (e) {
      console.log('failed to update userInfo')
      console.log(e)
    }
    
  }
  else {
    console.log('first login,now register')
    try {
      await mysql('userInfo').insert(user)
      ctx.body['first'] = 0
    } catch (e) {
      console.log(e)
    }
  }


}
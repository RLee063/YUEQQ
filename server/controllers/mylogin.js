const {mysql} = require('../qcloud')
module.exports = async (ctx) => {

  console.log('login success!')

  if ((await mysql.select().from('UserInfo').where('Uid', ctx.state.data.userinfo['openId'])).length === 1) {
    console.log('already registed')
  }
  else {
    var user = {
      Uid: ctx.state.data.userinfo['openId'],
      Age: 0,
      NickName: ctx.state.data.userinfo['nickName'],
      Sex: ctx.state.data.userinfo['gender'],
      Motto: ''
    }
    try {
      await mysql('UserInfo').insert(user)
    } catch (e) {
      console.log(e)
    }
  }


}
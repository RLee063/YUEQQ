const {
  mysql
} = require('../qcloud')
var sports = new Array('basketball', 'badminton', 'pingpong', 'tennis', 'soccer', 'running')

module.exports = async (ctx) => {
  const {
    uid,
    homePicUrl,
    credit,
    phone,
    motto,
    grade,
    college,
    skill
  } = ctx.query

  var user = {
    credit: credit,
    phone: phone,
    motto: motto,
    grade: grade,
    college: college,
    homePicUrl: homePicUrl
  }

  if(skill === undefined){
    for(var i in sports){
      user[sports[i]] = skill[i]
    }
  }
  //判断用户是否存在
  try{
    if((await mysql('userInfo').select().where('uid',uid)).length===0){
      ctx.body = {
        code:-1,
        data:'user:'+uid+'doesn\'t exist'
      }
      return
    }
  }catch(e){
    console.log(e)
    ctx.body = {
      code:-1,
      data:e.sqlMessage
    }
  }

 
  //更新信息
  try {
    await mysql('userInfo').where('uid', uid).update()

    ctx.body = {
      code: 1
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: -1,
      data: e.sqlMessage
    }
  }


}
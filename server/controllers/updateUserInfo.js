const {
  mysql
} = require('../qcloud')
var sports = new Array('basketball', 'badminton', 'pingpong', 'tennis', 'soccer', 'running')

module.exports = async (ctx) => {
  var {
    uid,
    homePicUrl,
    credit,
    phone,
    motto,
    grade,
    college,
    skills
  } = ctx.query

  var user = {
    credit: credit,
    phone: phone,
    motto: motto,
    grade: grade,
    college: college,
    homePicUrl: homePicUrl
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
    if (skills === undefined) {

    } else {
      skills = skills.split(',')
      for (var i in sports) {
        user[sports[i]] = skills[i]
      }
      await mysql('userInfo').where('uid', uid).update({'regsisted':1})

    }
    await mysql('userInfo').where('uid', uid).update(user)

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
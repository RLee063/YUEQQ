const {
  mysql
} = require('../qcloud')

module.exports = async (ctx) => {
  const {
    uid,
    homePicUrl,
    credit,
    phone,
    motto,
    grade,
    college
  } = ctx.query

  //判断用户是否存在
  try{
    if((await mysql('UserInfo').select().where('uid',uid)).length===0){
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
    await mysql('UserInfo').where('uid', uid).update({
      credit: credit,
      phone: phone,
      motto: motto,
      grade: grade,
      college: college
    })
    await mysql('UserHomePic').where('uid', uid).update({
      homePicUrl: homePicUrl
    })

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
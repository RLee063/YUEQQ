const {mysql} = require('../qcloud')

module.exports = async(ctx) => {
  const {uid, title,sportType,startTime,createTime,imgUrl,tags,maxNum} = ctx.query
  console.log(ctx.query)
  var timeStamp = Math.round(new Date().getTime()/1000)
  var aid = uid + timeStamp
  var activity = {
      Aid : aid,
      Type : sportType,
      CreateTime : createTime,
      StartTime : startTime,
      Title : title,
      CreatorUid : uid,
      Tags : tags,
      MaxNum : maxNum
  }
  console.log(activity)

  try {
      await mysql('ActivityInfo').insert(activity)
      await mysql('ActivityPic').insert({
        Aid : aid,
        PicUrl : imgUrl
      })
      ctx.body = {
          code : 1,
          data : {
              aid : aid 
          }
      }
  } catch (e) {
      console.log(e)
      ctx.body = {
          code : -1,
          data : {
              msg : '创建活动失败' + e.sqlMessage
          }
      }
  }
}
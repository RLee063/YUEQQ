const {mysql} = require('../qcloud')

module.exports = async(ctx) => {
  const { uid, title, sportType, startTime, createTime, imgUrl, tags, maxNum, description} = ctx.query

  var timeStamp = Math.round(new Date().getTime()/1000)
  var aid = uid + timeStamp

  var activity = {
      Aid : aid,
      'sportType' : sportType,
      CreateTime : createTime,
      StartTime : startTime,
      Title : title,
      CreatorUid : uid,
      MaxNum : maxNum,
      ord: 0,
    'description': description
  }

  var formatedTags = tags.split(' ')
  formatedTags.pop()
  console.log(formatedTags)
  

  try {
      //添加活动信息
      activity['ord'] = (await mysql('ActivityInfo').select().where('startTime', startTime)).length
      await mysql('ActivityInfo').insert(activity)
      await mysql('ActivityPic').insert({
        Aid : aid,
        PicUrl : imgUrl
      })

      //将创建者加入活动
      await mysql('userAct').insert({
        aid: aid,
        uid: uid
      })
      
      var cnt = 0
    for (var i in formatedTags){
        //添加 新tag
      if ((await mysql('tag').select().where('title', formatedTags[i])).length ===0){
          cnt = (await mysql('tag').count('tid as num'))[0]['num']
          await mysql('tag').insert({
            tid: cnt+1,
            title: formatedTags[i]
          })
        }
      }

      //关联tag 与 activity
    for (var i in formatedTags){
      var tid = (await mysql('tag').select('tid').where('title', formatedTags[i]))[0]['tid']
        await mysql('actTag').insert({
          Tid:tid,
          Aid:aid
        })
      }

      


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
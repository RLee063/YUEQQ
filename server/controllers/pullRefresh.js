const {mysql} = require('../qcloud')

function formatTime(time){
  return time.toLocaleString()
}

module.exports = async(ctx) => {

  try {
      
    var activities = await mysql('ActivityInfo as info').join('ActivityPic as pic', 'info.Aid', 'pic.Aid').join('UserAvatar as user', 'user.uid', 'info.creatorUid').select().orderBy('StartTime','asc').orderBy('index','asc').limit(10)

    for(var i in activities){
//    console.log(activities[i])
      activities[i]['startTime'] = formatTime(activities[i]['startTime'])
      activities[i]['createTime'] = formatTime(activities[i]['createTime'])
      tags = await mysql('tag as t').join('actTag as at', 'at.tid', 't.tid').where('aid', activities[i]['aid'])
      activities[i]['tags'] = tags
      uids = await mysql('userAct as ua').join('ActivityInfo as ai', 'ua.aid', 'ai.aid').select('ua.uid').where('ua.aid',activities[i]['aid'])
      activities[i]['members'] = uids
      activities[i]['sportType'] = activities[i]['type']
    }

    ctx.body = {
      code: 1,
      data: activities
    }
//    console.log(activities)
  } catch (e) {
    console.log(e)
    ctx.body = {
      code : -1,
      data: 'failed' + e.sqlMessage
    }
    }
}
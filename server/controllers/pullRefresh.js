const {mysql} = require('../qcloud')

function formatTime(time){
  return time.toLocaleString()
}

module.exports = async(ctx) => {

  try {
      
    var activities = await mysql('ActivityInfo as info').join('ActivityPic as pic', 'info.Aid', 'pic.Aid').join('UserAvatar as user', 'user.uid', 'info.creatorUid').select().orderBy('StartTime','desc').limit(10)

    for(var i in activities){
      console.log(activities[i])
      activities[i]['startTime'] = formatTime(activities[i]['startTime'])
      activities[i]['createTime'] = formatTime(activities[i]['createTime'])
    }

    ctx.body = {
      code: 1,
      data: activities
    }
    console.log(activities)
  } catch (e) {
    console.log(e)
    ctx.body = {
      code : -1,
      data: 'failed' + e.sqlMessage
    }
    }
}
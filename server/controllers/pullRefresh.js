const {
  mysql
} = require('../qcloud')
var tool = require('./tool.js')




module.exports = async(ctx) => {

  const {
    aid
  } = ctx.query
  try {

    if (aid === undefined) {
      var activities = await mysql('ActivityInfo as info').select().whereRaw('StartTime > ?', [tool.getNowFormatDate()]).andWhere('disbanded', 0).orderBy('StartTime', 'asc').orderBy('ord', 'asc').limit(10)
      for(var i in activities)
      {
        activities[i]['avatarUrl'] = (await mysql('userInfo').select('avatarUrl').where('uid', activities[i]['creatorUid']))[0]['avatarUrl']
      }

    } else {
      var lastAct = (await mysql('ActivityInfo').select().where('aid', aid))[0]
      var activities = await mysql('ActivityInfo as info').select().whereRaw('startTime > ?', [lastAct['startTime']]).andWhere('disbanded', 0).orWhere(
        function () {
          this.where('startTime', lastAct['startTime']).andWhereRaw("ord > ?", [lastAct['ord']])
        }
      ).orderBy('StartTime', 'asc').orderBy('ord', 'asc').limit(10)
      
      for (var i in activities) {
        activities[i]['avatarUrl'] = (await mysql('userInfo').select('avatarUrl').where('uid', activities[i]['creatorUid']))[0]['avatarUrl']
      }

    }


    for (var i in activities) {
      //calculate status
      if(activities[i]['startTime'] > new Date()){
        activities[i]['status'] = 0
      } else if(activities[i]['endTime'] < new Date()){
        activities[i]['status'] = 2
      }else{
        activities[i]['status'] = 1
      }
      //  fromat time
      activities[i]['startTime'] = tool.formatTime(activities[i]['startTime'])
      activities[i]['createTime'] = tool.formatTime(activities[i]['createTime'])
      activities[i]['endTime'] = tool.formatTime(activities[i]['endTime'])
      //get tags
      tags = await mysql('tag as t').join('actTag as at', 'at.tid', 't.tid').where('aid', activities[i]['aid'])
      activities[i]['tags'] = tags
      //get members
      uids = await mysql('userAct as ua').join('ActivityInfo as ai', 'ua.aid', 'ai.aid').select('ua.uid').where('ua.aid', activities[i]['aid'])
      activities[i]['members'] = uids
      


    }

    ctx.body = {
      code: 1,
      data: activities
    }
    //    console.log(activities)
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: -1,
      data: 'failed' + e.sqlMessage
    }
  }
}
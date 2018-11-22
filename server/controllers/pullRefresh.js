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
      var activities = await mysql('ActivityInfo as info').select().whereRaw('StartTime > ?', [tool.getNowFormatDate()]).orderBy('StartTime', 'asc').orderBy('ord', 'asc').limit(10)
      for(var i in activities)
      {
        activities[i]['picUrl'] = (await mysql('ActivityPic').select('picUrl').where('aid', activities[i]['aid']))[0]['picUrl']
        activities[i]['avatarUrl'] = (await mysql('UserAvatar').select('avatarUrl').where('uid', activities[i]['creatorUid']))[0]['avatarUrl']
      }

    } else {
      var lastAct = (await mysql('ActivityInfo').select().where('aid', aid))[0]
      var activities = await mysql('ActivityInfo as info').select().whereRaw('startTime > ?', [lastAct['startTime']]).orWhere(
        function () {
          this.where('startTime', lastAct['startTime']).andWhereRaw("ord > ?", [lastAct['ord']])
        }
      ).orderBy('StartTime', 'asc').orderBy('ord', 'asc').limit(10)
      
      for (var i in activities) {
        activities[i]['picUrl'] = (await mysql('ActivityPic').select('picUrl').where('aid', activities[i]['aid']))[0]['picUrl']
        activities[i]['avatarUrl'] = (await mysql('UserAvatar').select('avatarUrl').where('uid', activities[i]['creatorUid']))[0]['avatarUrl']
      }

    }


    for (var i in activities) {
      //    console.log(activities[i])
      activities[i]['startTime'] = tool.formatTime(activities[i]['startTime'])
      activities[i]['createTime'] = tool.formatTime(activities[i]['createTime'])
      tags = await mysql('tag as t').join('actTag as at', 'at.tid', 't.tid').where('aid', activities[i]['aid'])
      activities[i]['tags'] = tags
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
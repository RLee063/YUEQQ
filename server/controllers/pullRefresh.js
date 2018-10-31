const {
  mysql
} = require('../qcloud')

function formatTime(time) {
  return time.toLocaleString()
}

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
  console.log(currentdate)
  return currentdate;
}
module.exports = async(ctx) => {

  const {
    aid
  } = ctx.query
  try {

    if (aid === undefined) {
      var activities = await mysql('ActivityInfo as info').join('ActivityPic as pic', 'info.Aid', 'pic.Aid').join('UserAvatar as user', 'user.uid', 'info.creatorUid').select().whereRaw('StartTime > ?', [getNowFormatDate()]).orderBy('StartTime', 'asc').orderBy('index', 'asc').limit(10)
    } else {
      var lastAct = await mysql('ActivityInfo').select().where('aid', aid)
      var activities = await mysql('ActivityInfo as info').join('ActivityPic as pic', 'info.Aid', 'pic.Aid').join('UserAvatar as user', 'user.uid', 'info.creatorUid').select().whereRaw('startTime > ?', [lastAct['startTime']]).orwhereRaw(
        function() {
          this.where('startTime', lastAct['startTime']).orwhereRaw('index > ?', [lastAct['index']])
        }
      ).orderBy('StartTime', 'asc').orderBy('index', 'asc').limit(10)
    }


    for (var i in activities) {
      //    console.log(activities[i])
      activities[i]['startTime'] = formatTime(activities[i]['startTime'])
      activities[i]['createTime'] = formatTime(activities[i]['createTime'])
      tags = await mysql('tag as t').join('actTag as at', 'at.tid', 't.tid').where('aid', activities[i]['aid'])
      activities[i]['tags'] = tags
      uids = await mysql('userAct as ua').join('ActivityInfo as ai', 'ua.aid', 'ai.aid').select('ua.uid').where('ua.aid', activities[i]['aid'])
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
      code: -1,
      data: 'failed' + e.sqlMessage
    }
  }
}
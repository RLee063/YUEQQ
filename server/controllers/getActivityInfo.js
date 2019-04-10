const {
  mysql
} = require('../qcloud')
var tool = require('./tool.js')
var sports = new Array('basketball', 'badminton', 'pingpong', 'tennis', 'soccer', 'running')

module.exports = async(ctx) => {
  const {
    aid
  } = ctx.query
  try {
    var activity = (await mysql().select().from('ActivityInfo').where('aid', aid))[0]
    if (activity['startTime'] > new Date()) {
      activity['status'] = 0
    } else if (activity['endTime'] < new Date()) {
      activity['status'] = 2
    } else {
      activity['status'] = 1
    }
    activity['startTime'] = tool.formatTime(activity['startTime'])
    activity['createTime'] = tool.formatTime(activity['createTime'])
    activity['imgUrl'] = activity['picUrl']
    tags = await mysql('tag as t').join('actTag as at', 'at.tid', 't.tid').where('aid', activity['aid'])
    activity['tags'] = tags
    uids = await mysql('userAct as ua').join('ActivityInfo as ai', 'ua.aid', 'ai.aid').select('ua.uid').where('ua.aid', activity['aid'])
    var uidss = []
    for(var i in uids)
    {
      uidss[i]=uids[i]['uid']
    }
    activity['members'] = await mysql('userInfo as ui').select().whereIn('ui.uid', uidss)
    for (var i in activity['members']){
      activity['members'][i]['evaluated'] = (await mysql('userAct').select().where('aid', aid).andWhere('uid', activity['members'][i]['uid']))[0]['evaluated']
      activity['members'][i]['skills'] = []
      for (var j in sports) {
        activity['members'][i]['skills'].push(activity['members'][i][sports[j]])

      }
    }


    ctx.body = {
      code: 1,
      data: activity
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: -1,
      data: {
        msg: 'failed\n' + e.sqlMessage
      }
    }
  }
}
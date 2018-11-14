const {
  mysql
} = require('../qcloud')
var tool = require('./tool.js')

module.exports = async(ctx) => {
  const {
    aid
  } = ctx.query
  try {
    var activity = (await mysql().select().from('ActivityInfo').where('aid', aid))[0]
    var imgUrl = (await mysql().select().from('ActivityPic').where('aid', aid))[0]
    activity['startTime'] = tool.formatTime(activity['startTime'])
    activity['createTime'] = tool.formatTime(activity['createTime'])
    tags = await mysql('tag as t').join('actTag as at', 'at.tid', 't.tid').where('aid', activity['aid'])
    activity['tags'] = tags
    uids = await mysql('userAct as ua').join('ActivityInfo as ai', 'ua.aid', 'ai.aid').select('ua.uid').where('ua.aid', activity['aid'])
    var uidss = []
    for(var i in uids)
    {
      uidss[i]=uids[i]['uid']
    }
    activity['members'] = await mysql('UserInfo as ui').select().whereIn('ui.uid', uidss)
    for(var i in activity['members'])
    {
      activity['members'][i]['avatarUrl'] = (await mysql('UserAvatar').select().where('uid', activity['members'][i]['uid']))[0]['avatarUrl']
      activity['members'][i]['imgUrl'] = (await mysql('UserHomePic').select().where('uid', activity['members'][i]['uid']))[0]['homePicUrl']
    }

    activity['imgUrl'] = imgUrl['picUrl']

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
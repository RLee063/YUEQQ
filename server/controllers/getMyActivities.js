const { mysql } = require('../qcloud')
var tool = require('./tool.js')
module.exports = async(ctx) => {
  const {uid} = ctx.query
  var createdActivities = { started: [], notStart: [] }
  var joinedActivities = { started: [], notStart: [] }

  try{
    activities = await mysql('ActivityInfo').select().where('creatorUid', uid)
    if (activities['startTime'] > new Date()) {
      activities['status'] = 0
    } else if (activities['endTime'] < new Date()) {
      activities['status'] = 2
    } else {
      activities['status'] = 1
    }


    createdActivities['started'] = await mysql('ActivityInfo').select().where('creatorUid', uid).andWhereRaw('StartTime <= ?', [tool.getNowFormatDate()])
    createdActivities['notStart'] = await mysql('ActivityInfo').select().where('creatorUid', uid).andWhereRaw('StartTime > ?', [tool.getNowFormatDate()])
    joinedAids = await mysql('userAct').select('aid').where('uid', uid)
    joinedActivities['started'] = await mysql('ActivityInfo').select().whereRaw('StartTime <= ?', [tool.getNowFormatDate()]).andWhere('aid', 'in', joinedAids)
    joinedActivities['notStart'] = await mysql('ActivityInfo').select().whereRaw('StartTime <= ?', [tool.getNowFormatDate()]).andWhere('aid', 'in', joinedAids)
    
    ctx.body = {
      'code': 1,
      'data':{
        'createdActivities': createdActivities,
        'joinedActivities': joinedActivities,
        'activities': activities
      }
    }
  }catch(e)
  {
    console.log(e)
    ctx.body = {
      code: -1,
      data: 'failed' + e.sqlMessage
    }
    return
  }

}
const { mysql } = require('../qcloud')
var tool = require('./tool.js')
module.exports = async(ctx) => {
  const {uid} = ctx.query
  var createdActivities = { started: [], notStart: [] }
  var joinedActivities = { started: [], notStart: [] }

  try{
    activities = await mysql('ActivityInfo').select().where('creatorUid', uid).andWhere('disbanded', 0).orderBy('StartTime', 'desc').orderBy('ord', 'asc')
    for(var i in activities){
      if (activities[i]['startTime'] > new Date()) {
        activities[i]['status'] = 0
      } else if (activities[i]['endTime'] < new Date()) {
        activities[i]['status'] = 2
      } else {
        activities[i]['status'] = 1
      }
    }



    createdActivities['started'] = await mysql('ActivityInfo').select().where('creatorUid', uid).andWhereRaw('StartTime <= ?', [tool.getNowFormatDate()]).andWhere('disbanded', 0).andWhereRaw('endTime <= ?', [tool.getNowFormatDate()])
    createdActivities['starting'] = await mysql('ActivityInfo').select().where('creatorUid', uid).andWhereRaw('StartTime <= ?', [tool.getNowFormatDate()]).andWhere('disbanded', 0).andWhereRaw('endTime >= ?', [tool.getNowFormatDate()])
    createdActivities['notStart'] = await mysql('ActivityInfo').select().where('creatorUid', uid).andWhereRaw('StartTime > ?', [tool.getNowFormatDate()]).andWhere('disbanded', 0)

    joinedAids = await mysql('userAct').select('aid').where('uid', uid)
    joinedActivities['started'] = await mysql('ActivityInfo').select().whereRaw('StartTime <= ?', [tool.getNowFormatDate()]).andWhere('aid', 'in', joinedAids).andWhere('disbanded', 0).andWhereRaw('endTime <= ?', [tool.getNowFormatDate()])
    joinedActivities['starting'] = await mysql('ActivityInfo').select().whereRaw('StartTime <= ?', [tool.getNowFormatDate()]).andWhere('aid', 'in', joinedAids).andWhere('disbanded', 0).andWhereRaw('endTime >= ?', [tool.getNowFormatDate()])
    joinedActivities['notStart'] = await mysql('ActivityInfo').select().whereRaw('StartTime <= ?', [tool.getNowFormatDate()]).andWhere('aid', 'in', joinedAids).andWhere('disbanded', 0)
    
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


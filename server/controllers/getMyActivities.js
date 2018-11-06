const { mysql } = require('../qcloud')

module.exports = async(ctx) => {
  const {uid} = ctx.query
  try{
    createdActivities = await mysql('ActivityInfo').select().where('creatorUid', uid)
    joinedAids = await mysql('userAct').select('aid').where('uid', uid)
    joinedActivities = await mysql('ActivityInfo').select().where('aid', 'in', joinedAids)
    
    ctx.body = {
      'code': 1,
      'data':{
        'createdActivities': createdActivities,
        'joinedActivities': joinedActivities
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
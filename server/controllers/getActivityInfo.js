const {mysql} = require('../qcloud')

module.exports = async(ctx) =>{
    const {aid} = ctx.query
    try {
        var activity = await mysql().select().from('ActivityInfo').where('Aid',aid)[0]
        var imgUrl = await mysql().select.from('ActivityPic').where('Aid',aid)[0]
        activity['imgUrl'] = imgUrl['PicUrl']
        
        ctx.body = {
            code : 1,
            data : activity
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code : -1,
            data : {
                msg : 'failed\n' + e.sqlMessage 
            }
        }
    }
}
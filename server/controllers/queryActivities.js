const {mysql} = require('../qcloud')

module.exports = async(ctx) => {
    const {time, before, num} = ctx.query

    try {
        res = await mysql().select
    } catch (e) {
        
    }
}
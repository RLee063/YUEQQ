/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login, controllers.mylogin)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)


router.get('/pullRefresh', controllers.pullRefresh)

//创建活动
router.get('/createActivity', controllers.createActivity)
//查询活动信息
router.get('/getActivityInfo', controllers.getActivityInfo)

//查询用户信息
router.get('/getUserInfo', controllers.getUserInfo)
//更新信息
router.get('/updateUserInfo',controllers.updateUserInfo)
//参加活动
// router.get('/joinActivity', controllers.joinActivity)
//查询用户参与/创建过的互动
router.get('/getMyActivities', controllers.getMyActivities)
//解散活动
router.get('/disbandActivity', controllers.disbandActivity)
//结束活动
router.get('/endActivity',controllers.endActivity)
//退出活动
router.get('/exitActivity',controllers.exitActivity)
//创建者签到
router.get('/signForActivity',controllers.signForActivity)
//转让活动
router.get('/transferActivity',controllers.transferActivity)
//活动结束后评价
router.get('/evaluate',controllers.evaluate)
//用户推荐
router.get('/getRecommendUsers',controllers.getRecommendUsers)
//删除用户
router.get('/removeFromActivity',controllers.removeFromActivity)
//关注
router.get('/follow',controllers.follow)
//取关
router.get('/unfollow',controllers.unfollow)
//获取粉丝信息
router.get('/getFollowers',controllers.getFollowers)
//获取关注的人的信息
router.get('/getFollowings', controllers.getFollowings)
//随机图片
router.get('/randPic',controllers.randPic)
//热度前3
router.get('/getPopular', controllers.getPopular)
module.exports = router

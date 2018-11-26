// pages/viewUserInfo/viewUserInfo.js
var config = require('../../config')
var util = require('../../utils/util.js')
var app = getApp()
var that

Page({
  data: {
    isViewOtherInfo: false,
    userInfo: {},
    numOfFollowings: 0,
    numOfFollowers: 0,
    numOfMyActivities: 0,
    homePicUrl: 'https://uestc0510-1257207887.cos.ap-chengdu.myqcloud.com/1543237069447-mHdJscD5W.png',
    hasOwnPic: true
  },

  onLoad: function(options) {
    that = this
    var uid = options.uid
    // var uid = "o5ko3434RP2lZQNVamvVxfrAugoY"
    var myUid = wx.getStorageSync('openid')
    if (!uid) {
      uid = myUid
    }
    this.setData({
      uid: uid,
      isViewOtherInfo: uid == myUid ? false : true
    })
    that.refresh()
  },
  refresh: function() {
    var userInfoPromise = util.getUserInfoFromServer(that.data.uid)
    userInfoPromise.then(userInfo => {
      console.log(userInfo)
      // userInfo.skills = [0, 20, 40, 60, 10, 80]
      that.setData({
        userInfo: userInfo
      })
      if (that.data.userInfo.homePicUrl == "0") {
        console.log("flag")
        that.setData({
          hasOwnPic: false
        })
      }
      that.drawSkillCanvas()
    })
    this.initNumbers()
  },
  onShow: function() {

    this.refresh()
  },
  initNumbers: function() {
    wx.request({
      url: `${config.service.host}/weapp/getFollowings`,
      data: {
        uid: that.data.uid
      },
      success(result) {
        that.setData({
          numOfFollowings: result.data.followers.length
        })
      }
    })
    wx.request({
      url: `${config.service.host}/weapp/getFollowers`,
      data: {
        uid: that.data.uid
      },
      success(result) {
        that.setData({
          numOfFollowers: result.data.followers.length
        })
      }
    })
    wx.request({
      url: `${config.service.host}/weapp/getMyActivities`,
      data: {
        uid: that.data.uid
      },
      success(result) {
        that.setData({
          numOfMyActivities: result.data.data.activities.length
        })
      }
    })
  },
  onReady: function() {},
  drawSkillCanvas: function() {
    var ctx = wx.createCanvasContext("skillCanvas")
    ctx.translate(125, 125)
    ctx.scale(0.8, 0.8)
    this.drawCobweb(ctx)
    this.drawSkillPolygon(ctx)
    ctx.draw()
  },
  drawSkillPolygon(ctx) {
    var points = this.getPolygonPointsByRadius(that.data.userInfo.skills)
    ctx.setStrokeStyle('#3C3C3C')
    this.drawPolygonByPoints(points, ctx)
    ctx.setGlobalAlpha(0.5)
    ctx.setFillStyle('black')
    ctx.fill()
  },
  drawCobweb(ctx) {
    var points = this.getPolygonPointsByRadius([90, 90, 90, 90, 90, 90])
    console.log(points)
    ctx.setFontSize(18)
    ctx.setFillStyle()
    ctx.translate(-20, 7)
    var sportType = app.globalData.sportType
    ctx.setStrokeStyle('#4C4C4C')
    for (var i = 0; i < points.length; i++) {
      if (i == 0 || i == 3) {
        ctx.fillText(sportType[i], -5, points[i].y * 1.2)
        continue;
      }
      ctx.fillText(sportType[i], points[i].x * 1.3, points[i].y * 1.3)
    }
    ctx.translate(20, -7)
    //lines
    ctx.setStrokeStyle('#4C4C4C')
    for (var i = 0; i < points.length; i++) {
      ctx.moveTo(0, 0)
      ctx.lineTo(points[i].x, points[i].y)
      ctx.stroke()
    }
    //polygon
    ctx.setStrokeStyle('#4C4C4C')
    this.drawPolygonByPoints(points, ctx)
    points = this.getPolygonPointsByRadius([60, 60, 60, 60, 60, 60])
    this.drawPolygonByPoints(points, ctx)
    points = this.getPolygonPointsByRadius([30, 30, 30, 30, 30, 30])
    this.drawPolygonByPoints(points, ctx)
  },
  drawPolygonByPoints(points, ctx, strokeArg, fillArg) {
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (var i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.closePath()
    ctx.stroke()
  },
  getPolygonPointsByRadius(radius) {
    var angle = 0
    var angle_incre = 2 * Math.PI / radius.length
    var ret = []
    for (var i = 0; i < radius.length; i++) {
      var point = {}
      point.x = radius[i] * Math.sin(angle)
      point.y = radius[i] * Math.cos(angle)
      ret.push(point)
      angle += angle_incre
    }
    return ret
  },
  talkTo() {
    var uid = this.data.userInfo.uid
    var chatInfo = {
      chatId: uid,
      isGroup: false
    }
    var chatInfoString = JSON.stringify(chatInfo)
    wx.navigateTo({
      url: "../chat/chat?chatInfo=" + chatInfoString
    })
  },
  showMoreOptions: function() {
    var itemList = ["举报"]
    if (!that.data.isViewOtherInfo) {
      itemList.push("修改个人信息")
    }
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        if (res.tapIndex == 1) {
          var data = {
            uid: wx.getStorageSync('openid')
          }
          var dataString = JSON.stringify(data)
          wx.navigateTo({
            url: '../myInfo/myInfo?data=' + dataString,
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  viewFollowings: function() {
    var data = {}
    data.uid = that.data.uid
    data.type = 0
    var dataString = JSON.stringify(data)
    wx.navigateTo({
      url: '../displayUsers/displayUsers?dataString=' + dataString,
    })
  },
  viewFollowers: function() {
    var data = {}
    data.uid = that.data.uid
    data.type = 1
    var dataString = JSON.stringify(data)
    wx.navigateTo({
      url: '../displayUsers/displayUsers?dataString=' + dataString,
    })
  },
  viewMyActivities: function() {
    var data = {}
    data.uid = that.data.uid
    var dataString = JSON.stringify(data)
    wx.navigateTo({
      url: '../displayActivities/displayActivities?dataString=' + dataString,
    })
  }
})
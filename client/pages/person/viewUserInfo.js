// pages/viewUserInfo/viewUserInfo.js

var config = require('../../config')
var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    isViewOtherInfo: false
  },

  onLoad: function (options) {
    var uid = options.uid
    var myUid = wx.getStorageSync('openid')
    if(!uid){
      uid = myUid
    }
    this.setData({
      isViewOtherInfo: uid == myUid ? false : true
    })
    var that = this
    var userInfoPromise = util.getUserInfoFromServer(uid)
    userInfoPromise.then(userInfo => {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo
      })
    })
  
  },

  onReady: function(){
    this.drawSkillCanvas()
  },
  drawSkillCanvas: function(){
    var ctx = wx.createCanvasContext("skillCanvas")
    ctx.translate(125, 125)
    ctx.scale(0.8, 0.8)
    this.drawCobweb(ctx)
    this.drawSkillPolygon(ctx)
    ctx.draw()
  },
  drawSkillPolygon(ctx){
    var points = this.getPolygonPointsByRadius([40, 21, 60, 41, 83, 20])
    ctx.setStrokeStyle('#3C3C3C')
    this.drawPolygonByPoints(points, ctx)
    ctx.setGlobalAlpha(0.5)
    ctx.setFillStyle('black')
    ctx.fill()
  },
  drawCobweb(ctx){
    var points = this.getPolygonPointsByRadius([90, 90, 90, 90, 90, 90])
    console.log(points)
    //text
    ctx.setFontSize(18)
    ctx.setFillStyle()
    ctx.translate(-20, 7)
    var sportType = app.globalData.sportType
    for (var i = 0; i < points.length; i++) {
      if(i==0||i==3){
        ctx.fillText(sportType[i], -5, points[i].y * 1.2)
        continue;
      }
      ctx.fillText(sportType[i], points[i].x *1.3, points[i].y *1.3)
    }
    ctx.translate(20, -7)
    //lines
    ctx.setStrokeStyle('#3C3C3C')
    for (var i = 0; i < points.length; i++) {
      ctx.moveTo(0, 0)
      ctx.lineTo(points[i].x, points[i].y)
      ctx.stroke()
    }
    //polygon
    this.drawPolygonByPoints(points, ctx)
    points = this.getPolygonPointsByRadius([60, 60, 60, 60, 60, 60])
    this.drawPolygonByPoints(points, ctx)
    points = this.getPolygonPointsByRadius([30, 30, 30, 30, 30, 30])
    this.drawPolygonByPoints(points, ctx)
  },
  drawPolygonByPoints(points, ctx, strokeArg, fillArg){
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (var i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.closePath()
    ctx.stroke()
  },
  getPolygonPointsByRadius(radius){
    var angle = 0
    var angle_incre = 2*Math.PI/radius.length
    var ret = []
    for(var i=0; i<radius.length; i++){
      var point = {}
      point.x = radius[i]*Math.sin(angle)
      point.y = radius[i]*Math.cos(angle)
      ret.push(point)
      angle += angle_incre
    }
    return ret
  },
  talkTo(){
    var uid = this.data.userInfo.uid
    var chatInfo = {
      chatId: uid,
      isGroup: false
    }
    var chatInfoString = JSON.stringify(chatInfo)
    wx.navigateTo({
      url: "../chat/chat?chatInfo=" + chatInfoString
    })
  }
})
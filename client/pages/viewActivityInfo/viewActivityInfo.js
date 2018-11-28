// client/pages/viewActivityInfo/viewActivityInfo.js
var util = require('../../utils/util.js')
var config = require('../../config')
var app = getApp()
var that
var waveI1
var waveI2
Page({
  data: {
    membersArray: [],
    activityInfo: {},
    sportIcon: "",
    evaluating: false,
    ending: false,
    transfering: false,
    revoming: false,
    transferTo: "",
    myUid: "",
    aid: "",
    swiperIndex: 0,
    current: 0,
    waveCanvasHeight: 80,
    waveCanvasWidth: 500,
    waveHeight: 80,
    waveWidth: 30
  },

  onLoad: function(options) {
    // var aid = "o5ko3434RP2lZQNVamvVxfrAugoY1542197043"
    var aid = options.aid
    that = this
    var myUid = wx.getStorageSync('openid')
    this.setData({
      aid: aid,
      myUid: myUid
    })
    console.log(this.data)
    this.refresh()
    // var aid = options.aid
    that.drawJoinMask()
  },
  
  refresh: function() {
    var that = this
    var aid = this.data.aid
    console.log(aid)
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: `${config.service.host}/weapp/getActivityInfo`,
      data: {
        aid: aid
      },
      success: function(result) {
        console.log(result)
        wx.hideLoading()
        var activityInfo = result.data.data
        console.log(activityInfo)
        var creatorUid = activityInfo.creatorUid
        var me = wx.getStorageSync('openid')
        var myUid = me
        var isOwner = me == creatorUid ? 1 : 0
        var hasJoined = 0
        var isFull = activityInfo.currentNum == activityInfo.maxNum ? 1 : 0
        for (var i = 0; i < activityInfo.members.length; i++) {
          if (me == activityInfo.members[i].uid) {
            hasJoined = 1
            break
          }
        }
        var hasEvaluated = false
        for(var i=0; i<activityInfo.members.length; i++){
          activityInfo.members[i].signed = false
          activityInfo.members[i].removed = false
          activityInfo.members[i].evaluate = 0
          if(activityInfo.members[i].uid == myUid){
            if (activityInfo.members[i].evaluated == 1){
              hasEvaluated = true
            }
          }
        }
//faker
        activityInfo.averageSkills = "黄金"

        var sportIcon = "../../images/sportType/" + activityInfo.sportType +".png"

        var waveWidth = activityInfo.members[0].skills[activityInfo.sportType] * 500 / 80
        that.setData({
          waveWidth: waveWidth,
          activityInfo: activityInfo,
          hasJoined: hasJoined,
          isOwner: isOwner,
          hasEvaluated: hasEvaluated,
          membersArray: activityInfo.members,
          sportIcon: sportIcon
        })
        that.setPoint()
      },
      fail: function(error) {
        wx.showModal({
          title: '获取活动信息失败',
          content: '点击确定重试',
          success(res) {
            if (res.confirm) {
              that.refresh()
            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    })
  },
  name2Num: function(name){
    var sportType = app.globalData.sportType
    for(var i=0; i<sportType.length; i++){
      if(sportType[i]==name){
        return i
      }
    }
  },
  setMemberInfo: function(userInfo) {
    var membersArray = that.data.membersArray
    userInfo.signed = false
    membersArray.push(userInfo)
    that.setData({
      membersArray: membersArray
    })
  },
  onSlideChangeEnd:function(e){
    console.log(e)
    var value = that.data.membersArray[e.detail.current].skills[that.data.activityInfo.sportType]
    value = value * 500 / 80
    that.setData({
      swiperIndex: e.detail.current,
      waveWidth: value
    })
    that.setPoint()
  },
  joinActivity: function() {
    var uid = wx.getStorageSync('openid')
    var that = this
    var myinfoP = util.getUserInfoFromServer(uid)
    myinfoP.then(userInfo => {
      if(userInfo.credit < that.data.activityInfo.creditLimit){
        wx.showModal({
          title: '加入活动失败',
          content: '你的信用值太低了哦',
          showCancel: false
        })
      }
      else{
        wx.showLoading({
          title: '',
        })
        wx.request({
          url: `${config.service.host}/weapp/joinActivity`,
          data: {
            uid: uid,
            aid: this.data.aid
          },
          success(result) {
            wx.hideLoading()
            that.refresh()
            wx.showToast({
              title: '加入活动成功',
              icon: 'success',
              duration: 1000
            })
          },
          fail(error) {
            wx.hideLoading()
            util.showModel('加入失败', error);
          }
        })
      }
    })
  },
  chooseTransfer: function(e){
    this.setData({
      transferTo: e.currentTarget.dataset.uid == this.data.transferTo ? "" : e.currentTarget.dataset.uid
    })
  },
  sign: function(e){
    console.log(e)
    var membersArray = this.data.membersArray
    for(var i=0; i<membersArray.length; i++){
      if (e.currentTarget.dataset.uid == membersArray[i].uid){
        console.log(membersArray)
        membersArray[i].signed = (membersArray[i].signed + 1) % 2
        //break
      }
    }
    this.setData({
      membersArray: membersArray
    })
  },
  viewMemberInfo: function(e){
    wx.navigateTo({
      url: '../viewUserInfo/viewUserInfo?uid='+e.currentTarget.dataset.uid,
    })
  },
  showMoreOptions: function(){
    var itemList = []
    if(this.data.isOwner){
      itemList.push("解散活动")
      itemList.push("转让活动")
      itemList.push("移除成员")
    }
    else{
      itemList.push("举报")
      if (this.data.hasJoined) {
        itemList.push("退出活动")
      }
    }
    wx.showActionSheet({
      itemList: itemList,
      // 创建者：[解散活动，转让活动]
      // 参与者：[举报，退出活动]
      // 未参与者: [举报]
      success(res) {
        if(that.data.isOwner){
          switch(res.tapIndex){
          case 0:
            that.disbandedActivity()
            break;
          case 1:
            that.transferActivity()
            break;
          case 2:
            that.removeMember()
            break;
          }
        }
        else{
          if(that.data.hasJoined){
            switch(res.tapIndex){
              case 0:
                that.reportActivity()
                break
              case 1:
                that.exitActivity()
                break
            }
          }
          else{
            switch(res.tapIndex){
              case 0:
                that.reportActivity()
                break
            }
          }
        }
        console.log(res)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  disbandedActivity: function() {
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: `${config.service.host}/weapp/disbandActivity`,
      data: {
        aid: that.data.aid
      },
      success(result){
        wx.hideLoading()
        wx.showToast({
          title: '解散活动成功',
          icon: 'success',
          duration: 1000
        })
        wx.navigateBack({
          delta: 1
        })
      },
      fail(error){
        wx.hideLoading()
        util.showModel('解散活动失败', error);
      }
    })
  },
  transferActivity: function() {
    this.setData({
      transfering: true
    })
  },
  completeTransfer: function () {
    this.setData({
      transfering: false
    })
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: `${config.service.host}/weapp/transferActivity`,
      data: {
        aid: that.data.aid,
        uid: that.data.transferTo
      },
      success(result){
        wx.hideLoading()
        wx.showToast({
          title: '转让活动成功',
          icon: 'success',
          duration: 1000
        })
      },
      fail(error){
        wx.hideLoading()
        util.showModel('转让活动失败', error);
      }
    })
  },
  chooseRemove: function(e){
    console.log(e)
    var membersArray = that.data.membersArray
    membersArray[e.currentTarget.dataset.index].removed = (membersArray[e.currentTarget.dataset.index].removed + 1) % 2
    that.setData({
      membersArray: membersArray
    })
    console.log(membersArray)
  },
  removeMember: function() {
    that.setData({
      removing: true
    })
  },
  completeRemoveMember: function(){
    that.setData({
      removing: false
    })
    var members = that.data.membersArray
    var removeMembers = []
    for(var i=0; i<members.length; i++){
      if(members[i].removed){
        removeMembers.push(members[i].uid)
      }
    }
    wx.showLoading({
      title: '',
    })
    var removeMembersString  = removeMembers.join(',')
    wx.request({
      url: `${config.service.host}/weapp/removeFromActivity`,
      data: {
        aid: that.data.aid,
        members: removeMembersString
      },
      success(result){
        wx.hideLoading()
        that.refresh()
        wx.showToast({
          title: '移除成员成功',
          icon: 'success',
          duration: 1000
        })
      },
      fail(error){
        wx.hideLoading()
        util.showModel('移除成员失败', error);
      }
    })
  },
  reportActivity: function() {
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: `${config.service.host}/weapp/reportActivity`,
      data: {
        aid: that.data.aid
      },
      success(){
        wx.hideLoading()
        wx.showToast({
          title: '举报成功',
          icon: 'success',
          duration: 1000
        })
      },
      fail(error){
        wx.hideLoading()
        util.showModel('举报活动失败', error);
      }
    })
  },
  exitActivity: function() {
    var uid = wx.getStorageSync('openid')
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: `${config.service.host}/weapp/exitActivity`,
      data: {
        aid: that.data.aid,
        uid: uid
      },
      success(){
        wx.hideLoading()
        wx.showToast({
          title: '退出活动成功',
          icon: 'success',
          duration: 1000
        })
        that.refresh()
      },
      fail(error){
        wx.hideLoading()
        util.showModel('退出失败', error);
      }
    })
  },
  evaluateActivity: function() {
    console.log("here")
    this.setData({
      evaluating: true
    })
  },
  evaluate: function (e) {
    console.log("evaluate")
    var membersArray = that.data.membersArray
    membersArray[e.target.dataset.index].evaluate = e.target.dataset.code
    that.setData({
      membersArray: membersArray
    })
  },
  completeEvaluateActivity: function(){
    var up = []
    var down = []
    for(var i=0; i<that.data.membersArray.length; i++){
      if (that.data.membersArray[i].evaluate == 1){
        up.push(that.data.membersArray[i].uid)
      }
      if (that.data.membersArray[i].evaluate == -1){
        down.push(that.data.membersArray[i].uid)
      }
    }
    var data = {
      uid: wx.getStorageSync('openid'),
      aid: that.data.aid,
      up: up.join(','),
      down: down.join(',')
    }
    console.log(data)
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: `${config.service.host}/weapp/evaluate`,
      data: data,
      success(result){
        console.log(result)
        wx.hideLoading()
        wx.showToast({
          title: '评价成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          evaluating: false
        })
        that.refresh()
      },
      fail(error){
        wx.hideLoading()
        util.showModel('评价失败', error);
      }
    })
  },
  endActivity: function(){
    var aid = this.data.aid
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: `${config.service.host}/weapp/endActivity`,
      data: {
        aid: aid
      },
      success: result => {
        wx.hideLoading()
        wx.showToast({
          title: '结束活动成功',
          icon: 'success',
          duration: 1000
        })
        console.log(result)
        this.setData({
          ending: true
        })
        this.refresh()
      },
      fail: error => {
        wx.hideLoading()
        util.showModel('结束活动失败', error);
      }
    })
  },
  completeEndActivity: function(){
    var members = []
    for (var i = 0; i < this.data.membersArray.length; i++){
      if (this.data.membersArray[i].signed){
        members.push(this.data.membersArray[i].uid)
      }
    }

    wx.showLoading({
      title: '',
    })
    wx.request({
      url: `${config.service.host}/weapp/signForActivity`,
      data: {
        aid: that.data.aid,
        members: members.join(',')
      },
      success: result => {
        wx.hideLoading()
        wx.showToast({
          title: '',
          icon: 'success',
          duration: 1000
        })
        this.setData({
          ending: false
        })
        this.refresh()
      },
      fail: error => {
        wx.hideLoading()
        util.showModel('签到失败', error);
      }
    })
  },
  setPoint: function(){
    var height = util.rpx2px(that.data.waveHeight)
    var width = util.rpx2px(that.data.waveWidth)
    that.p1 = {
      x: width,
      y: height / 4,
      directionX: 1.2,
      directionY: -1
    }
    that.p2 = {
      x: width,
      y: height * 3 / 4,
      directionX: -1,
      directionY: 1.2
    }
    that.p3 = {
      x: width,
      y: height / 4,
      directionX: -0.8,
      directionY: -2
    }
    that.p4 = {
      x: width,
      y: height * 3 / 4,
      directionX: 1,
      directionY: 2
    }
    console.log(that)
  },
  drawJoinMask: function() {
    that.setPoint()
    waveI1 = setInterval(this.waveAmination, 100)
    waveI2 = setInterval(this.waveAmination2, 100)
  },
  waveAmination: function() {
    var ctx = wx.createCanvasContext('joinMask')
    var height = util.rpx2px(that.data.waveCanvasHeight)
    var width = util.rpx2px(that.data.waveCanvasWidth)
    var rate = util.rpx2px(that.data.waveWidth)
    ctx.beginPath()
    ctx.setGlobalAlpha(0.5)
    ctx.moveTo(rate, 0)
    ctx.lineTo(width, 0)
    ctx.arc(width, height/2, util.rpx2px(40), 1.5*Math.PI, 0.5*Math.PI)
    ctx.lineTo(width, height)
    ctx.lineTo(rate, height)
    ctx.bezierCurveTo(that.p2.x, that.p2.y, that.p1.x, that.p1.y, rate, 0)
    ctx.closePath()
    ctx.setFillStyle('white')
    ctx.fill()
    ctx.draw()
    var point = {
      x: util.rpx2px(that.data.waveWidth)
    }
    if ((this.p1.x + this.p1.directionX > (point.x + 10)) || (this.p1.x + this.p1.directionX < (point.x - 10))) {
      this.p1.directionX = 0 - (this.p1.directionX)
    }
    if ((this.p1.y + this.p1.directionY > (2*height / 3)) || ((this.p1.y + this.p1.directionY) < (height/4))) {
      this.p1.directionY = 0 - (this.p1.directionY)
    }
    this.p1.x += this.p1.directionX
    this.p1.y += this.p1.directionY
    if ((this.p2.x + this.p2.directionX > (point.x + 10)) || (this.p2.x + this.p2.directionX < (point.x - 10))) {
      this.p2.directionX = 0 - (this.p2.directionX)
    }
    if ((this.p2.y + this.p2.directionY > (height*3/4)) || ((this.p2.y + this.p2.directionY) < height*1/3))     {
      this.p2.directionY = 0 - (this.p2.directionY)
    }
    this.p2.x += this.p2.directionX
    this.p2.y += this.p2.directionY
  },
  waveAmination2: function () {
    var ctx = wx.createCanvasContext('joinMask2')
    var height = util.rpx2px(that.data.waveCanvasHeight)
    var width = util.rpx2px(that.data.waveCanvasWidth)
    var rate = util.rpx2px(that.data.waveWidth)
    ctx.setGlobalAlpha(0.5)
    ctx.beginPath()
    ctx.moveTo(rate, 0)
    ctx.lineTo(width, 0)
    ctx.arc(width, height / 2, util.rpx2px(40), 1.5 * Math.PI, 0.5 * Math.PI)
    ctx.lineTo(width, height)
    ctx.lineTo(rate, height)
    ctx.bezierCurveTo(this.p4.x, this.p4.y, this.p3.x, this.p3.y, rate, 0)
    ctx.closePath()
    ctx.setFillStyle('white')
    ctx.fill()
    ctx.draw()
    var point = {
      x: util.rpx2px(that.data.waveWidth)
    }
    if ((this.p3.x + this.p3.directionX > (point.x + 10)) || (this.p3.x + this.p3.directionX < (point.x - 10))) {
      this.p3.directionX = 0 - (this.p3.directionX)
    }
    if ((this.p3.y + this.p3.directionY > (2 * height / 3)) || ((this.p3.y + this.p3.directionY) < (height / 4))) {
      this.p3.directionY = 0 - (this.p3.directionY)
    }
    this.p3.x += this.p3.directionX
    this.p3.y += this.p3.directionY
    if ((this.p4.x + this.p4.directionX > (point.x + 10)) || (this.p4.x + this.p4.directionX < (point.x - 10))) {
      this.p4.directionX = 0 - (this.p4.directionX)
    }
    if ((this.p4.y + this.p4.directionY > (height * 3 / 4)) || ((this.p4.y + this.p4.directionY) < height * 1 / 3)) {
      this.p4.directionY = 0 - (this.p4.directionY)
    }
    this.p4.x += this.p4.directionX
    this.p4.y += this.p4.directionY
  },

  joinChat:function() {
    var chatInfo = {}
    chatInfo.chatId = this.data.aid
    chatInfo.isGroup = true
    var chatInfoString = JSON.stringify(chatInfo)
    wx.navigateTo({
      url: '../chat/chat?chatInfo=' + chatInfoString,
    })
  },
  viewAllMembers:function(){
    var data = {}
    data.aid = that.data.aid
    var dataString = JSON.stringify(data)
    wx.navigateTo({
      url: '../displayUsers/displayUsers?dataString=' + dataString,
    })
  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    that.refresh()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(waveI1)
    clearInterval(waveI2)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
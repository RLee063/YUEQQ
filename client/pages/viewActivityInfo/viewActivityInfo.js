// client/pages/viewActivityInfo/viewActivityInfo.js
var util = require('../../utils/util.js')
var config = require('../../config')
var app = getApp()
var that

Page({

  data: {
    membersArray: [],
    activityInfo: {},
    evaluating: false,
    ending: false,
    transfering: false,
    transferTo: "",
    myUid: "",
    aid: "",
    creatorUid: '',
    joiner: [],
    joinerShow: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var aid = options.aid
    that = this
    var myUid = wx.getStorageSync('openid')
    this.setData({
      aid: aid,
      myUid: myUid
    })
    console.log(this.data)
    this.refresh()
    wx.request({
      url: `${config.service.host}/weapp/getActivityInfo`,
      data: {
        aid: aid
      },
      success: function (result) {
        console.log(result)
        that.setData({
          activityInfo: result.data.data,
          creatorUid: result.data.data.creatorUid,
          joiner: result.data.data.members,
        })
        that.formatInfo()
        that.getCreaterInfo()

      },
      fail: function (error) {
        console.log(error)
      }
    })
    // var aid = options.aid
  },
  viewCreator: function () {
    wx.navigateTo({
      url: '../viewUserInfo/viewUserInfo?uId=' + this.data.activityInfo.creatorUid
    })
  },
  joinerlist: function () {

    wx.navigateTo({
      url: '../joinerlist/joinerlist?members=' + JSON.stringify(this.data.joiner)
    })

  },

  formatInfo: function () {
    var tempActyInfo = this.data.activityInfo

    switch (tempActyInfo.sportType) {
      case '乒乓球':
        tempActyInfo.sportType = 0
        break

      case '篮球':
        tempActyInfo.sportType = 1
        break
      case '网球':
        tempActyInfo.sportType = 2
        break
      case '羽毛球':
        tempActyInfo.sportType = 3
        break
      case '足球':
        tempActyInfo.sportType = 4
        break
      case '跑步':
        tempActyInfo.sportType = 5
        break
    }
    console.log(this.data.joiner)
    var tempJoiner = this.data.joiner
    var showJoiner = []
    if (tempJoiner.length < 4) {
      showJoiner.push(tempJoiner.slice(0, tempJoiner.length))
    } else {
      showJoiner.push(tempJoiner.slice(0, 3))
    }

    this.setData({
      activityInfo: tempActyInfo,
      joinerShow: showJoiner[0]
    })
  },

  getCreaterInfo: function () {
    var that = this
    wx.request({
      url: `${config.service.host}/weapp/getUserInfo`,
      method: 'GET',
      data: {
        uid: that.data.creatorUid,
      },

      success(result) {
        that.setData({
          creator: result.data.data[0]

        })
        console.log(that.data.creator)
      },
      fail: function (error) {
        console.log(error)
      }
    })

  },

  refresh: function () {
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
      success: function (result) {
        wx.hideLoading()
        var activityInfo = result.data.data
        console.log(activityInfo)
        var creatorUid = activityInfo.creatorUid
        var me = wx.getStorageSync('openid')
        var isOwner = me == creatorUid ? 1 : 0
        var hasJoined = 0
        var isFull = activityInfo.currentNum == activityInfo.maxNum ? 1 : 0
        for (var i = 0; i < activityInfo.members.length; i++) {
          if (me == activityInfo.members[i].uid) {
            hasJoined = 1
            break
          }
        }
        for (var i = 0; i < activityInfo.members.length; i++) {
          activityInfo.members[i].signed = false
        }
        that.setData({
          activityInfo: activityInfo,
          hasJoined: hasJoined,
          isOwner: isOwner,
          hasEvaluated: 0,
          membersArray: activityInfo.members
        })
        // that.data.membersArray.splice(0, that.data.membersArray.length)
        // for (var i = 0; i < activityInfo.members.length; i++) {
        //   var pMemberInfo = util.getUserInfo(activityInfo.members[i].uid)
        //   pMemberInfo.then(userInfo => that.setMemberInfo(userInfo))
        // }
      },
      fail: function (error) {
        console.log(error)
      }
    })
    this.drawJoinMask()
  },
  setMemberInfo: function (userInfo) {
    var membersArray = that.data.membersArray
    userInfo.signed = false
    membersArray.push(userInfo)
    that.setData({
      membersArray: membersArray
    })
  },
  joinActivity: function () {
    var uid = wx.getStorageSync('openid')
    if (uid == "") {
      util.showModel('请先登录', '刷新失败')
    }
    var that = this
    console.log(uid)
    console.log(this.data.aid)
    wx.request({
      url: `${config.service.host}/weapp/joinActivity`,
      data: {
        uid: uid,
        aid: this.data.aid
      },
      success(result) {
        if (result.data.code == 1) {
          util.showModel('加入成功', "");
        }
        that.refresh()
      },
      fail(error) {
        util.showModel('加入失败', error);
      }
    })
  },
  chooseTransfer: function (e) {
    this.setData({
      transferTo: e.currentTarget.dataset.uid == this.data.transferTo ? "" : e.currentTarget.dataset.uid
    })
  },
  sign: function (e) {
    console.log(e)
    var membersArray = this.data.membersArray
    for (var i = 0; i < membersArray.length; i++) {
      if (e.currentTarget.dataset.uid == membersArray[i].uid) {
        console.log(membersArray)
        membersArray[i].signed = (membersArray[i].signed + 1) % 2
        //break
      }
    }
    this.setData({
      membersArray: membersArray
    })
  },
  viewMemberInfo: function () {

  },
  showMoreOptions: function () {
    var itemList = []
    if (this.data.isOwner) {
      itemList.push("解散活动")
      itemList.push("转让活动")
    } else {
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
        if (that.data.isOwner) {
          switch (res.tapIndex) {
            case 0:
              that.disbandedActivity()
              break;
            case 1:
              that.transferActivity()
              break;
          }
        } else {
          if (that.data.hasJoined) {
            switch (res.tapIndex) {
              case 0:
                that.reportActivity()
                break
              case 1:
                that.exitActivity()
                break
            }
          } else {
            switch (res.tapIndex) {
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
  disbandedActivity: function () {
    wx.request({
      url: `${config.service.host}/weapp/disbandActivity`,
      data: {
        aid: that.data.aid
      },
    })
  },
  transferActivity: function () {
    this.setData({
      transfering: true
    })
    // wx.request({
    //   url: `${config.service.host}/weapp/transferActivity`,
    //   data: {
    //     aid: that.data.aid,
    //     uid: ""
    //   }
    // })
  },
  completeTransfer: function () {
    this.setData({
      transfering: false
    })
  },
  reportActivity: function () {
    wx.request({
      url: `${config.service.host}/weapp/reportActivity`,
      data: {
        aid: that.data.aid
      },
    })
  },
  exitActivity: function () {
    var uid = wx.getStorageSync('openid')
    wx.request({
      url: `${config.service.host}/weapp/exitActivity`,
      data: {
        aid: that.data.aid,
        uid: uid
      },
    })
  },
  evaluateActivity: function () {
    console.log("here")
    this.setData({
      evaluating: true
    })
  },
  completeEvaluateActivity: function () {
    this.setData({
      evaluating: false
    })
  },
  endActivity: function () {
    var aid = this.data.aid
    wx.showLoading({
      title: '正在结束活动',
    })
    wx.request({
      url: `${config.service.host}/weapp/endActivity`,
      data: {
        aid: aid
      },
      success: result => {
        wx.hideLoading()
        console.log(result)
        this.setData({
          ending: true
        })
        this.refresh()
      },
      fail: error => {
        wx.hideLoading()
      }
    })
  },
  completeEndActivity: function () {
    // var members = []
    // for(var i=0; i<this.data.members.length; i++){
    //   var member = {
    //     uid : this.data.members[i].uid,
    //     signed: this.data.members[i].signed
    //   }
    // }
    wx.request({
      url: `${config.service.host}/weapp/signForActivity`,
      data: {
        members: this.data.members
      },
      success: result => {
        this.setData({
          ending: false
        })
        this.refresh()
      },
      fail: error => { }
    })
  },
  drawJoinMask: function () {
    var height = util.rpx2px(80)
    var width = 200
    this.p1 = {
      x: width,
      y: height / 4,
      directionX: 1.2,
      directionY: -1
    }
    this.p2 = {
      x: width,
      y: height * 3 / 4,
      directionX: -1,
      directionY: 1.2
    }
    this.p3 = {
      x: width,
      y: height / 4,
      directionX: -0.8,
      directionY: -2
    }
    this.p4 = {
      x: width,
      y: height * 3 / 4,
      directionX: 1,
      directionY: 2
    }
    setInterval(this.waveAmination, 10)
    setInterval(this.waveAmination2, 10)
  },
  waveAmination: function () {
    var ctx = wx.createCanvasContext('joinMask')
    var height = util.rpx2px(80)
    var width = util.rpx2px(560)
    var rate = 200
    ctx.beginPath()
    ctx.setGlobalAlpha(0.5)
    ctx.moveTo(rate, 0)
    ctx.lineTo(width, 0)
    ctx.arc(width, height / 2, util.rpx2px(40), 1.5 * Math.PI, 0.5 * Math.PI)
    ctx.lineTo(width, height)
    ctx.lineTo(rate, height)
    ctx.bezierCurveTo(this.p2.x, this.p2.y, this.p1.x, this.p1.y, rate, 0)
    ctx.closePath()
    ctx.setFillStyle('white')
    ctx.fill()
    ctx.draw()
    var point = {
      x: 200
    }
    if ((this.p1.x + this.p1.directionX > (point.x + 10)) || (this.p1.x + this.p1.directionX < (point.x - 10))) {
      this.p1.directionX = 0 - (this.p1.directionX)
    }
    if ((this.p1.y + this.p1.directionY > (2 * height / 3)) || ((this.p1.y + this.p1.directionY) < (height / 4))) {
      this.p1.directionY = 0 - (this.p1.directionY)
    }
    this.p1.x += this.p1.directionX
    this.p1.y += this.p1.directionY
    if ((this.p2.x + this.p2.directionX > (point.x + 10)) || (this.p2.x + this.p2.directionX < (point.x - 10))) {
      this.p2.directionX = 0 - (this.p2.directionX)
    }
    if ((this.p2.y + this.p2.directionY > (height * 3 / 4)) || ((this.p2.y + this.p2.directionY) < height * 1 / 3)) {
      this.p2.directionY = 0 - (this.p2.directionY)
    }
    this.p2.x += this.p2.directionX
    this.p2.y += this.p2.directionY
  },
  waveAmination2: function () {
    var ctx = wx.createCanvasContext('joinMask2')
    var height = util.rpx2px(80)
    var width = util.rpx2px(560)
    var rate = 200
    ctx.setGlobalAlpha(0.2)
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
      x: 200
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

  joinChat: function () {
    var chatInfo = {}
    chatInfo.chatId = this.data.aid
    chatInfo.isGroup = true
    var chatInfoString = JSON.stringify(chatInfo)
    wx.navigateTo({
      url: '../chat/chat?chatInfo=' + chatInfoString,
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})





// navigateToChat: function() {
//   var activityInfo = this.data.activityInfo
//   var chatListRaw = app.getArrayFromStorage('chatListRaw')
//   var chatId = this.data.activityInfo.chatId
//   var chat = {
//     chatId: chatId,
//     statusChanged: true,
//     newMessage: true,
//     unReaded: true,
//     messageArray: []
//   }
//   for (var i = 0; i < chatListRaw.length; i++) {
//     if (chatListRaw[i].chatId == chatId) {
//       chat.messageArray = chatListRaw[i].messageArray
//       chatListRaw.splice(i, 1)
//       break
//     }
//   }
//   var message = {}
//   message.uid = "systemUid"
//   message.messageText = "你已经加入活动拉！快和其他人聊聊吧！"
//   message.userType = 1
//   chat.messageArray.push(message)
//   chatListRaw.unshift(chat)
//   wx.setStorageSync('chatListRaw', chatListRaw)

//   var chatRoomInfo = {
//     avatarUrl: activityInfo.picUrl,
//     nickName: activityInfo.title
//   }
//   wx.setStorageSync(chatId, chatRoomInfo)
//   wx.navigateTo({
//     url: '../chat/chat?chatId=' + this.data.activityInfo.chatId
//   })
// },
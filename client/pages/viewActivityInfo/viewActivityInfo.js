// client/pages/viewActivityInfo/viewActivityInfo.js
var util = require('../../utils/util.js')
var config = require('../../config')
var app = getApp()
var that

Page({

  /**
   * 页面的初始数据
   */
  data: {
    membersArray: [],
    activityInfo: {},
    evaluating: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var aid = "o5ko344qvKlQYv5kYMdTkWbkH8lg1541147786"
    // var aid = options.aid
    that = this
    this.setData({
      aid: aid
    })
    this.refresh()
    // var aid = options.aid
  },
  refresh: function() {
    var that = this
    var aid = this.data.aid
    wx.request({
      url: `${config.service.host}/weapp/pullRefresh`,
      data: {
        aid: aid
      },
      success: function(result) {
        var activityInfo = result.data.data[0]
        var creatorUid = activityInfo.members[0].uid
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
        activityInfo.status = 2
        that.setData({
          activityInfo: activityInfo,
          hasJoined: hasJoined,
          isOwner: isOwner,
          hasEvaluated: 0
        })
        for (var i = 0; i < activityInfo.members.length; i++) {
          var pMemberInfo = util.getUserInfo(activityInfo.members[i].uid)
          pMemberInfo.then(userInfo => that.setMemberInfo(userInfo))
        }
      },
      fail: function(error) {
        console.log(error)
      }
    })
    this.drawJoinMask()
  },
  setMemberInfo: function(userInfo) {
    var membersArray = that.data.membersArray
    membersArray.push(userInfo)
    membersArray.push(userInfo)
    that.setData({
      membersArray: membersArray
    })
  },
  initMembersArray: function() {
    var that = this
    var members = this.data.members
    for (var i = 0; i < members.length; i++) {
      wx.request({
        url: '${config.service.host}/weapp/pullRefresh',
        data: {
          uid: members.uid
        }
      })
    }
  },
  joinActivity: function() {
    var uid = wx.getStorageSync('openid')
    if (uid == "") {
      util.showModel('请先登录', '刷新失败')
    }
    var that = this
    wx.request({
      url: `${config.service.host}/weapp/joinActivity`,
      data: {
        uid: uid,
        aid: this.data.activityInfo.chatId
      },
      success(result) {
        if (result.data.code == 1) {
          util.showModel('加入成功', "");
        }
        that.navigateToChat()
      },
      fail(error) {
        util.showModel('加入失败', error);
      }
    })

  },
  navigateToChat: function() {
    var activityInfo = this.data.activityInfo
    var chatListRaw = app.getArrayFromStorage('chatListRaw')
    var chatId = this.data.activityInfo.chatId
    var chat = {
      chatId: chatId,
      statusChanged: true,
      newMessage: true,
      unReaded: true,
      messageArray: []
    }
    for (var i = 0; i < chatListRaw.length; i++) {
      if (chatListRaw[i].chatId == chatId) {
        chat.messageArray = chatListRaw[i].messageArray
        chatListRaw.splice(i, 1)
        break
      }
    }
    var message = {}
    message.uid = "systemUid"
    message.messageText = "你已经加入活动拉！快和其他人聊聊吧！"
    message.userType = 1
    chat.messageArray.push(message)
    chatListRaw.unshift(chat)
    wx.setStorageSync('chatListRaw', chatListRaw)

    var chatRoomInfo = {
      avatarUrl: activityInfo.picUrl,
      nickName: activityInfo.title
    }
    wx.setStorageSync(chatId, chatRoomInfo)
    wx.navigateTo({
      url: '../chat/chat?chatId=' + this.data.activityInfo.chatId
    })
  },
  viewMemberInfo: function(){
    wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  evaluateActivity: function() {
    console.log("here")
    this.setData({
      evaluating: (this.data.evaluating + 1) % 2
    })
  },
  drawJoinMask: function() {
    var height = util.rpx2px(80)
    var width = 200
    this.p1 = {
      x: width,
      y: height/4,
      directionX: 1.2,
      directionY: -1
    }
    this.p2 = {
      x: width,
      y: height*3/4,
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
      x: width ,
      y: height * 3 / 4,
      directionX: 1,
      directionY: 2
    }
    setInterval(this.waveAmination, 10)
    setInterval(this.waveAmination2, 10)
  },
  waveAmination: function() {
    var ctx = wx.createCanvasContext('joinMask')
    var height = util.rpx2px(80)
    var width = util.rpx2px(560)
    var rate = 200
    ctx.beginPath()
    ctx.setGlobalAlpha(0.5)
    ctx.moveTo(rate, 0)
    ctx.lineTo(width, 0)
    ctx.arc(width, height/2, util.rpx2px(40), 1.5*Math.PI, 0.5*Math.PI)
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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





















// {
//   aid: "o5ko344qvKlQYv5kYMdTkWbkH8lg1540884647",
//     avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erV2px9QVSr6vF2KMHm5kUgeATsZ3ERtMeia4tKibXK21OjEADgtY8ibk57JdYLCTTHDl20jaF9q3uew/132",
//       createTime: "2018-10-30 15:30:46",
//         creatorUid: "o5ko344qvKlQYv5kYMdTkWbkH8lg",
//           currentNum: 1,
//             index: 0,
//               maxNum: 6,
//                 members: [],
//                   picUrl: "https://qcloudtest-1257207887.cos.ap-guangzhou.myqcloud.com/1536468704720-MUpMq2yU3.jpg",
//                     sportType: 1,
//                       startTime: "11月30日 12:00",
//                         tags: [],
//                           title: "你宅你🐎呢",
//                             sportType: "羽毛球",
//                               uid: "o5ko344qvKlQYv5kYMdTkWbkH8lg",
//                                 chatId: "cho5ko344qvKlQYv5kYMdTkWbkH8lg"
// }

// {
//   avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erV2px9QVSr6vF2KMHm5kUgeATsZ3ERtMeia4tKibXK21OjEADgtY8ibk57JdYLCTTHDl20jaF9q3uew/132",
//     uid: "1"
// }, {
//   avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/yOHWFZpCZyiakD3dSFAe9Yn93KMzxHAMzSPiaAWcXqAhUNKOoy9NN78EG7oX0qHD7EDxBapgyjHNECF8qq3Qvvhw/132",
//     uid: "2"
// }, {
//   avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/BOj3yAxywFH5my2YicsOtmJUCzXbKsba0olTEsutBOnGXOLWsNYxHiaJYFuJIKR3O8hUxtqybbWiahn8NC2ib9AqlQ/132",
//     uid: "3"
// }
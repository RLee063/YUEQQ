// client/pages/chat/chat.js
var app = getApp();
var messageGetor;

Page({
  data: {
    messageArray:[],
    otherUid: [],
    oppositeUid: "",
    messageText: "",
  },

  sendMessage: function(e) {
    console.log("hello")
    console.log(app.tunnel.isActive())
    if (app.tunnel && app.tunnel.isActive()) {
      if(e.detail.value.messageText==""){
        return
      }
      var msg = e.detail.value.messageText
      var myUid = wx.getStorageSync('openid')
      var otherUid = this.data.otherUid
      this.tunnel.emit('speak', {
        'word': {
          'to': this.data.oppositeUid,
          'from': myUid,
          'msg': msg
        },
      })
      this.setData({
        messageText: ""
      })
      var message = {}
      var myInfo = wx.getStorageSync('me')
      message.avatarUrl = '../../images/user1.jpg'
      message.userType = 0
      message.messageText = msg
      
      var key = "message"+this.data.oppositeUid
      var messageArray = wx.getStorageSync(key)
      messageArray.push(message)
      wx.setStorageSync(key, messageArray)
    }
  },
  
  onLoad: function (options) {
    this.setData({
      oppositeUid: options.uid
    })
    this.tunnel = app.tunnel;
    messageGetor = setInterval(this.getMessage, 500)
    this.getMessage()
    app.checkIfArrayExistInStorage("message"+options.uid)
    this.pageScrollToBottom()
  },

  getMessage(){
    var key = "message" + this.data.oppositeUid
    var messageArray = wx.getStorageSync(key);
    this.setData({
      messageArray: messageArray
    })
  },

  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {                    wx.pageScrollTo({
        scrollTop: 1000000000,
        duration: 0
      })
    }).exec()
  },
})
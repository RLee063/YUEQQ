// client/pages/chat/chat.js
var app = getApp();
var messageGetor;
var util = require('../../utils/util.js')
var that;

Page({
  data: {
    avatarList: {
      "o5ko3434RP2lZQNVamvVxfrAugoY": "https://cdn.pixabay.com/photo/2018/09/22/17/05/ara-3695678__340.jpg"
    },
    messageArray: [],
    otherUid: [],
    chatId: "",
    messageText: "",
    messageHeadIndex: 0,
    isGroup: 0
  },

  onUnload: function(){
    clearInterval(messageGetor)
  },

  onLoad: function (options) {
    console.log(options)
    var chatInfoString = options.chatInfo
    var chatInfo = JSON.parse(chatInfoString)
    console.log(chatInfo)
    this.setData({
      chatId: chatInfo.chatId,
      isGroup: chatInfo.isGroup
    })

    that = this
    this.tunnel = app.tunnel
    messageGetor = setInterval(this.getMessage, 1000)

    this.updateAvatarList()

    var chatListRaw = app.getArrayFromStorage('chatListRaw')
    for(var i=0; i<chatListRaw.length; i++){
      if(chatListRaw[i].chatId == chatInfo.chatId){
        var headIndex = chatListRaw[i].messageArray.length - 1
        this.setData({
          messageHeadIndex: headIndex
        })
        this.loadMessageArray(chatListRaw[i].messageArray)
        if (chatListRaw[i].unReaded){
          chatListRaw[i].statusChanged = true
        }
        chatListRaw[i].unReaded = false
        chatListRaw[i].unReadedNum = 0
      }
    }
    wx.setStorageSync('chatListRaw', chatListRaw)
  },
  sendMessage: function (e) {
    console.log("AvatarList" + JSON.stringify(this.data.avatarList))
    if (app.tunnel && app.tunnel.isActive()) {
      if (e.detail.value.messageText == "") {
        return
      }
      var msg = e.detail.value.messageText
      var myUid = wx.getStorageSync('openid')

      this.tunnel.emit('speak', {
        'word': {
          'to': this.data.chatId,
          'from': myUid,
          'msg': msg,
          'isGroup': this.data.isGroup,
          'time': util.getTime()
        },
      })
      this.setData({
        messageText: ""
      })

      var message = {}
      var myInfo = wx.getStorageSync('me')
      message.userType = 0
      message.messageText = msg
      message.uid = myUid
      var chatListRaw = app.getArrayFromStorage('chatListRaw')
      var chat = {
        chatId: this.data.chatId,
        statusChanged: true,
        newMessage: true,
        unReaded: true,
        unReadedNum: 0,
        messageArray: [],
        isGroup: this.data.isGroup
      }
      for (var i = 0; i < chatListRaw.length; i++) {
        if (chatListRaw[i].chatId == this.data.chatId) {
          chat.messageArray = chatListRaw[i].messageArray
          chat.unReadedNum = chatListRaw[i].unReadedNum
          chatListRaw.splice(i, 1)
          break
        }
      }
      chat.unReadedNum += 1
      chat.messageArray.push(message)
      chatListRaw.unshift(chat)

      wx.setStorageSync('chatListRaw', chatListRaw)
      this.getMessage()
    }
  },
  loadMessageArray: function (messageArray){
    var headIndex = this.data.messageHeadIndex
    var start = headIndex >= 19 ? headIndex - 19 : 0
    var currentMessageArray = this.data.messageArray
    var tempArray = messageArray.slice(start, headIndex+1)
    for( var i=tempArray.length-1; i>=0; i--){
      currentMessageArray.unshift(tempArray[i])
    }
    this.setData({
      messageArray: currentMessageArray,
      messageHeadIndex: start-1
    })
  },
  getMessage(){
    var chatListRaw = app.getArrayFromStorage('chatListRaw')
    for (var i = 0; i < chatListRaw.length; i++) {
      if (chatListRaw[i].chatId == this.data.chatId) {
        if(chatListRaw[i].unReaded){
          var messageArray = this.data.messageArray
          for (var j = chatListRaw[i].unReadedNum - 1; j>=0; j--){
            messageArray.push(chatListRaw[i].messageArray[chatListRaw[i].messageArray.length - (j+1)])
            console.log(messageArray)
            //是否要更新头像列表
            if (!this.data.avatarList[messageArray[messageArray.length - 1].uid]) {
              console.log("更新头像")
              this.updateAvatarList()
            }
          }
          this.setData({
            messageArray: messageArray
          })
          chatListRaw[i].unReadedNum = 0
          chatListRaw[i].unReaded = false

        }
      }
      break
    }
    wx.setStorageSync('chatListRaw', chatListRaw)
  },
  updateAvatarList: function(){
    if(this.data.isGroup){
      var avatarList = {}
      var groupInfoPromise = util.getActivityInfoFromServer(this.data.chatId)
      groupInfoPromise.then(activityInfo => {
        for(var i=0; i<activityInfo.members.length; i++){
          avatarList[activityInfo.members[i].uid] = activityInfo.members[i].avatarUrl
        }
        that.setData({
          avatarList: avatarList
        })
      })
    }
    else{
      var myInfo = wx.getStorageSync('me')
      var avatarList = {}
      avatarList[myInfo.openId] = myInfo.avatarUrl
      console.log(this.data.chatId)
      var otherInfoPromise =  util.getUserInfo(this.data.chatId)
      otherInfoPromise.then(userInfo => {
        avatarList[userInfo.uid] = userInfo.avatarUrl
        that.setData({
          avatarList: avatarList
        })
      })
    }
  }, 
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {                    wx.pageScrollTo({
        scrollTop: 1000000000,
        duration: 0
      })
    }).exec()
  },

  onPullDownRefresh: function(){
    var chatListRaw = app.getArrayFromStorage('chatListRaw')
    for(var i=0; i<chatListRaw.length; i++){
      if(chatListRaw[i].chatId == this.data.chatId){
        this.loadMessageArray(chatListRaw[i].messageArray)
      }
    }
  }
})
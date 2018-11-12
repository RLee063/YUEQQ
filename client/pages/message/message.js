var app = getApp()
var util = require('../../utils/util')
var redDotClear
var refresh
var that

Page({
  data: {
    chatList:[]
  },

  onLoad: function (options) {
    that = this
    var chatListRaw = app.getArrayFromStorage('chatListRaw')
    var chatList = []
    console.log(chatListRaw)
    for(var i=0; i<chatListRaw.length; i++){
      var chat = this.getChatByChatRaw(chatListRaw[i])
      if(!chat){
        continue
      }
      chatListRaw[i].newMessage = false
      chatListRaw[i].statusChanged = false
      chatList.push(chat)
    }
    wx.setStorageSync('chatListRaw', chatListRaw)
    this.setData({
      chatList: chatList
    })
  },
  onHide: function(){
    clearInterval(redDotClear)
    clearInterval(refresh)
  },
  onShow: function () {
    this.refresh()
    this.clearRedDot()
    refresh = setInterval(this.refresh, 200)
    redDotClear = setInterval(this.clearRedDot, 200)
  },
  refresh: function(){
    var chatListRaw = app.getArrayFromStorage('chatListRaw')
    console.log(chatListRaw)
    var chatList = this.data.chatList
    var flag = true
    for (var i = chatListRaw.length - 1; i >= 0; i--) {
      if (chatListRaw[i].statusChanged) {
        for (var j = 0; j < chatList.length; j++) {
          if (chatList[j].chatId == chatListRaw[i].chatId) {
            chatList[j].unReaded = chatListRaw[i].unReaded
            if (chatListRaw[i].newMessage == true) {
              chatListRaw[i].newMessage = false
              var lastMessage = chatListRaw[i].messageArray[chatListRaw[i].messageArray.length-1]
              chatList[j].lastMessageText = lastMessage.messageText
              chatList.unshift(chatList[j])
              chatList.splice(j + 1, 1)
            }
            flag = false
            break
          }
        }
        if (flag) {
          var chat = this.getChatByChatRaw(chatListRaw[i])
          if (!chat) {
            break
          }
          chatListRaw[i].newMessage = false
          chatListRaw[i].statusChanged = false
          chatList.unshift(chat)
        }
        flag = true
      }
    }
    wx.setStorageSync('chatListRaw', chatListRaw)
    this.setData({
      chatList: chatList
    }) 
  },
  getChatByChatRaw(chatRaw){
    var chatId = chatRaw.chatId
    var isGroup = chatRaw.isGroup
    var lastMessage = chatRaw.messageArray[chatRaw.messageArray.length - 1]
    var lastMessageText = lastMessage.messageText
    var unReaded = chatRaw.unReaded
    var chat = {
      chatId: chatId,
      uName: "",
      avatarUrl: "",
      lastMessageText: lastMessageText,
      unReaded: unReaded,
      isGroup: isGroup
    }
    this.completeListInfo(chatRaw)
    return chat
  },

  completeListInfo: function (chatRaw){
    if(chatRaw.isGroup){
      var actyInfoPromise = util.getActivityInfo(chatRaw.chatId)
      actyInfoPromise.then(activityInfo => {
        var chatList = that.data.chatList
        for(var i=0; i<chatList.length; i++){
          if(chatList[i].chatId == chatRaw.chatId){
            chatList[i].avatarUrl = activityInfo.imgUrl
            chatList[i].uName = activityInfo.title
            break
          }
        }
        that.setData({
          chatList: chatList
        })
      })
    }
    else{
      var userInfoPromise = util.getUserInfo(chatRaw.chatId)
      userInfoPromise.then(userInfo => {
        var chatList = that.data.chatList
        for (var i = 0; i < chatList.length; i++) {
          if (chatList[i].chatId == chatRaw.chatId) {
            chatList[i].avatarUrl = userInfo.avatarUrl
            chatList[i].uName = userInfo.nickName
            break
          }
        }
        that.setData({
          chatList: chatList
        })
      })
    }
  },

  gotoChat: function(e){
    console.log(e)
    var chatInfo = {
      chatId: e.currentTarget.dataset.uid,
      isGroup: e.currentTarget.dataset.isgroup
    }
    var chatInfoString = JSON.stringify(chatInfo)
    wx.navigateTo({
      // url: "../viewUserInfo/viewUserInfo?id=2"
      url: "../chat/chat?chatInfo=" + chatInfoString
    })
  },
  clearRedDot:function(){
    wx.hideTabBarRedDot({ index: 1, })
  }
})
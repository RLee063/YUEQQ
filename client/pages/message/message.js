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
  },
  refreshAll: function(){
    var chatListRaw = app.getArrayFromStorage('chatListRaw')
    var chatList = []
    for (var i = 0; i < chatListRaw.length; i++) {
      var chat = this.getChatByChatRaw(chatListRaw[i])
      if (!chat) {
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
    this.refreshAll()
  },
  onShow: function () {
    this.clearRedDot()
    this.refreshAll()
    refresh = setInterval(this.refresh, 200)
    redDotClear = setInterval(this.clearRedDot, 200)
  },
  refresh: function(){
    var chatListRaw = app.getArrayFromStorage('chatListRaw')
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
              var chat = this.getChatByChatRaw(chatListRaw[i])
              chatList.unshift(chat)
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
    if(lastMessageText.length>30){
      lastMessageText = lastMessageText.slice(0, 28) + "..."
    }

    var lastMessageTime = this.getTimeFromFormatTime(lastMessage.time)
    var unReaded = chatRaw.unReaded
    var unReadedNum = chatRaw.unReadedNum > 9 ? "9+" : chatRaw.unReadedNum
    var chat = {
      chatId: chatId,
      uName: "",
      avatarUrl: "",
      lastMessageText: lastMessageText,
      lastMessageTime: lastMessageTime,
      lastMessageUname: "",
      lastMessageUid: lastMessage.uid,
      unReaded: unReaded,
      unReadedNum: unReadedNum,
      isGroup: isGroup,
    }
    this.completeListInfo(chatRaw)
    return chat
  },

  completeListInfo: function (chatRaw){
    var lastMessageUid = chatRaw.messageArray[chatRaw.messageArray.length - 1].uid
    var userInfoPromise1 = util.getUserInfo(lastMessageUid)
    userInfoPromise1.then(userInfo => {
      var chatList = that.data.chatList 
      for (var i = 0; i < chatList.length; i++) {
        if (chatList[i].chatId == chatRaw.chatId){
          if (chatList[i].lastMessageUid == lastMessageUid) {
            chatList[i].lastMessageUname = userInfo.nickName

            if (userInfo.nickName.length + chatList[i].lastMessageText.length > 30){
              chatList[i].lastMessageText = chatList[i].lastMessageText.slice(0, 28 - userInfo.nickName.length) + "..."
            }

            break
          }
        }
      }
      that.setData({
        chatList: chatList
      })
    })
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
  },
  getTimeFromFormatTime:function(time){
    var result = ""
    var startTime = time.split(' ')
    var startTimes = startTime[1].split(':')
    var startDate = startTime[0].split('-')

    var nowDate = new Date();
    var nowYear = nowDate.getFullYear();
    var nowMonth = nowDate.getMonth();
    var nowDay = nowDate.getDate();
    nowMonth++;

    if (parseInt(startDate[0]) < nowYear) {
      result += time
    }
    else {
      var dec
      if (parseInt(startDate[1]) < nowMonth) {
        switch (parseInt(startDate[1])) {
          case 2:
            dec = parseInt(startDate[2]) - nowDay + 28
          case 4:
          case 6:
          case 9:
          case 11:
            dec = parseInt(startDate[2]) - nowDay + 30
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12:
            dec = parseInt(startDate[2]) - nowDay + 30
        }
      }
      else {
        dec = parseInt(startDate[2]) - nowDay
      }
      switch (dec) {
        case 0:
          result += startTimes[0];
          result += ':'
          result += startTimes[1];
          break;
        case -1:
          result += "昨天"
          break;
        case -2:
          result += "前天"
          break;
        default:
          result += startDate[1]
          result += '月'
          result += startDate[2]
          result += '日'
          break;
      }
    }
    return result
  }
})
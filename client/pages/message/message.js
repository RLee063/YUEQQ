var app = getApp()
var redDotClear
var refresh
Page({
  data: {
    chatList:[]
  },

  onLoad: function (options) {
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
    var userInfo = app.getUserInfoByUid(chatRaw.chatId)
    if(!userInfo){
      console.log("no such userInfo")
      return false
    }
    var avatarUrl = userInfo.avatarUrl
    var uName = userInfo.nickName
    var lastMessage = chatRaw.messageArray[chatRaw.messageArray.length - 1]
    var lastMessageText = lastMessage.messageText
    var unReaded = chatRaw.unReaded

    var chat = {
      chatId: chatId,
      uName: uName,
      avatarUrl: avatarUrl,
      lastMessageText: lastMessageText,
      unReaded: unReaded
    }
    return chat
  },
  gotoChat: function(e){
    console.log(e)
    var chatId = e.currentTarget.dataset.uid
    wx.navigateTo({
      // url: "../viewUserInfo/viewUserInfo?id=2"
      url: "../chat/chat?chatId=" + chatId
    })
  },
  clearRedDot:function(){
    wx.hideTabBarRedDot({ index: 1, })
  }
})
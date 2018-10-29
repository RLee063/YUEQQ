// client/pages/chat/chat.js
var app = getApp();
var messageGetor;

Page({
  data: {
    messageArray: [],
    otherUid: [],
    chatId: "",
    messageText: "",
  },

  sendMessage: function(e) {
    if (app.tunnel && app.tunnel.isActive()) {
      if(e.detail.value.messageText==""){
        return
      }
      var msg = e.detail.value.messageText
      var myUid = wx.getStorageSync('openid')
      this.tunnel.emit('speak', {
        'word': {
          'to': this.data.chatId,
          'from': myUid,
          'msg': msg
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
        messageArray: []
      }
      for (var i = 0; i < chatListRaw.length; i++) {
        if (chatListRaw[i].chatId == this.data.chatId) {
          chat.messageArray = chatListRaw[i].messageArray
          chatListRaw.splice(i, 1)
          break
        }
      }
      chat.messageArray.push(message)
      chatListRaw.unshift(chat)

      wx.setStorageSync('chatListRaw', chatListRaw)
      this.getMessage()
    }
  },

  onUnload: function(){
    clearInterval(messageGetor)
  },

  onLoad: function (options) {
    app.getUserInfoByUid(options.chatId)
    this.tunnel = app.tunnel
    this.setData({
      chatId: options.chatId
    })
    messageGetor = setInterval(this.getMessage, 1000)

    var chatListRaw = app.getArrayFromStorage('chatListRaw')
    console.log(options)
    for(var i=0; i<chatListRaw.length; i++){
      if(chatListRaw[i].chatId == options.chatId){
        this.setData({
          messageArray: chatListRaw[i].messageArray
        })
        if (chatListRaw[i].unReaded){
          chatListRaw[i].statusChanged = true
        }
        chatListRaw[i].unReaded = false
      }
    }
    wx.setStorageSync('chatListRaw', chatListRaw)
  },

  getMessage(){
    var chatListRaw = app.getArrayFromStorage('chatListRaw')
    for (var i = 0; i < chatListRaw.length; i++) {
      if (chatListRaw[i].chatId == this.data.chatId) {
        if(chatListRaw[i].unReaded){
          chatListRaw[i].unReaded = false
          var messageArray = chatListRaw[i].messageArray
          this.setData({
            messageArray: messageArray
          })
        }
      }
      break
    }
    wx.setStorageSync('chatListRaw', chatListRaw)
  },

  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {                    wx.pageScrollTo({
        scrollTop: 1000000000,
        duration: 0
      })
    }).exec()
  },
})
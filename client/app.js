//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('./utils/util.js')
var that

App({
  globalData:{
  },
  onLaunch: function () {
    that = this
    var messageArray =  [{
      avatarUrl: "../../images/user1.jpg",
      messageText: "short message",
      userType: 0
    }, {
      avatarUrl: "../../images/user2.jpg",
      messageText: "中文测试",
      userType: 1
    }, {
      avatarUrl: "../../images/user1.jpg",
      messageText: "long message test u know why? yes it's me",
      userType: 0
    }, {
      avatarUrl: "../../images/user1.jpg",
      messageText: "long message test u know why? yes it's me",
      userType: 1
    }]
    wx.setStorageSync("messageo5ko3434RP2lZQNVamvVxfrAugoY", messageArray)
    qcloud.setLoginUrl(config.service.loginUrl)

    /*this.openTunnel()*/
  },
  /*

  openTunnel: function () {
    util.showBusy('信道连接中...')
    // 创建信道，需要给定后台服务地址
    var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)
    // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
    tunnel.on('connect', () => {
      util.showSuccess('信道已连接')
      console.log('WebSocket 信道已连接')
    })

    tunnel.on('close', () => {
      util.showSuccess('信道已断开')
      tunnel.open()
    })

    tunnel.on('reconnecting', () => {
      console.log('WebSocket 信道正在重连...')
      util.showBusy('正在重连')
    })

    tunnel.on('reconnect', () => {
      console.log('WebSocket 信道重连成功')
      util.showSuccess('重连成功')
    })

    tunnel.on('error', error => {
      util.showModel('信道发生错误', error)
      console.error('信道发生错误：', error)
    })

    // 监听自定义消息（服务器进行推送）
    tunnel.on('speak', speak => {
      console.log(speak)
      var message={}
      message.avatarUrl = speak.who.avatarUrl
      message.messageText = speak.word.msg
      message.userType = 1
      var key = "message"+speak.who.openId
    
      var messageArray=wx.getStorageSync(key)
      messageArray.push(message)
      wx.setStorageSync(key, messageArray)
    })

    // 打开信道
    tunnel.open()
  },*/
  getUserInfoByUid:function(uid){
    wx.request({
      url: `${config.service.host}/weapp/getUserInfo`,
      success(result) {
        console.log(result)
      },
      fail(error) {
        util.showModel('出现错误', error);
      }
    })
  }
})
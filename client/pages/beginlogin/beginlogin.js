var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var app = getApp()

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};


Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    authorized: false
  },
  onLoad: function(options) {

    if (wx.getStorageSync('logged') == true) {
      this.openTunnel()
      this.setData({
        authorized: true
      })
    }


  },
  onShow: function() {
    if (this.data.authorized) {
      wx.switchTab({
        url: '../home/home'
      })

      return
    }

  },
  openTunnel: function() {
    util.showBusy('信道连接中...')
    // 创建信道，需要给定后台服务地址
    var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)
    app.tunnel = tunnel
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
      var message = {}
      message.avatarUrl = speak.who.avatarUrl
      message.messageText = speak.word.msg
      message.userType = 1
      var key = "message" + speak.who.openId

      var messageArray = wx.getStorageSync(key)
      messageArray.push(message)
      wx.setStorageSync(key, messageArray)
    })

    // 打开信道
    tunnel.open()
  },

  startprogram: function() {
    this.login()
    if (wx.getStorageSync('logged') == true) {
      this.openTunnel()
    }

  },

  // 用户登录示例
  login: function() {
    if (this.data.logged) return


    var that = this

    // 调用登录接口
    qcloud.login({

      success(result) {
        util.showBusy('正在登录')
        if (result) {
          util.showSuccess('登录成功')
          that.setData({
            userInfo: result,
            logged: true
          })
          wx.setStorageSync('userInfo', result);
          wx.setStorageSync('logged', true)
          that.openTunnel()
          console.log("openid is :" + wx.getStorageSync('openid'))
          wx.switchTab({
            url: '../home/home'
          })


        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              util.showSuccess('登录成功')
              wx.setStorageSync('me', result)
              console.log("openid is :" + wx.getStorageSync('openid'))
              that.setData({
                userInfo: result,
                logged: true
              })
              wx.setStorageSync('userInfo', result);
              wx.setStorageSync('logged', true)
              wx.switchTab({
                url: '../home/home'
              })
            },
            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        util.showModel('登录失败', '请开启微信授权，否则无法登陆！' + error)
        console.log('登录失败', error)

      }
    })
  },

})
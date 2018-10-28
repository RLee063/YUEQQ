//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('./utils/util.js')
var that

App({
  globalData:{
    logged: false,
    authorized: false
  },
  onLaunch: function () {
    that = this
    qcloud.setLoginUrl(config.service.loginUrl)
  },
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
  },
  checkIfArrayExistInStorage: function(key) {
    var ret = wx.getStorageSync(key)
    if(!ret){
      var array = []
      wx.setStorageSync(key, array)
    }
  },
})
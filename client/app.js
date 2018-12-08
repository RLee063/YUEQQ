//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('./utils/util.js')
var that

App({
  globalData:{
    shareAid: "",
    isAdmin: false,
    logged: false,
    authorized: false,
    sportType: ['乒乓球', '篮球', '网球', '羽毛球', '足球',  '跑步'],
    grades: ["大一", "大二", "大三", "大四", "研究生", "博士生"],
    colleges: ["计算机学院", "医学院", "数学院", "电子学院", "外语学院"]
  },
  onLaunch: function () {
    that = this
    qcloud.setLoginUrl(config.service.loginUrl)
    this.setSystemInfo()
  },
  setSystemInfo(){
    var system = {
      avatarUrl: ""
    }
    wx.setStorageSync("systemUid", system)
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
  getArrayFromStorage: function(key) {
    var ret = wx.getStorageSync(key)
    if(!ret){
      var ret = []
      wx.setStorageSync(key, ret)
    }
    return ret
  },
  storeUserInfoByUid: function(uid, userInfo){
    var ret = wx.getStorageSync(uid)
    if(!ret){
      wx.setStorageSync(uid, userInfo)
    }
  }
})
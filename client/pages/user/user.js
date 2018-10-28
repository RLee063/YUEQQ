//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    homePicUrl: "background.jpg",
    userInfo: {},
    logged: false,
    requestResult: '',
    motto: 'this is the motto',
    changemotto: 0,
  },


  onLoad: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      logged: wx.getStorageSync('logged')
    })

    console.log(wx.getStorageSync('userInfo'))
  },

  onShow: function() {
    this.setData({
      changemotto: wx.getStorageSync('changemotto')
    })
    if (this.data.changemotto == 1) {
      this.setData({
        motto: wx.getStorageSync('newmotto')
      })
    }
  },

  information: function() {
    wx.navigateTo({
      url: '../info/info',
    })
  },
  activities: function() {
    var selfinfo = {
      nickName: this.data.userInfo.nickName,
      avatarUrl: this.data.userInfo.avatarUrl,
      motto: this.data.motto,
      logged: this.data.logged,
      sex: this.data.userInfo.gender,
      uid: wx.getStorageSync('openid')

    }
    wx.navigateTo({
      url: '../activities/activities?info=' + JSON.stringify(selfinfo),
    })
  },




})
//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    imgUrl: "",
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    phone: '13078754853',
    homePicUrl: ""
  },


  onLoad: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      logged: wx.getStorageSync('logged')
    })
    console.log(wx.getStorageSync('userInfo'))
    console.log("on user page userinfo is" + this.data.userInfo)

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
      uid: this.data.userInfo.openId

    }
    wx.navigateTo({
      url: '../activities/activities?info=' + JSON.stringify(selfinfo),
    })
  },

  settings: function() {

    wx.navigateTo({
      url: '../settings/settings',
    })
  },



  makephonecall: function() {

    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  }

})
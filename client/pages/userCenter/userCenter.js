//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    homePicUrl: "",
    userInfo: {},
    logged: false,
    requestResult: '',
    motto: 'this is the motto',
    changemotto: 0,
  },

  onLoad: function() {
    console.log(wx.getStorageSync('userInfo'))
    if (wx.getStorageSync('userInfo').nickName) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        logged: wx.getStorageSync('logged'),
        openId: wx.getStorageSync('openid'),
      })
    } else {
      this.setData({
        userInfo: wx.getStorageSync('userInfo').data.data,
        logged: wx.getStorageSync('logged'),
        openId: wx.getStorageSync('openid'),
      })
    }

  },

  onShow: function() {
    var that = this
    wx.request({
      url: `${config.service.host}/weapp/getUserInfo`,
      method: 'GET',
      data: {
        uid: that.data.openId,
      },
      success(result) {
        console.log(result.data.data)
        that.setData({
          userInfo: result.data.data[0],
          homePicUrl: result.data.data[0].homePicUrl
        })
      },
      fail(error) {
        util.showModel('保存失败', error);
      }
    })
    


  },

  appInfo:function(){
    wx.navigateTo({
      url: '../appInfo/appInfo',
    })
  },

  information: function() {
    wx.navigateTo({
      url: '../viewUserInfo/viewUserInfo',
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
      url: '../myActivities/myActivities?info=' + JSON.stringify(selfinfo),
    })
  },

  recommend: function() {

  }

})
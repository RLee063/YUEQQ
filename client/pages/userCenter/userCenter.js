//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    homePicUrl: "https://uestc0510-1257207887.cos.ap-chengdu.myqcloud.com/1543237069447-mHdJscD5W.png",
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
          userInfo: result.data.data[0]
        })
      },
      fail(error) {
        util.showModel('保存失败', error);
      }
    })
    var pic
    if (this.data.userInfo.homePicUrl != "undefined") {
      pic = this.data.userInfo.homePicUrl
      this.setData({
        homePicUrl: pic
      })
    } else {
      this.setData({
        changemotto: wx.getStorageSync('changemotto')
      })
      if (this.data.changemotto == 1) {
        this.setData({
          motto: wx.getStorageSync('newmotto')
        })
      }
      this.setData({
        changebkgd: wx.getStorageSync('changebkgd')
      })
      if (this.data.changebkgd == 1) {
        this.setData({
          homePicUrl: wx.getStorageSync('bkgdpic')
        })
      }
    }

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
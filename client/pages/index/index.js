//index.js
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: ''
    },
  onLoad: function(){
  },

  otheruser: function () {
    var otherinfo = {
      nickName:this.data.userInfo.nickName,
      avatarUrl: this.data.userInfo.avatarUrl,
    }
    wx.navigateTo({
      url: '../otheruser/otheruser?info=' + JSON.stringify(otherinfo),
    })
  },

    login: function() {
        util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    util.showSuccess('登录成功1')
                    that.setData({
                        userInfo: result,
                    })
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                          console.log(result)
                          util.showSuccess('登录成功2')
                          wx.setStorageSync('openid', result.data.data.openId)
                          wx.setStorageSync('me', result)
                        },
                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
    },
})

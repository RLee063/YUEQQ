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

  // 用户登录示例
  login: function () {
    if (this.data.logged) return

    util.showBusy('正在登录')
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          util.showSuccess('登录成功')
          that.setData({
            userInfo: result,
            logged: true
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              util.showSuccess('登录成功')
              that.setData({
                userInfo: result.data.data,
                logged: true
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
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },

  // 切换是否带有登录态
  switchRequestMode: function (e) {
    this.setData({
      takeSession: e.detail.value
    })
    this.doRequest()
  },

  doRequest: function () {
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.requestUrl,
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        console.log('request success', result)
        that.setData({
          requestResult: JSON.stringify(result.data)
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    }
    if (this.data.takeSession) { // 使用 qcloud.request 带登录态登录
      qcloud.request(options)
    } else { // 使用 wx.request 则不带登录态
      wx.request(options)
    }
  },

  // 上传图片接口
  doUpload: function () {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]

        // 上传图片
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function (res) {
            util.showSuccess('上传图片成功')
            console.log(res)
            res = JSON.parse(res.data)
            console.log(res)
            that.setData({
              imgUrl: res.data.imgUrl
            })
          },

          fail: function (e) {
            util.showModel('上传图片失败')
          }
        })

      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  onLoad: function () {


  },

  information: function () {
    wx.setStorageSync('userInfo', this.data.userInfo);
    wx.setStorageSync('logged', this.data.logged)
    wx.navigateTo({
      url: '../info/info',
    })
  },
  activities: function () {
    console.log(this.data.userInfo)
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
  settings: function () {
    wx.navigateTo({
      url: '../settings/settings',
    })
  },


  makephonecall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  }

})
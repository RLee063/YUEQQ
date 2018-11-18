// pages/addActy/addActy.js
var util = require('../../utils/util.js')
var config = require('../../config')
var app = getApp()
var that

Page({
  data: {
    userInfo :{},
    grades: [],
    colleges: []
  },
  onLoad: function(e) {
    that = this
    var uid = wx.getStorageSync('openid')
    var myInfoPromise = util.getUserInfo(uid)
    myInfoPromise.then(userInfo => {
      that.setData({
        grades: app.globalData.grades,
        colleges: app.globalData.colleges,
        userInfo: userInfo
      })
      console.log(userInfo)
    })
    var maxNumRange = [];

  },
  receiveImageUrl: function(imgUrl){
    var userInfo = that.data.userInfo
    userInfo.homePicUrl = imgUrl
    that.setData({
      userInfo: userInfo
    })
  },
  bindGradeChange: function(e) {
    var userInfo = this.data.userInfo
    userInfo.grade = this.data.grades[e.detail.value]
    this.setData({
      userInfo: userInfo
    })
  },
  bindCollegeChange: function(e){
    var userInfo = this.data.userInfo
    userInfo.college = this.data.colleges[e.detail.value]
    this.setData({
      userInfo: userInfo
    })
  },
  chooseImg: function (e) {
    wx.navigateTo({
      url: '../cropper/cropper',
    })
  },
  doSubmit: function(e) {
    var userInfo = that.data.userInfo
    userInfo.motto = e.detail.value.motto
    userInfo.phone = e.detail.value.phone
    wx.request({
      url: `${config.service.host}/weapp/updateUserInfo`,
      data: {
        uid: wx.getStorageSync('openid'),
        homePicUrl: userInfo.homePicUrl,
        phone: userInfo.phone,
        motto: userInfo.motto,
        grade: userInfo.grade,
        college: userInfo.college
      },
      success: result => {
        console.log(result)
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },

  addTag: function(e) {
    console.log(e)
    if (e.detail.value == "") {
      return
    }
    var tags = this.data.tags
    tags.push(e.detail.value)
    this.setData({
      tags: tags,
      tagInput: ""
    })
    console.log(this.data)
  },

  removeTag: function(e) {
    console.log(e)
    var tags = this.data.tags
    tags.splice(tags.indexOf(e.target.dataset.name), 1)
    this.setData({
      tags: tags
    })
  },
})
// pages/addActy/addActy.js
var util = require('../../utils/util.js')
var config = require('../../config')
var app = getApp()
var that

Page({
  data: {
    userInfo :{
      college: "请选择学院",
      grade: "请选择年级"
    },
    grades: [],
    colleges: [],
    isFirstLogin: false,
    sportType: [],
    skills: [0,0,0,0,0,0]
  },
  onLoad: function(options) {
    that = this
    that.setData({
      grades: app.globalData.grades,
      colleges: app.globalData.colleges,
    })

    if(options.dataString){
      var data = JSON.parse(options.dataString)
      uid = data.uid
      if (data.isFirstLogin) {
        this.setData({
          sportType: app.globalData.sportType
        })
        this.setData({
          isFirstLogin: true
        })
        return
      }
    }
    var uid = wx.getStorageSync('openid')
    var myInfoPromise = util.getUserInfo(uid)
    myInfoPromise.then(userInfo => {
      that.setData({
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
  mottoChange: function(e){
    var userInfo = this.data.userInfo
    userInfo.motto = e.detail.value
    this.setData({
      userInfo: userInfo
    })
  },
  phoneChange: function(e){
    var userInfo = this.data.userInfo
    userInfo.phone = e.detail.value
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
    var data = {
      uid: wx.getStorageSync('openid'),
      homePicUrl: userInfo.homePicUrl,
      phone: userInfo.phone,
      motto: userInfo.motto,
      grade: userInfo.grade,
      college: userInfo.college
    }
    if(that.data.isFirstLogin){
      data.skills = that.data.skills.join(',')
    }
    console.log("AKLDJKLASJKLDALSD")
    wx.request({
      url: `${config.service.host}/weapp/updateUserInfo`,
      data: data,
      success: result => {
        console.log(result)
        if(that.data.isFirstLogin){
          wx.switchTab({
            url: '../home/home',
          })
        }
        else{
          wx.navigateBack({
            delta: 1,
          })
        }
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

  bindSkillsChange: function(e) {
    that.data.skills[e.currentTarget.index] = e.detail.value
    that.setData({
      skills: that.data.skills
    })
  }
})
// pages/addActy/addActy.js
var util = require('../../utils/util.js')
var config = require('../../config')
var app = getApp()
var that

function yearMonthDayToDate(year, month, day) {
  var result = ""
  result += year
  result += '-'
  result += month
  result += '-'
  result += day
  return result
}

Page({
  data: {
    imgTempPath: "https://qcloudtest-1257207887.cos.ap-guangzhou.myqcloud.com/1536468704720-MUpMq2yU3.jpg",
    title: "",
    introduction: "",
    date: "",
    time: "",
    sportType: "",
    creditLimit: 3,
    maxNum: 6,
    description: "",

    tags: ["高手退散", "我无敌了"],

    startTime: "",
    isDefaultImage: true,
    timePickerStartBkup: "",
    timePickerStart: "",
    datePickerStart: "",
    datePickerEnd: "",
    maxNumRange: [],
    sportTypeRange: [],
    tagInput: ""
  },
  onLoad: function(e) {
    that = this
    var maxNumRange = [];
    for (var i = 2; i < 30; i++) {
      maxNumRange.push(i)
    }
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var nowDate = yearMonthDayToDate(year, month, day);
    var endDate = yearMonthDayToDate(year, month + 1, day);
    var timeArray = util.getTime().split(" ")[1].split(":")
    var nowTime = timeArray[0] + ":" + timeArray[1]
    var sportTypeRange = app.globalData.sportType
    this.setData({
      date: nowDate,
      datePickerStart: nowDate,
      datePickerEnd: endDate,
      maxNumRange: maxNumRange,
      timePickerStartBkup: nowTime,
      timePickerStart: nowTime,
      time: nowTime,
      sportTypeRange: sportTypeRange,
      sportType: sportTypeRange[0],
    })
  },
  bindMaxNumChange: function(e) {
    this.setData({
      maxNum: e.detail.value
    })
  },
  bindDateChange: function(e) {
    console.log(e)
    if(e.detail.value == util.getTime().split(" ")[0]){
      that.setData({
        timePickerStart: that.data.timePickerStartBkup
      })
    }
    else{
      that.setData({
        timePickerStart: "00:00"
      })
    }
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindSportTypeChange: function(e) {
    this.setData({
      sportType: this.data.sportTypeRange[e.detail.value]
    })
  },
  bindCreditLimitChange: function(e) {
    this.setData({
      creditLimit: e.detail.value
    })
  },
  chooseImg: function(e) {
    var that = this
    wx.navigateTo({
      url: '../cropper/cropper',
    })
  },

  addActySubmit: function(e) {
    console.log(e)
    this.setData({
      title: e.detail.value.title,
      introduction: e.detail.value.introduction,
      description: e.detail.value.description
    })
    if (e.detail.value.title === "") {
      wx.showToast({
        title: '请输入活动标题',
        icon: "none"
      })
      return
    }
    if (this.data.imgTempPath == "") {
      wx.showToast({
        title: '请选择图片',
        icon: "none"
      })
      return
    }
    that.uploadInfo()
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
  receiveImageUrl: function(imgUrl) {
    that.setData({
      imgTempPath: imgUrl
    })
  },
  uploadInfo: function() {
    var createTime = util.getTime()
    var startTime = that.data.date + " " + that.data.time + ":00"

    var data = {
      uid: wx.getStorageSync('openid'),
      createTime: createTime,
      title: that.data.title,
      introduction: that.data.introduction,
      startTime: startTime,
      sportType: that.data.sportType,
      imgUrl: that.data.imgTempPath,
      maxNum: that.data.maxNum,
      creditLimit: that.data.creditLimit,
      description: that.data.description,
      tags: that.data.tags
    }
    console.log(data)
    wx.request({
      url: `${config.service.host}/weapp/createActivity`,
      method: 'GET',
      data: data,
      success(result) {
        util.showSuccess('请求成功完成')
        //that.resetData()
        wx.switchTab({
          url: '../home/home',
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
      }

    })
  }

})
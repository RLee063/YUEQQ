// pages/addActy/addActy.js
var util = require('../../utils/util.js')
var config = require('../../config')

function yearMonthDayToDate(year, month, day){
  var result=""
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
    title: "来打球吧朋友",
    maxNum: 6,
    tags: ["高手退散", "我无敌了"],
    sportType: "羽毛球",
    startTime: "12-20",
    date: "",
    time: "12:00",
    isDefaultImage: true,
    datePickerStart:"",
    datePickerEnd:"",
    maxNumRange: [],
    sportTypeRange: ["篮球", "羽毛球", "乒乓球", "网球", "足球", "跑步"],
    tagInput:""
  },

  onLoad: function(e){
    var maxNumRange = [];
    for(var i=2; i<30; i++){
      maxNumRange.push(i)
    }
    var result;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var nowDate = yearMonthDayToDate(year, month, day);
    var endDate = yearMonthDayToDate(year, month+1, day);
    this.setData({
      date: nowDate,
      datePickerStart: nowDate,
      datePickerEnd: endDate,
      maxNumRange: maxNumRange
    })
  },
  bindMaxNumChange: function(e){
    this.setData({
      maxNum: this.data.maxNumRange[e.detail.value]
    })
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindSportTypeChange: function(e){
    this.setData({
      sportType: this.data.sportTypeRange[e.detail.value]
    })
  },
  chooseImg: function(e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function(res) {
        that.setData({
          imgTempPath: res.tempFilePaths[0],
          isDefaultImage: false
        })
      },
    })
  },

  addActySubmit: function(e) {
    this.setData({
      title: e.detail.value.title
    }) 
    if (e.detail.value.title === "") {
      wx.showToast({
        title: '请输入内容',
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
    upLoadImgAndGetUrl(this)
  },

  addTag: function(e) {
    console.log(e)
    if(e.detail.value==""){
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
    tags.splice(tags.indexOf(e.target.dataset.name),1)
    this.setData({
      tags: tags
    })
  },
})

function upLoadImgAndGetUrl(that) {
  util.showBusy('正在上传')
  if(that.data.isDefaultImage){
    uploadInfo(that.data.imgTempPath, that)
    return
  }

  wx.uploadFile({
    url: config.service.uploadUrl,
    filePath: that.data.imgTempPath,
    name: 'file',
    success: function(res) {
      util.showSuccess('上传图片成功')
      res = JSON.parse(res.data)
      uploadInfo(res.data.imgUrl, that)
    },

    fail: function(e) {
      util.showModel('上传图片失败')
      return null
    }
  })
}

function uploadInfo(imgUrl, that) {
  if (imgUrl == null) {
    wx.showToast({
      title: 'imgUrl == null',
      icon: "none"
    })
    return
  }
  //set data
  var uid = wx.getStorageSync('openid')
  if (uid == "") {
    wx.showToast({
      title: '请先登录:)',
      icon: "none"
    })
    return
  }
  var createTime = getNowFormatDate()
  var startTime = that.data.date + " " + that.data.time + ":00"
  wx.checkSession({
    success: function(res) {
      wx.request({
        url: `${config.service.host}/weapp/createActivity`,
        method: 'GET',
        data: {
          uid: uid,
          title: that.data.title,
          startTime: startTime,
          createTime: createTime,
          imgUrl: imgUrl,
          maxNum: that.data.maxNum,
          tags: that.data.tags,
          sportType: that.data.sportType
        },
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
    },
    fail: function(res) {
      util.showModel('请先登录', '在帮助中先授权再登录');
    }
  })
}

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
  return currentdate;
}
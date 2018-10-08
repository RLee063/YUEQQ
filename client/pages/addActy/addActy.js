// pages/addActy/addActy.js
var util = require('../../utils/util.js')
var config = require('../../config')

// var info = {
//   name: "",
//   avatarUrl: "",
//   motto: "",
//   imgUrl: "",
// }

Page({
  data: {
    imgTempPath: "https://qcloudtest-1257207887.cos.ap-guangzhou.myqcloud.com/1536468704720-MUpMq2yU3.jpg",
    title:"来打球吧朋友",
    maxNum: "6",
    tags: ["高手退散", "我无敌了"],
    sportType: "羽毛球",
    startTime: "",
    date: "2016-09-01",
    time: "20:18",
    isDefaultImage: true,
    addTagInput:""
  },
  
  bindDateChange: function(e){
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange: function(e){
    console.log(e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },

  chooseImg: function(e){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function(res) {
        that.setData({
          imgTempPath: res.tempFilePaths[0],
          isDefaultImage: false
        })
        console.log("已经设置isDefaultImage")
      },
    })
  },

  addActySubmit: function(e){
    if(e.detail.value.title === ""){
      wx.showToast({
        title: '请输入内容',
        icon: "none"
      })
      return
    }
    if(this.data.imgTempPath==""){
      wx.showToast({
        title: '请选择图片',
        icon: "none"
      })
      return
    }
    upLoadImgAndGetUrl(this)
  },

  addTag: function(e){
    var tags = this.data.tags
    tags.push(e.detail.value)
    this.setData({
      tags: tags,
      addTagInput:""
    })
  },

  deleteTag: function(e){
    var tags = this.data.tags
    for(var i=0; i<tags.length; i++){
      if(tags[i]==e.target.dataset.text){
        tags.splice(i,1)
        break
      }
    }
    this.setData({
      tags: tags
    })
  },

  resetData: function(){
    this.setData({
      imgTempPath: "https://qcloudtest-1257207887.cos.ap-guangzhou.myqcloud.com/1536468704720-MUpMq2yU3.jpg",
      title: "来打球吧朋友",
      maxNum: "6",
      tags: ["高手退散", "我无敌了"],
      sportType: "羽毛球",
      startTime: "",
      date: "2016-09-01",
      time: "20:18",
      isDefaultImage: true
    })
  }
})

function upLoadImgAndGetUrl(that) {
  console.log(that.data.imgTempPath)
  util.showBusy('正在上传')
  console.log(that.data.isDefaultImage)
  if(that.data.isDefaultImage){
    uploadInfo(that.data.imgTempPath, that)
    return
  }

  wx.uploadFile({
    url: config.service.uploadUrl,
    filePath: that.data.imgTempPath,
    name: 'file',
    success: function (res) {
      console.log(res)
      util.showSuccess('上传图片成功')
      res = JSON.parse(res.data)
      console.log(res)
      uploadInfo(res.data.imgUrl, that)
    },

    fail: function (e) {
      util.showModel('上传图片失败')
      return null
    }
  })
}

function uploadInfo (imgUrl, that){
  if (imgUrl == null) {
    console.log(imgUrl)
    wx.showToast({
      title: 'imgUrl == null',
      icon: "none"
    })
    return
  }
  //set data
  var uid = wx.getStorageSync('openid')
  if(uid == ""){
    wx.showToast({
      title: '请先登录:)',
      icon: "none"
    })
    return
  }
  var createTime = getNowFormatDate()
  var startTime = that.data.date +" "+ that.data.time+":00"
  var tags = ""
  for(var i=0; i<that.data.tags.length; i++){
    tags += that.data.tags[i]
    tags += " "
  }
  wx.checkSession({
    success: function (res) {
      console.log(res)
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
          tags: tags,
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
    fail: function (res) {
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
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes()+ seperator2 + date.getSeconds();
  console.log(currentdate)
  return currentdate;
}
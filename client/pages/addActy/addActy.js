// pages/addActy/addActy.js
var util = require('../../utils/util.js')
var config = require('../../config')
var imgTempPath = ""
var that

var info = {
  name: "",
  avatarUrl: "",
  motto: "",
  imgUrl: ""
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgTempPath:"",
    inputData:""
  },

  chooseImg: function(e){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function(res) {
        imgTempPath=res.tempFilePaths[0]
        that.setData({
          imgTempPath: res.tempFilePaths[0]
        })
      },
    })
  },

  addActySubmit: function(e){
    if(e.detail.value.userMotto === ""){
      wx.showToast({
        title: '请输入内容',
        icon: "none"
      })
      return
    }
    if(imgTempPath==""){
      wx.showToast({
        title: '请选择图片',
        icon: "none"
      })
      return
    }
    info.motto = e.detail.value.userMotto
    that = this
    upLoadImgAndGetUrl()
  },

  clearInfo: function(){
    info.avatarUrl=""
    info.imgUrl=""
    info.motto=""
    info.name=""
    that.setData({
      imgTempPath: "",
      inputData:""
    })
  }
})

function upLoadImgAndGetUrl() {
  util.showBusy('正在上传')
  // 上传图片
  wx.uploadFile({
    url: config.service.uploadUrl,
    filePath: imgTempPath,
    name: 'file',

    success: function (res) {
      util.showSuccess('上传图片成功')
      res = JSON.parse(res.data)
      console.log(res)
      uploadInfo(res.data.imgUrl)
    },

    fail: function (e) {
      util.showModel('上传图片失败')
      return null
    }
  })
}

function uploadInfo (imgUrl){
  if (imgUrl == null) {
    console.log(imgUrl)
    wx.showToast({
      title: 'imgUrl == null',
      icon: "none"
    })
    return
  }
  console.log(imgUrl)
  wx.getUserInfo({
    success: function (res) {
      wx.request({
        url: `${config.service.host}/weapp/addActy`,
        method: 'GET',
        data: {
          name: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          motto: info.motto,
          imgUrl: imgUrl
        },
        success(result) {
          util.showSuccess('请求成功完成')
          that.clearInfo()
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
      util.showModel('请先登录', '在帮助中授权及登录');
    }
  })
}
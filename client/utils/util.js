var config = require('../config.js')
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds() 
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

var px2rpx = (px) => {
  return px * 750 / wx.getSystemInfoSync().windowWidth
}

var rpx2px = (rpx) => {
  return rpx / 750 * wx.getSystemInfoSync().windowWidth
}

var getUserInfo = function(uid){
  var ret
  var userInfo = wx.getStorageSync(uid)
  if (userInfo) {
    ret = new Promise(function (resolve, reject) {
      resolve(userInfo)
    })
  }
  else{
    ret = getUserInfoFromServer(uid)
  }
  return ret
}

var getUserInfoFromServer = function(uid){
  var ret = new Promise(function (resolve, reject) {
      wx.request({
        url: `${config.service.host}/weapp/getUserInfo`,
        method: 'GET',
        data: {
          uid: uid,
        },
        success(result) {
          console.log(result)
          wx.setStorageSync(uid, result.data.data[0])
          resolve(result.data.data[0])
        },
        fail(error) {
          reject(error)
        }
      })
    }
  )
  return ret
}

var getActivityInfo = function (aid) {
  var ret
  var activityInfo = wx.getStorageSync(aid)
  if (activityInfo) {
      ret = new Promise(function (resolve, reject) {
      resolve(activityInfo)
    })
  }
  else {
    ret = getActivityInfoFromServer(aid)
  }
  return ret
}

var getActivityInfoFromServer = function (aid) {
  var ret = new Promise(function (resolve, reject) {
    wx.request({
      url: `${config.service.host}/weapp/getActivityInfo`,
      method: 'GET',
      data: {
        aid: aid,
      },
      success(result) {
        console.log(result)
        wx.setStorageSync(aid, result.data.data)
        resolve(result.data.data)
      },
      fail(error) {
        reject(error)
      }
    })
  }
  )
  return ret
}

var getTime = function() {
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

  var one2two = function(str){

    if(str.toString().length < 2){
      return "0"+str
    }
    else{
      return str
    }
  }

  var currentdate = date.getFullYear() + seperator1 + one2two(month) + seperator1 + one2two(strDate) + " " + one2two(date.getHours()) + seperator2 + one2two(date.getMinutes()) + seperator2 + one2two(date.getSeconds());
  return currentdate;
}

module.exports = { formatTime, showBusy, showSuccess, showModel ,px2rpx, rpx2px, getUserInfo, getUserInfoFromServer, getActivityInfo, getActivityInfoFromServer, getTime}

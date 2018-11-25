// pages/create_undo/create_undo.js
var util = require('../../utils/util.js')
var config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    newActyInfo: {},
  },

  details: function (e) {
    
    var aid = e.currentTarget.dataset.aid
    wx.navigateTo({
      url: "../viewActivityInfo/viewActivityInfo?aid=" + aid
    })
  },
  getActyInfo: function () {
    var that = this
    wx.request({
      url: `${config.service.host}/weapp/getMyActivities`,
      method: 'GET',
      data: {
        uid: that.data.uid,
      },
      success(result) {

        that.setData({
          newActyInfo: result.data.data.createdActivities.started
        })
        console.log(result)
        console.log(that.data.newActyInfo)
        that.formatInfo()
      },
      fail(error) {
        util.showModel('查看活动列表失败', error);
      }
    })
  },
  formatInfo: function () {
    var tempActyInfo = this.data.newActyInfo

    var nowDate = new Date();
    var nowYear = nowDate.getFullYear();
    var nowMonth = nowDate.getMonth();
    var nowDay = nowDate.getDate();
    var nowHour = nowDate.getHours();
    var nowMinute = nowDate.getMinutes();
    nowMonth++;
    if (nowMonth > 12) {
      nowMonth = 1
    }

    var str1 = nowYear + "-" + nowMonth + "-" + nowDay + "-" + nowHour + "-" + nowMinute;
    var str2 = nowYear + "-" + (nowMonth + 1) + "-" + nowDay + "-" + nowHour + "-" + nowMinute;
    var sTime = tempActyInfo[1].startTime.substring(0, 10) + '-' + tempActyInfo[1].startTime.substring(11, 13) + '-' + tempActyInfo[1].startTime.substring(14, 16)
    console.log(str1)
    console.log(sTime)
    if (Date.parse(str1) < Date.parse(str2)) {
      console.log('yessssss!')
    }

    for (var i = 0; i < tempActyInfo.length; i++) {
      var sTime = tempActyInfo[i].startTime.substring(0, 10) + '-' + tempActyInfo[i].startTime.substring(11, 16)
      tempActyInfo[i].startTime = sTime
      switch (tempActyInfo[i].sportType) {
        case '乒乓球':
          tempActyInfo[i].sportType = 0
          break

        case '篮球':
          tempActyInfo[i].sportType = 1
          break
        case '网球':
          tempActyInfo[i].sportType = 2
          break
        case '羽毛球':
          tempActyInfo[i].sportType = 3
          break
        case '足球':
          tempActyInfo[i].sportType = 4
          break
        case '跑步':
          tempActyInfo[i].sportType = 5
          break
      }
    }

    this.setData({
      newActyInfo: tempActyInfo
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: options.uid
    })

    this.getActyInfo()
  },


})
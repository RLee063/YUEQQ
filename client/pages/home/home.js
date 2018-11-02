var util = require('../../utils/util.js')
var config = require('../../config')

var acties = []

Page({
  data:{
    activitiesArray: []
  },
  onReachBottom: function(){
    var that = this
    var activitiesArray = this.data.activitiesArray
    var lastAid = activitiesArray[activitiesArray.length-1].aid
    wx.request({
      url: `${config.service.host}/weapp/pullRefresh`,
      data: {
        aid : lastAid
      },
      success(result) {
        console.log(result)
        var newActies = result.data.data
        that.formatActivitiesArray(newActies)
        var activitiesArray = that.data.activitiesArray
        for(var i=0; i<newActies.length; i++){
          activitiesArray.push(newActies[i])
        }
        that.setData({
          activitiesArray: activitiesArray
        })
      },
      fail(error) {
        util.showModel('刷新失败', error);
      }
    })
  },
  onPullDownRefresh: function(){
    var that=this
    this.refresh(that)
  },
  refresh: function(that){
    var that=this
    wx.request({
      url: `${config.service.host}/weapp/pullRefresh`,
      success(result) {
        acties = result.data.data
        that.formatActivitiesArray(acties)
        that.setData({
          activitiesArray: acties
        })
        wx.stopPullDownRefresh()
      },
      fail(error) {
        util.showModel('刷新失败', error);
      }
    })
  },
  onLoad: function(){
    this.refresh(this)
  },
  onShow: function(){
  },
  viewUserInfo: function(e){
    var uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      // url: "../viewUserInfo/viewUserInfo?id=2"
      url: "../chat/chat?chatId="+uid
    })
  },
  tapActivity: function(e){
    var uid = wx.getStorageSync('openid')
    if(uid == ""){
      util.showModel('请先登录', '刷新失败')
    }
    wx.request({
      url: `${config.service.host}/weapp/joinActivity`,
      data:{
        uid: uid,
        aid: e.currentTarget.dataset.aid
      },
      success(result) {
        if(result.data.code==1){
          util.showModel('加入成功', '刷新失败');
        }
      },
      fail(error) {
        util.showModel('加入失败', error);
      }
    })
  },
  formatActivitiesArray(acties){
    acties.forEach(this.formatEachActivity, this)
    acties.forEach(this.formatEachSportType, this)
    //var startTimeArray = startTime.split(' ');
  },
  formatEachSportType(item){
    switch(item.sportType){
      case "篮球":
        item.sportType = 0
        break
      case "羽毛球":
        item.sportType = 1
        break
      case "乒乓球":
        item.sportType = 2
        break
      case "网球":
        item.sportType = 3
        break
      case "足球":
        item.sportType = 4
        break
      case "跑步":
        item.sportType = 5
        break
    }
  },
  formatEachActivity(item){
    var result = ""

    var startTime = item.startTime.split(' ')
    var startTimes = startTime[1].split(':')
    var startDate = startTime[0].split('-')

    var nowDate = new Date();
    var nowYear = nowDate.getFullYear();
    var nowMonth = nowDate.getMonth();
    var nowDay = nowDate.getDate();
    nowMonth ++;

    if(parseInt(startDate[0])>nowYear){
      result += item.startTime
    }
    else{
      var dec
      if (parseInt(startDate[1]) > nowMonth){ 
        switch (parseInt(startDate[1])){
          case 2:
            dec = parseInt(startDate[2]) - nowDay + 28
          case 4:
          case 6:
          case 9:
          case 11:
            dec = parseInt(startDate[2]) - nowDay + 30
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12:
            dec = parseInt(startDate[2]) - nowDay + 30
        }
      }
      else{
        dec = parseInt(startDate[2]) - nowDay
      }
      switch (dec) {
        case 0:
          result += "今天"
          break;
        case 1:
          result += "明天"
          break;
        case 2:
          result += "后天"
          break;
        default:
          result += startDate[1]
          result += '月'
          result += startDate[2]
          result += '日'
          break;
      }
    }
    result += " ";
    result += startTimes[0];
    result += ':'
    result += startTimes[1];
    item.startTime = result;
  },
  addActy: function(){
    wx.navigateTo({
      url: '../addActy/addActy',
    })
  }
})
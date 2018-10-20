var util = require('../../utils/util.js')
var config = require('../../config')

var acties = []

Page({
  data:{
    activitiesArray: []
  },
  onReachBottom: function(){
    console.log("shangla")
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
    console.log(e);
    wx.navigateTo({
      url: "../viewUserInfo/viewUserInfo?id=2"
    })
  },

  tapActivity: function(e){
    console.log()
    var uid = wx.getStorageSync('openid')
    if(uid == ""){
      util.showModel('请先登录', '刷新失败')
    }
    console.log(uid)
    wx.request({
      url: `${config.service.host}/weapp/joinActivity`,
      data:{
        uid: uid,
        aid: e.currentTarget.dataset.aid
      },
      success(result) {
        console.log(result)
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
    console.log(item)
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
    console.log(item.sportType)
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
      result += startDate.join('-')
    }
    else if (parseInt(startDate[1]) > nowMonth){
      result += startDate[1]
      result += '月'
      result += startDate[2]
      result += '日'
    }
    else{
      var dec = parseInt(startDate[2])-nowDay
      switch(dec){
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
          result += startTime[2];
          break;
      }
    }
    result += " ";
    result += startTimes[0];
    result += ':'
    result += startTimes[1];
    item.startTime = result;
  }
})
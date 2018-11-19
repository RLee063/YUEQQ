var util = require('../../utils/util.js')
var config = require('../../config')
var app = getApp()
var acties = []
var that

Page({
  data:{
    activitiesArray: [],
    recommendationActivities:[],
    recommendationUsers:[{},{},{},{},{},{}],
    criteriasTitle: ["排序类型","排序方式","活动类型"],
    criterias: [
      ["与我相关", "开始时间", "发起时间"],
      ["升序", "降序"],
      ["与我相关"]
    ],
    criteriaHidden: 1,
    criteriasMap:[
      [0,0,0], [0,0], [0,0,0,0,0,0]
    ],
    sportType:[]
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
    that.refreshRecommendActivities()
    that.refreshRecommendUsers()
    that.refreshActivities()
  },
  refreshRecommendActivities: function(){

  },
  refreshRecommendUsers: function(){
    wx.request({
      url: `${config.service.host}/weapp/getRecommendUsers`,
      data: {
        uid: wx.getStorageSync('openid')
      },
      success: result=>{
        console.log(result)
        var recommendationUsers = result.data.data
        recommendationUsers.push(recommendationUsers[0])
        recommendationUsers.push(recommendationUsers[0])
        recommendationUsers.push(recommendationUsers[0])
        that.setData({
          recommendationUsers: recommendationUsers
        })
      }
    })
  },
  refreshActivities: function(){
    var that = this
    wx.request({
      url: `${config.service.host}/weapp/pullRefresh`,
      success(result) {
        acties = result.data.data
        that.formatActivitiesArray(acties)
        console.log(acties)
        that.setData({
          activitiesArray: acties,
          recommendationActivities: acties.slice(0, 5)
        })
        wx.stopPullDownRefresh()
      },
      fail(error) {
        util.showModel('刷新失败', error);
      }
    })
  },
  onLoad: function(){
    that = this
    that.setData({
      sportType: app.globalData.sportType
    })
    this.refresh(this)
    this.initData()
  },
  onShow: function(){
  },
  initData: function(){
    var old = this.data.criterias[2]
    var nwe = old.concat(app.globalData.sportType)
    
    var criterias = this.data.criterias
    criterias[2] = nwe

    var criteriasMap = this.data.criteriasMap
    criteriasMap[0] = [1, 0, 0, 0, 0, 0, 0, 0]
    criteriasMap[1] = [1, 0, 0, 0, 0, 0, 0, 0]
    criteriasMap[2] = [1, 0, 0, 0, 0, 0, 0, 0]
    this.setData({
      criterias: criterias,
      criteriasMap: criteriasMap
    })
  },
  viewUserInfo: function(e){
    var uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: "../viewUserInfo/viewUserInfo?uid="+uid
    })
  },
  tapActivity: function(e){
    var aid = e.currentTarget.dataset.aid
    wx.navigateTo({
      // url: "../viewUserInfo/viewUserInfo?id=2"
      url: "../viewActivityInfo/viewActivityInfo?aid=" + aid
    })
  },
  formatActivitiesArray(acties){
    acties.forEach(this.formatEachActivity, this)
    acties.forEach(this.formatEachSportType, this)
    //var startTimeArray = startTime.split(' ');
  },
  formatEachSportType(item){
    console.log(that.data.sportType)
    for (var i = 0; i < that.data.sportType.length; i++) {
      if (item.sportType == that.data.sportType[i]) {
        item.sportType = i
      }
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
  hideShowCriteria: function(e){

    var criteriaHidden = (this.data.criteriaHidden+1)%2
    this.setData({
      criteriaHidden: criteriaHidden
    })
  },
  criteriaUniqueChoose: function(i1, i2){
    var criteriasMap = this.data.criteriasMap
    for(var i=0; i<criteriasMap[i1].length; i++){
      if(i!=i2){
        criteriasMap[i1][i] = 0
      }
      else{
        criteriasMap[i1][i] = 1
      }
    }
    this.setData({
      criteriasMap: criteriasMap
    })
    console.log(this.data)
  },
  criteriaMultipleChoose: function(i1, i2){
    var criteriasMap = this.data.criteriasMap
    criteriasMap[i1][i2] = (criteriasMap[i1][i2]+1)%2
    this.setData({
      criteriasMap: criteriasMap
    })
    console.log(this.data)
  },
  tapCriteria:function(e){
    var i1 = e.currentTarget.dataset.index
    var i2 = e.target.dataset.index
    if (i1 < 2) {
      this.criteriaUniqueChoose(i1, i2)
    }
    else {
      this.criteriaMultipleChoose(i1, i2)
    }
  },
  criteriaComfirm: function(){
    that.setData({
      criteriaHidden: 1
    })
    that.refreshActivities()
  },
  addActy: function(){
    wx.navigateTo({
      url: '../addActy/addActy',
    })
  }
})
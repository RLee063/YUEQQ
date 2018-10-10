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
    //var startTimeArray = startTime.split(' ');
  },
  formatEachActivity(item){
    var startTime = item.startTime.split(' ')
    var date = startTime[0].split('-')
  }
})
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
    wx.request({
      url: `${config.service.host}/weapp/pullRefresh`,
      success(result) {
        console.log(result)
        acties = result.data
        console.log(result.data)
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
  }
})
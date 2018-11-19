// client/pages/displayActivities/displayActivities.js
var config = require('../../config')
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activitiesArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid
    if(options){
      var dataString = options.dataString
      var data = JSON.parse(dataString)
      uid = data.uid
    }
    that = this
    wx.request({
      url: `${config.service.host}/weapp/getMyActivities`,
      data: {
        uid: uid
      },
      success(result){
        console.log(result)
        that.setData({
          activitiesArray: result.data.data.activities
        })
      },
      fail(error){

      }
    })
  },
  viewActivity: function(e){
    var aid = e.currentTarget.dataset.aid
    wx.navigateTo({
      // url: "../viewUserInfo/viewUserInfo?id=2"
      url: "../viewActivityInfo/viewActivityInfo?aid=" + aid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
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

  details: function() {
    wx.navigateTo({
      url: '../myActy/myActy',
    })
  },
  getActyInfo: function() {
    var that = this
    console.log("发送的uid是" + that.data.uid)
    wx.request({
      url: `${config.service.host}/weapp/getMyActivities`,
      method: 'GET',
      data: {
        uid: that.data.uid,
      },
      success(result) {
        console.log(result)
        that.setData({
          newActyInfo: result.data.data.createdActivities
        })
        console.log(that.data.newActyInfo)
        that.formatInfo()
        console.log(that.data.newActyInfo)

      },
      fail(error) {
        util.showModel('查看活动列表失败', error);
      }
    })
  },
  formatInfo: function() {
    var tempActyInfo = this.data.newActyInfo
    console.log(tempActyInfo.length)
    for (var i = 0; i < tempActyInfo.length; i++) {
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
    console.log(this.data.newActyInfo)
    console.log(this.data.newActyInfo)
    console.log(this.data.newActyInfo)
    console.log(this.data.newActyInfo)
    console.log(this.data.newActyInfo)
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      uid: options.uid
    })

    this.getActyInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
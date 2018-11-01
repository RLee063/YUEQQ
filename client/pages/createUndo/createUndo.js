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
    activityinfo: {
      num1: {
        name: "求求你揍我吧",
        time: '2018-10-20',
        punm: 4,
      },
      num2: {
        name: "好的揍你",
        time: '2018-10-21',
        punm: 6,
      }
    }

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
    for (var i = 0; i < this.data.newActyInfo.length; i++) {
      this.data.newActyInfo[i].startTime.slice(0, this.data.newActyInfo.startTime.length-4)
    }
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
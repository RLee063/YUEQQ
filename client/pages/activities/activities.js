// pages/activities/activities.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homePicUrl: "./background.jpg",
    userInfo: {},
    logged: true,
  },

  
  create_undo: function() {
    wx.navigateTo({
      url: '../create_undo/create_undo?uid=' + this.data.userInfo.uid,
    })
  },

  create_did: function() {
    wx.navigateTo({
      url: '../create_did/create_did?uid=' + this.data.userInfo.uid,
    })
  },
  attend_undo: function() {
    wx.navigateTo({
      url: '../attend_undo/attend_undo?uid=' + this.data.userInfo.uid,
    })
  },

  attend_did: function() {
    wx.navigateTo({
      url: '../attend_did/attend_did?uid=' + this.data.userInfo.uid,
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("接收到的参数是testData=" + options.info);
    if (options.info == null) {
      wx.showToast({
        title: '数据为空',
      })
      return;
    }

    var Info = JSON.parse(options.info);
    this.setData({
      userInfo: Info
    })
    console.log(this.data.userInfo)

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
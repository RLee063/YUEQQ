// pages/info/info.js
var imgTempPath = ""


Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:null,
    imgTempPath: 'background.jpg',
    userInfo: {},
    phone: null,
    grade: null,
    motto: 'In god we trust',
    collage: null,
    credit:4
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
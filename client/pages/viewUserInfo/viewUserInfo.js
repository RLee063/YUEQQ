// pages/viewUserInfo/viewUserInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = options.uid
    var that = this
    wx.request({
      url: `${config.service.host}/weapp/getUserInfo`,
      data: {
        uid: uid
      },
      success(result){
        console.log(result.data.data[0])
        result.data.data[0].homePicUrl = "https://uestc0510-1257207887.cos.ap-chengdu.myqcloud.com/1541071318751-ngRXTme7y.png"
        that.setData({
          userInfo: result.data.data[0]
        })
      },
      fail(error){
        console.log(error)
      }
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
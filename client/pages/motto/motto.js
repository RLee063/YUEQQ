// pages/motto/motto.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto:'',
    changemotto:0,
    userinput:0,
  },

  bindWordLimit: function (e) {
    this.setData({ userinput: 30-e.detail.value.length})
  },

  submit:function(e){
    this.setData({ motto: e.detail.value})
    wx.setStorageSync('newmotto', this.data.motto);
    wx.setStorageSync('changemotto',1);
    console.log(wx.getStorageSync('newmotto'))
    

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ motto: wx.getStorageSync('motto') })
    this.setData({ userinput: wx.getStorageSync('count')})
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
// pages/motto/motto.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '',
    changemotto: 0,
    userinput: 0,
  },

  bindWordLimit: function(e) {
    this.setData({
      userinput: 30 - e.detail.value.length
    })
  },

  submit: function(e) {
    this.setData({
      motto: e.detail.value
    })
    wx.setStorageSync('newmotto', this.data.motto);
    wx.setStorageSync('changemotto', 1);
    console.log(wx.getStorageSync('newmotto'))


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      motto: wx.getStorageSync('motto')
    })
    this.setData({
      userinput: wx.getStorageSync('count')
    })
  },

})
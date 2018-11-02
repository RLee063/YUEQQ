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
    var that = this
    wx.request({
      url: `${config.service.host}/weapp/updateUserInfo`,
      method: 'GET',
      data: {
        uid: that.data.openId,
        motto: that.data.motto,
      },
      success(result) {
        util.showSuccess('成功保存数据')
      },
      fail(error) {
        util.showModel('保存失败', error);
      }
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
// pages/activities/activities.js
var util = require('../../utils/util.js')
var config = require('../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    homePicUrl: "https://uestc0510-1257207887.cos.ap-chengdu.myqcloud.com/1543237069447-mHdJscD5W.png",
    userInfo: {},
    logged: true,
  },


  create_undo: function() {
    console.log(this.data.userInfo.uid)
    wx.navigateTo({
      url: '../createUndo/createUndo?uid=' + this.data.userInfo.uid,
    })
  },

  create_did: function() {
    wx.navigateTo({
      url: '../createDid/createDid?uid=' + this.data.userInfo.uid,
    })
  },
  attend_undo: function() {
    wx.navigateTo({
      url: '../attendUndo/attendUndo?uid=' + this.data.userInfo.uid,
    })
  },

  attend_did: function() {
    wx.navigateTo({
      url: '../attendDid/attendDid?uid=' + this.data.userInfo.uid,
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      openId: wx.getStorageSync('openid'),
    })

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
    var that = this
    wx.request({
      url: `${config.service.host}/weapp/getUserInfo`,
      method: 'GET',
      data: {
        uid: that.data.openId,
      },
      success(result) {
        console.log(result.data.data)
        that.setData({
          userInfo: result.data.data[0]
        })
      },
      fail(error) {
        util.showModel('保存失败', error);
      }
    })
    var pic
    if (this.data.userInfo.homePicUrl != "undefined") {
      pic = this.data.userInfo.homePicUrl
      this.setData({
        homePicUrl: pic
      })
    } else {
      this.setData({
        changemotto: wx.getStorageSync('changemotto')
      })
      if (this.data.changemotto == 1) {
        this.setData({
          motto: wx.getStorageSync('newmotto')
        })
      }
      this.setData({
        changebkgd: wx.getStorageSync('changebkgd')
      })
      if (this.data.changebkgd == 1) {
        this.setData({
          homePicUrl: wx.getStorageSync('bkgdpic')
        })
      }
    }
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
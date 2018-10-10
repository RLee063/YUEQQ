// pages/info/info.js
var util = require('../../utils/util.js')
var config = require('../../config')
var homePicUrl = ""


Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    flag: true,
    changebkgd: 0,
    homePicUrl: "https://qcloudtest-1257207887.cos.ap-guangzhou.myqcloud.com/1536468704720-MUpMq2yU3.jpg",
    credit: 2,
    creditarray: [1, 2, 3, 4, 5],
    sex: 1,
    logged: false,
    userInfo: {},
    phone: null,
    grade: null,
    motto: '',
    changemotto: 0,
    college: null,
    hiddenmodalput: true,
    actionSheetHidden: true,
    hiddenmodalput2: true,
    actionSheetHidden2: true,
  },

  show: function() {
    this.setData({
      flag: false
    })
  },

  changebackground: function(e) {
    wx.navigateTo({
      url: 'changebkgd/changebkgd',
    })
  },

  scoreinfo: function() {
    wx.navigateTo({
      url: '../scoreinfo/scoreinfo',
    })
  },

  getphone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },



  addphone: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮
  cancelphone: function() {
    this.setData({
      phone: null,
      hiddenmodalput: true,
    });
  },
  //确认
  confirmphone: function() {
    this.setData({
      hiddenmodalput: true
    })

  },


  addcollege: function() {
    this.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

  listenerActionSheet: function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  setcollege: function(event) {
    this.setData({
      college: event.currentTarget.dataset.name,
      actionSheetHidden: !this.data.actionSheetHidden
    })

  },


  addgrade: function() {
    this.setData({
      //取反
      actionSheetHidden2: !this.data.actionSheetHidden2
    });
  },

  listenerActionSheet2: function() {
    this.setData({
      actionSheetHidden2: !this.data.actionSheetHidden2
    })
  },

  setgrade: function(event) {
    this.setData({
      grade: event.currentTarget.dataset.grade,
      actionSheetHidden2: !this.data.actionSheetHidden2
    })

  },

  addmotto: function() {
    console.log(this.data.motto.length)
    wx.setStorageSync('motto', this.data.motto);
    wx.setStorageSync('count', this.data.motto.length);
    wx.navigateTo({
      url: '../motto/motto',
    })
  },

  saveinfo: function() {
    wx.request({
      url: `${config.service.host}/weapp/updateUserInfo`,
      method: 'GET',
      data: {
        uid: this.data.openId,
        homePicUrl: this.data.homePicUrl,
        score: this.data.score,
        phone: this.data.phone,
        motto: this.data.motto,
        grade: this.data.grade,
        college: this.data.college,
      },
      success(result) {
        util.showSuccess('成功保存数据')

      },
      fail(error) {
        util.showModel('保存失败', error);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.setData({
      logged: wx.getStorageSync('logged')
    })
    this.setData({
      openId: wx.getStorageSync('openid')
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
    wx.request({
      url: `${config.service.host}/weapp/getUserInfo`,
      method: 'GET',
      data: {
        uid: this.data.openId,

      },
      success(result) {
        console.log(result);
      },
      fail(error) {
        util.showModel('保存失败', error);
      }
    })
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

    

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

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
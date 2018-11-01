// pages/info/info.js
var util = require('../../utils/util.js')
var config = require('../../config')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    college: '',
    sex: 1,
    logged: false,
    phone: '',
    grade: '',
    motto: '',
    homePicUrl: "https://qcloudtest-1257207887.cos.ap-guangzhou.myqcloud.com/1536468704720-MUpMq2yU3.jpg",
    creditstar: 5,
    creditarray: [1, 2, 3, 4, 5],
    flag: true,
    changebkgd: 0,
    changemotto: 0,
    userInfo: {},
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
      url: '../scoreInfo/scoreInfo',
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
    console.log(this.data)
    wx.request({
      url: `${config.service.host}/weapp/updateUserInfo`,
      method: 'GET',
      data: {
        uid: this.data.openId,
        homePicUrl: this.data.homePicUrl,
        credit: this.data.creditstar,
        phone: this.data.phone,
        motto: this.data.motto,
        grade: this.data.grade,
        college: this.data.college,
      },
      success(result) {
        wx.switchTab({
          url: '../user/user',
        })
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
      userInfo: wx.getStorageSync('userInfo'),
      openId: wx.getStorageSync('openid'),
      logged: wx.getStorageSync('logged')
    })

  },

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
          college: result.data.data[0].college,
          credit: result.data.data[0].credit,
          phone: result.data.data[0].phone,
          grade: result.data.data[0].grade,
          motto: result.data.data[0].motto,
        })

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

})
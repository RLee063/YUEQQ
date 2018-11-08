// pages/create_undo/create_undo.js
var util = require('../../utils/util.js')
var config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    joinerUid: [{
        uid: 'o5ko345psK6ukVyP1VXNzFGMDWEs'
      },
      {
        uid: 'o5ko344qvKlQYv5kYMdTkWbkH8lg'
      }
    ],
    joinerInfo: [],
    t: []

  },

  details: function(e) {

    var uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: "../viewUserInfo/viewUserInfo?uid=" + uid
    })
  },
  getJoinerInfo: function() {
    var newGetUserInfo = []
    var that = this
    for (var i = 0; i < that.data.joinerUid.length; i++) {
      wx.request({
        url: `${config.service.host}/weapp/getUserInfo`,
        method: 'GET',
        data: {
          uid: that.data.joinerUid[i].uid,
        },
        success(result) {
          newGetUserInfo.push(result.data.data[i])
          that.setData({
            joinerInfo: newGetUserInfo
          })
        },
        fail(error) {
          util.showModel('查看参与者列表失败', error);
        }
      })
    }
    console.log(that.data)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /*this.setData({
      joinerUid: JSON.parse(options.members)
    })*/
    console.log(this.data.joinerUid)
    this.getJoinerInfo()
  },


})
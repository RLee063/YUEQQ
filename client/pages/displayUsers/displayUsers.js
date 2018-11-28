var that = this
var util = require("../../utils/util.js")
var config = require('../../config')

Page({
  data: {
    usersArray: []
  },
//粉丝；关注

  onLoad: function(options) {
    that = this
    this.setData({
      myUid: wx.getStorageSync('openid')
    })
    if(options){
      var data = JSON.parse(options.dataString)
      if(data.aid){
        var aInfoP = util.getActivityInfo(data.aid)
        aInfoP.then(result => {
          console.log(result)
          that.setData({
            usersArray : result.members
          })
          that.checkoutFollow()
        })
      }
      if(data.uid){
        if(data.type==0){
          wx.request({
            url: `${config.service.host}/weapp/getFollowings`,
            data: {
              uid: data.uid
            },
            success(result) {
              that.setData({
                usersArray: result.data.followers
              })
            }
          })
        }
        if(data.type==1){
          console.log(data.uid)
          wx.request({
            url: `${config.service.host}/weapp/getFollowers`,
            data: {
              uid: data.uid
            },
            success(result) {
              console.log(result)
              that.setData({
                usersArray: result.data.followers
              })
            }
          })
        }
      }
    }
    that.checkoutFollow()
  },
  checkoutFollow: function(){
    wx.request({
      url: `${config.service.host}/weapp/getFollowings`,
      data: {
        uid: wx.getStorageSync('openid')
      },
      success(result) {
        var usersArray = that.data.usersArray
        var followings = result.data.followers
        for(var i=0; i<usersArray.length; i++){
          usersArray[i].followed = 0
          for(var j=0; j<followings.length; j++){
            if(followings[j].uid == usersArray[i].uid){
              usersArray[i].followed = 1
              break;
            }
          }
        }
        that.setData({
          usersArray: usersArray
        })
      }
    })
  },
  follow: function(e) {
    console.log(e.currentTarget.dataset.uid)
    var followed = that.data.usersArray[e.currentTarget.dataset.index].followed
    if(!followed){
      wx.request({
        url: `${config.service.host}/weapp/follow`,
        data: {
          fromUid: wx.getStorageSync('openid'),
          toUid: e.currentTarget.dataset.uid
        },
        success(result){
          that.data.usersArray[e.currentTarget.dataset.index].followed = 1
          that.setData({
            usersArray: that.data.usersArray
          })
        }
      })
    }
    else{
      wx.request({
        url: `${config.service.host}/weapp/unfollow`,
        data: {
          fromUid: wx.getStorageSync('openid'),
          toUid: e.currentTarget.dataset.uid
        },
        success(result) {
          that.data.usersArray[e.currentTarget.dataset.index].followed = 0
          that.setData({
            usersArray: that.data.usersArray
          })
        }
      })
    }
  },
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
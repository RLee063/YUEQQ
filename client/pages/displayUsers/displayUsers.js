var that = this
var util = require("../../utils/util.js")
var config = require('../../config')

Page({
  data: {
    usersArray: [{
      age: 0,
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erV2px9QVSr6vF2KMHm5kUgeATsZ3ERtMeia4tKibXK21OjEADgtY8ibk57JdYLCTTHDl20jaF9q3uew/132",
      badminton: 0,
      basketBall: 0,
      college: "计算机科学与技术学院",
      credit: -1,
      grade: "null",
      homePicUrl: "",
      motto: "白金之星，世界！",
      nickName: "江流水涌",
      phone: "null",
      pingpong: 0,
      running: 0,
      sex: "1",
      soccer: 0,
      tennis: 0,
      uid: "o5ko344qvKlQYv5kYMdTkWbkH8lg"
    }]
  },
//粉丝；关注

  onLoad: function(options) {
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
              uid: wx.getStorageSync('openid')
            },
            success(result) {
              console.log(result)
            }
          })
        }
        if(data.type==1){
          wx.request({
            url: `${config.service.host}/weapp/getFollowers`,
            data: {
              uid: wx.getStorageSync('openid')
            },
            success(result) {
              console.log(result)
            }
          })
        }
      }
    }

    that = this
    for(var i=0; i<that.data.usersArray.length; i++){
      that.data.usersArray[i].followed = 1
    }
    that.setData({
      usersArray: that.data.usersArray
    })
  },
  checkoutFollow: function(){
    wx.request({
      url: `${config.service.host}/weapp/getFollowings`,
      data: {
        uid: wx.getStorageSync('openid')
      },
      success(result) {
        console.log(result)
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
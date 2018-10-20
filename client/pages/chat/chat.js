// client/pages/chat/chat.js
var app = getApp();
var messageGetor;
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    messageArray:[],
    otherUid: [],
    oppositeUid: "",
    messageText: "",
  },

  sendMessage: function(e) {
    if (this.tunnel && this.tunnel.isActive()) {
      if(e.detail.value.messageText==""){
        return
      }
      // 使用信道给服务器推送「speak」消息
      var msg = e.detail.value.messageText
      var myUid = wx.getStorageSync('openid')
      var otherUid = this.data.otherUid
      this.tunnel.emit('speak', {
        'word': {
          'to': oppositeUid,
          'from': myUid,
          'msg': msg
        },
      })

      this.setData({
        messageText: ""
      })

      var message = {}
      var myInfo = wx.getStorageSync('me')
      message.avatarUrl = '../../images/user1.jpg'
      message.userType = 0
      message.messageText = msg
      
      var key = "message"+this.data.oppositeUid
      var messageArray = wx.getStorageSync(key)
      messageArray.push(message)
      wx.setStorageSync(key, messageArray)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      oppositeUid: options.uid
    })
    this.tunnel = app.tunnel;
    messageGetor = setInterval(this.getMessage, 500)
    this.getMessage()
  },

  getMessage(){
    var key = "message" + this.data.oppositeUid
    var messageArray = wx.getStorageSync(key);
    this.setData({
      messageArray: messageArray
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
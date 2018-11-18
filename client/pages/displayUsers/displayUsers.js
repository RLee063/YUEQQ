// client/pages/displayUsers/displayUsers.js
var that = this

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
    that = this
    for(var i=0; i<that.data.usersArray.length; i++){
      that.data.usersArray[i].followed = 1
    }
    that.setData({
      usersArray: that.data.usersArray
    })
  },
  follow: function(e) {
    that.data.usersArray[e.currentTarget.dataset.index].followed = (that.data.usersArray[e.currentTarget.dataset.index].followed+1)%2
    that.setData({
      usersArray: that.data.usersArray
    })
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
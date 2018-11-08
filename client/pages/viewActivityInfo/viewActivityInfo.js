// client/pages/viewActivityInfo/viewActivityInfo.js
var util = require('../../utils/util.js')
var config = require('../../config')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    membersArray: [],
    activityInfo: {},
    members: 3,
    creatorUid: '',
    creator: {
      avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/yOHWFZpCZyiakD3dSFAe9Yn93KMzxHAMzSPiaAWcXqAhUNKOoy9NN78EG7oX0qHD7EDxBapgyjHNECF8qq3Qvvhw/132',
      name: 'NightCall',
    },
    joiner: [{
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/yOHWFZpCZyiakD3dSFAe9Yn93KMzxHAMzSPiaAWcXqAhUNKOoy9NN78EG7oX0qHD7EDxBapgyjHNECF8qq3Qvvhw/132'
      },
      {
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/yOHWFZpCZyiakD3dSFAe9Yn93KMzxHAMzSPiaAWcXqAhUNKOoy9NN78EG7oX0qHD7EDxBapgyjHNECF8qq3Qvvhw/132'
      },
      {
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/yOHWFZpCZyiakD3dSFAe9Yn93KMzxHAMzSPiaAWcXqAhUNKOoy9NN78EG7oX0qHD7EDxBapgyjHNECF8qq3Qvvhw/132'
      },
    ]

  },
  formatInfo: function() {
    var tempActyInfo = this.data.activityInfo
    console.log(this.data.activityInfo)

    switch (tempActyInfo.sportType) {
      case '乒乓球':
        tempActyInfo.sportType = 0
        break

      case '篮球':
        tempActyInfo.sportType = 1
        break
      case '网球':
        tempActyInfo.sportType = 2
        break
      case '羽毛球':
        tempActyInfo.sportType = 3
        break
      case '足球':
        tempActyInfo.sportType = 4
        break
      case '跑步':
        tempActyInfo.sportType = 5
        break
    }
    this.setData({
      activityInfo: tempActyInfo
    })
  },

  getCreaterInfo: function() {
    var that = this
    wx.request({
      url: `${config.service.host}/weapp/getUserInfo`,
      method: 'GET',
      data: {
        uid: that.data.creatorUid,
      },

      success(result) {
        that.setData({
          creator: result.data.data[0]

        })
        console.log(that.data.creator)
      },
      fail: function(error) {
        console.log(error)
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var aid = options.aid
    var that = this
    wx.request({
      url: `${config.service.host}/weapp/pullRefresh`,
      data: {
        aid: aid
      },
      success: function(result) {

        that.setData({
          activityInfo: result.data.data[0],
          creatorUid: result.data.data[0].creatorUid
        })
        that.formatInfo()
        that.getCreaterInfo()

      },
      fail: function(error) {
        console.log(error)
      }
    })
  },

  joinActivity: function() {
    var uid = wx.getStorageSync('openid')
    if (uid == "") {
      util.showModel('请先登录', '刷新失败')
    }
    var that = this
    wx.request({
      url: `${config.service.host}/weapp/joinActivity`,
      data: {
        uid: uid,
        aid: this.data.activityInfo.chatId
      },
      success(result) {
        if (result.data.code == 1) {
          util.showModel('加入成功', "");
        }
        that.navigateToChat()
      },
      fail(error) {
        util.showModel('加入失败', error);
      }
    })
  },
  navigateToChat: function() {
    var activityInfo = this.data.activityInfo
    var chatListRaw = app.getArrayFromStorage('chatListRaw')
    var chatId = this.data.activityInfo.chatId
    var chat = {
      chatId: chatId,
      statusChanged: true,
      newMessage: true,
      unReaded: true,
      messageArray: []
    }
    for (var i = 0; i < chatListRaw.length; i++) {
      if (chatListRaw[i].chatId == chatId) {
        chat.messageArray = chatListRaw[i].messageArray
        chatListRaw.splice(i, 1)
        break
      }
    }
    var message = {}
    message.uid = "systemUid"
    message.messageText = "你已经加入活动拉！快和其他人聊聊吧！"
    message.userType = 1
    chat.messageArray.push(message)
    chatListRaw.unshift(chat)
    wx.setStorageSync('chatListRaw', chatListRaw)

    var chatRoomInfo = {
      avatarUrl: activityInfo.picUrl,
      nickName: activityInfo.title
    }
    wx.setStorageSync(chatId, chatRoomInfo)
    wx.navigateTo({
      url: '../chat/chat?chatId=' + this.data.activityInfo.chatId
    })
  },
  viewCreator: function() {
    wx.navigateTo({
      url: '../viewUserInfo/viewUserInfo?uId=' + this.data.activityInfo.creatorUid
    })
  },
  joinerlist: function() {
    var members = JSON.stringify(this.data.activityInfo.members)
    wx.navigateTo({
      url: '../joinerlist/joinerlist?members=' + members
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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

// {
//   aid: "o5ko344qvKlQYv5kYMdTkWbkH8lg1540884647",
//     avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erV2px9QVSr6vF2KMHm5kUgeATsZ3ERtMeia4tKibXK21OjEADgtY8ibk57JdYLCTTHDl20jaF9q3uew/132",
//       createTime: "2018-10-30 15:30:46",
//         creatorUid: "o5ko344qvKlQYv5kYMdTkWbkH8lg",
//           currentNum: 1,
//             index: 0,
//               maxNum: 6,
//                 members: [],
//                   picUrl: "https://qcloudtest-1257207887.cos.ap-guangzhou.myqcloud.com/1536468704720-MUpMq2yU3.jpg",
//                     sportType: 1,
//                       startTime: "11月30日 12:00",
//                         tags: [],
//                           title: "你宅你🐎呢",
//                             sportType: "羽毛球",
//                               uid: "o5ko344qvKlQYv5kYMdTkWbkH8lg",
//                                 chatId: "cho5ko344qvKlQYv5kYMdTkWbkH8lg"
// }

// {
//   avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erV2px9QVSr6vF2KMHm5kUgeATsZ3ERtMeia4tKibXK21OjEADgtY8ibk57JdYLCTTHDl20jaF9q3uew/132",
//     uid: "1"
// }, {
//   avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/yOHWFZpCZyiakD3dSFAe9Yn93KMzxHAMzSPiaAWcXqAhUNKOoy9NN78EG7oX0qHD7EDxBapgyjHNECF8qq3Qvvhw/132",
//     uid: "2"
// }, {
//   avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/BOj3yAxywFH5my2YicsOtmJUCzXbKsba0olTEsutBOnGXOLWsNYxHiaJYFuJIKR3O8hUxtqybbWiahn8NC2ib9AqlQ/132",
//     uid: "3"
// }
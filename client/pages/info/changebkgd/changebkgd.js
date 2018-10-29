import WeCropper from 'we-cropper-master/dist/we-cropper.js'
var util = require('../../../utils/util.js')
var config = require('../../../config')

const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight - 20



Page({
  data: {
    bkgdpic: '',
    cropperOpt: {
      id: 'cropper',
      width, // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 400) / 2, // 裁剪框x轴起点
        y: (height - 200) / 2, // 裁剪框y轴起点
        width: 400, // 裁剪框宽度
        height: 200 // 裁剪框高度
      }
    }
  },

  onLoad(option) {
    const {
      cropperOpt
    } = this.data

    // 若同一个页面只有一个裁剪容器，在其它Page方法中可通过this.wecropper访问实例
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context: ${ctx}`)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context: ${ctx}`)
        wx.hideToast()
      })

  },

  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },

  chooseimage: function() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]

        self.wecropper.pushOrign(src)
      }
    })
  },

  getCropperImage() {
    var that = this;
    that.wecropper.getCropperImage((src) => {
      if (src) {
        that.setData({
          bkgdpic: src
        })
        that.upLoadImgAndGetUrl(this)
        wx.navigateBack()

      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  upLoadImgAndGetUrl: function(that) {
    console.log("更改后的图片路径："+that.data.bkgdpic)
    util.showBusy('正在上传')
    wx.uploadFile({
      url: config.service.uploadUrl,
      filePath: that.data.bkgdpic,
      name: 'file',
      success: function(res) {
        util.showSuccess('上传图片成功')
        res = JSON.parse(res.data)
        console.log(res)
        console.log(res)
        console.log(res)
        console.log(res.imgUrl)
        console.log(res.imgUrl)
        console.log(res.imgUrl)
        console.log(res.imgUrl)
        console.log(res.imgUrl)
        console.log(res.imgUrl)
       
        that.setData({
          bkgdpic: res.data.imgUrl
        })
        wx.setStorageSync('bkgdpic', that.data.bkgdpic);
        wx.setStorageSync('changebkgd', 1);
        console.log(that.data)
        that.uploadInfo(res.data.imgUrl, that)
      },

      fail: function(e) {
        util.showModel('上传图片失败')
        return null
      }
    })
  },

  uploadInfo: function(imgUrl, that) {
    if (imgUrl == null) {
      console.log(imgUrl)
      wx.showToast({
        title: 'imgUrl == null',
        icon: "none"
      })
      return
    }
    wx.checkSession({
      success: function(res) {
        console.log(res)
        wx.request({
          url: `${config.service.host}/weapp/updateUserInfo`,
          method: 'GET',
          data: {
            homePicUrl: that.data.bkgdpic
          },
          success(result) {
            util.showSuccess('成功上传图片')
          },
          fail(error) {
            util.showModel('请求失败', error);
          }
        })
      },
      fail: function(res) {
        util.showModel('请先登录', '在帮助中先授权再登录');
      }
    })
  }

})
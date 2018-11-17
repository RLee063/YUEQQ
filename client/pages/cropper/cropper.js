import WeCropper from 'we-cropper-master/dist/we-cropper.js'
var util = require('../../utils/util.js')
var config = require('../../config')

var pages;
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
    pages = getCurrentPages()
    const {
      cropperOpt
    } = this.data

    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context: ${ctx}`)
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context: ${ctx}`)
      })
    this.chooseImage()
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
  chooseImage: function () {
    const self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
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
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  upLoadImgAndGetUrl: function (that) {
    util.showBusy('正在上传')
    wx.uploadFile({
      url: config.service.uploadUrl,
      filePath: that.data.bkgdpic,
      name: 'file',
      success: function (res) {
        util.showSuccess('上传图片成功')
        res = JSON.parse(res.data)
        console.log(pages)
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
          imgTempPath: res.data.imgUrl
        })
        
        wx.navigateBack({
          delta: 1
        })
      },

      fail: function (e) {
        util.showModel('上传图片失败')
        return null
      }
    })
  },
})
//获取应用实例
var app = getApp();
Page({
  data: {
    sayHi: "咻咻咻的猪"
  },
  onLoad: function () {
    setTimeout(function () {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }, 3000)
  }
});
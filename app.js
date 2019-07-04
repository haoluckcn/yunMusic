// 前后台切换时触发的函数，初始化时，启动时，发生错误时，比如脚本错误，api调用失败时触发什么函数
// 也可以设置全局变量，然后在其他页面对应的js文件中通过下面的方式来获取到里面定义的全局变量。
// 比如var app = getApp();  var globalData = app.globalData
//app.js
App({
  onLaunch: function () {
    // console.log('onLaunch监听小程序初始化');
    const that = this;
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function () {
            that.goStartIndexPage()
          }
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    });
      wx.redirectTo({
        url: "/pages/welcome/welcome"
      })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
      fail: err => {
        console.log(err, '登录失败')
      }
    })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res,'用户信息')
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      },
      fail: err => {
        console.log(err,'获取失败')
      }
    })
  },
  onShow: function () {
    // console.log('onShow监听小程序显示');
  },
  onHide: function () {
    // console.log('onLaunch监听小程序隐藏');
  },
  onError: function () {
    // console.log('onError监听小程序发生脚本错误，或者 api 调用失败时触发');
  },
  globalData: {
    userInfo: null,
    songId: [],
    songImg: [],
    waitForPlaying: [],
    songName: []
  }
})
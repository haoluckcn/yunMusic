const app = getApp();
Page({
  data: {
    img: [],
    nickName: [],
    hidden: app.globalData.userConnect,
    historyId: []
  },
  onShow: function () {
    var historyId = wx.getStorageSync('historyId');
    console.log(history);
    this.setData({
      hidden: true,
      historyId
    })
    console.log(this.historyId)
  },
  onGotUserInfo: function (e) {
    console.log(e)
    this.setData({
      hidden: false
    })
    let that = this;
    // 获取用户信息
    wx.login({
      success: function (res) {
        console.log(res, 'login')
        wx.getUserInfo({
          success: function (res) {
            console.log(res, 'getUser')
            app.globalData.userInfo = res.userInfo
            app.globalData.userConnect = true
            that.setData({
              img: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName
            })
          }
        })
      }
    })
  },
  onQuestion: function () {
    wx.showModal({
      title: '开通黑卡',
      content: '有钱的用不上，没钱的买不起',
      cancelText: '很对',
      cancelColor: '#333',
      confirmText: '特别对',
      confirmColor: '#999',
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            title: '特别对'
          })
        } else {
          wx.showToast({
            title: '很对'
          })
        }
      }
    })
  }
})
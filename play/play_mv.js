const API_BASE_URL = 'http://neteasecloudmusicapi.zhaoboy.com';
const app = getApp();
Page({
  data: {
    mv: [],
    autoplay: true,
    loop: true,
    showfullscreenbtn: true,
    showcenterplaybtn: true,
    enableprogressgesture: true,
    showmutebtn: true,
    objectfit: 'contain'
  },
  onLoad: function (options) {
    console.log(options, 'mv')
    const mvid = options.id;
    wx.request({
      url: API_BASE_URL + '/mv/detail',
      data: {
        mvid
      },
      success: res => {
        console.log(res, '请求mv详情')
        if (res.data.data.brs === null) {
          wx.showModal({
            content: '服务器开了点小差~~',
            cancelColor: '#de655c',
            confirmColor: '#de655c',
            showCancel: false,
            confirmText: '返回',
            complete() {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          })
        } else {
          this.setData({
            mv: res.data.data
          })
        }
      }
    })
  }
})
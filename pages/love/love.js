const API_BASE_URL = 'http://neteasecloudmusicapi.zhaoboy.com'
const app = getApp();

Page({
  data: {
    isPlay: '',
    song: [],
    innerAudioContext: {},
    show: true,
    showLyric: true,
    songid: []
  },

  // onLoad，第一次进入则获取到index.js传来的歌曲id--> id传给wx.request的URL，获取到歌曲详情

  onShow: function () { // onShow 监听页面显示
    const audioId = app.globalData.songId; // 从全局变量中获取
    const innerAudioContext = wx.createAudioContext();
    this.setData({
      innerAudioContext,
      isPlay: true
    })

    //请求歌曲音频的地址，成功则传值给createBgAudio 后台播放管理器，让后台播放
    wx.request({
      url: API_BASE_URL + '/song/url',
      data: {
        id: audioId
      },

    })
  }
})
const API_BASE_URL = 'http://neteasecloudmusicapi.zhaoboy.com';
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
  // onLoad，第一次进入则获取到index.js传来的歌曲id--> id传给wx.request 的 URL，获取到歌曲详情
  onLoad: function (options) {
    const audioid = options.id;
    let isPush = true
    if (audioid) {
      app.globalData.waitForPlaying.map(item => {
        if (item === audioid) {
          isPush = false
        }
      })
      if (isPush) {
        app.globalData.waitForPlaying.push(audioid)
      }
    }
    this.play(audioid)
  },
  play: function (audioid) {
    const audioId = audioid;
    app.globalData.songId = audioId;
    const innerAudioContext = wx.createInnerAudioContext();
    this.setData({
      innerAudioContext,
      isPlay: true
    })
    // 获取音频地址
    wx.request({
      url: API_BASE_URL + '/song/url',
      data: {
        id: audioId
      },
      success: res => {
        if (res.data.data[0].url === null) {
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
          this.createBgAudio(res.data.data[0])
        }
      }
    })
    // 获取音频信息
    wx.request({
      url: API_BASE_URL + '/song/detail',
      data: {
        ids: audioId
      },
      success: res => {
        if (res.data.songs.length === 0) {
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
            song: res.data.songs[0]
          })
          app.globalData.songName = res.data.songs[0].name;
        }
      }
    })
  },

  createBgAudio(res) {
    const bgAudioManage = wx.getBackgroundAudioManager(); //获取全局唯一的背景音频管理器
    app.globalData.bgAudioManage = bgAudioManage;
    bgAudioManage.title = 'title';
    bgAudioManage.src = res.url;
    console.log(app.globalData.songId, app.globalData.songName, '当前歌曲')
    const historySong = {
      id: app.globalData.songId,
      songName: app.globalData.songName
    }
    bgAudioManage.onPlay(res => {
      this.setData({
        isPlay: true
      })
    });

    bgAudioManage.onEnded(() => {
      this.go_lastSong();
    })

    wx.setStorageSync('songList', app.globalData.waitForPlaying);
  },
  // 播放和暂停
  handleToggleBGAudio() {
    const bgAudioManage = app.globalData.bgAudioManage;
    const {
      isPlay
    } = this.data;
    if (isPlay) {
      bgAudioManage.pause();
    } else {
      bgAudioManage.play();
    }
    this.setData({
      isPlay: !isPlay
    })
  },
  // 切换歌词和封面
  showLyric() {
    const {
      showLyric
    } = this.data;
    this.setData({
      showLyric: !showLyric
    })
  },
  go_index: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  go_lastSong: function () {
    // const lastSongId = app.globalData.waitForPlaying;
    // const songId = lastSongId[Math.floor(Math.random() * lastSongId.length)]
    // this.data.songid = songId;
    // app.globalData.songId = songId;
    const songList = app.globalData.waitForPlaying;
    if (songList.length <= 1) return false;
    let songId = this.getSong(1, songList)
    this.play(songId)
  },
  go_prevSong: function () {
    const songList = app.globalData.waitForPlaying;
    if (songList.length <= 1) return false;
    let songId = this.getSong(-1, songList)
    this.play(songId)
  },
  getSong: function (n, songList) {
    const currentId = app.globalData.songId;
    let index;
    songList.forEach((item, i) => {
      if (item === currentId) {
        index = i
      }
    })
    if (n > 0) {
      index++
      if (index >= songList.length)
        index = 0
    } else {
      index--
      if (index < 0)
        index = songList.length - 1
    }
    const songId = songList[index]
    this.data.songid = songId;
    app.globalData.songId = songId;
    return songId;
  }
})
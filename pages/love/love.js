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
  }
})
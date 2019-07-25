const API = require('../../wxapi/api.js');
Page({
  data: {
    hotsongs: [], // 获取热门搜索
    inputVal: null, // 输入框输入的值
    history: [], // 搜索历史存放数组
    showView: true, // 组件显示与隐藏
    searchsuggest: [], // 搜索建议
    showsongresult: true,
    searchresult: [], // 搜索结果
    searchKey: []
  },
  onLoad() {
    wx.showLoading({
      title: '加载中'
    })
    this.gethotsongs();
  },
  onShow() {
    this.setData({
      history: wx.getStorageSync('history') || []
    })
  },
  // 获取热门歌曲
  gethotsongs: function () {
    API.gethotsongs({
      type: 'new'
    }).then(res => {
      wx.hideLoading()
      if (res.code === 200) {
        this.setData({
          hotsongs: res.result.hots
        })
      }
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  //点击取消，停止搜索，返回首页
  hideInput: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
    // this.setData({
    //   inputVal: "",
    //   inputShowed: false
    // });
  },
  // 点击输入框×时，清空输入的内容
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  // 输入框失去焦点时
  inputBlur: function (e) {
    let history = wx.getStorageSync('history') || []
    if (history.indexOf(e.detail.value) === -1) {
      history.push(this.data.searchKey)
    }
    wx.setStorageSync('history', history)
  },
  // 点击完成按钮时
  saerchOver: function (e) {
    this.setData({
      showsongresult: false
    })
    this.searchResult()
  },
  // 实时获取input
  inputTyping: function (e) {
    this.setData({
      searchKey: e.detail.value
    });
    if (e.detail.value != '') {
      this.setData({
        showView: false
      })
      this.searchSuggest()
    } else {
      this.setData({
        showView: true
      })
    }
  },
  // 搜索建议
  searchSuggest: function () {
    API.searchSuggest({
      keywords: this.data.searchKey,
      type: 'mobile'
    }).then(res => {
      if (res.code === 200) {
        this.setData({
          searchsuggest: res.result.allMatch
        })
      }
    })
  },
  // 点击历史记录或热门搜索赋值
  fill_value: function (e) {
    this.setData({
      inputShowed: true,
      searchKey: e.currentTarget.dataset.value,
      inputVal: e.currentTarget.dataset.value,
      showView: false,
      showsongresult: false
    })
    this.searchResult()
  },
  // 搜索结果
  searchResult: function () {
    API.searchResult({
      keywords: this.data.searchKey,
      type: 1,
      limit: 100,
      offset: 2
    }).then(res => {
      if (res.code === 200) {
        this.setData({
          searchresult: res.result.songs
        })
      }
    })
  },
  // 清空搜搜历史
  clearHistory: function () {
    const that = this;
    wx.showModal({
      content: '确认清空全部历史记录',
      cancelColor: '#DE655C',
      confirmColor: '#DE655C',
      success(res) {
        if (res.confirm) {
          that.setData({
            history: ''
          })
        }
        wx.setStorageSync("history", [])
      }
    })
  }
})
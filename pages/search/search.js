const API = require('../../wxapi/api.js');
Page({
  data: {
    hotsongs: [], // 获取热门搜索
    inputValue: null, // 输入框输入的值
    history: [], // 搜索历史存放数组
    searchsuggest: [], // 搜索建议
    showView: true, // 
    searchresult: [], // 搜索结果
    searchKey: []
  }
})
const app = getApp();
Page({
  data: {
    img: [],
    nickName:[],
    hidden:true,
    historyId:[]
  },
  onShow: function () {
    var historyId = wx.getStorageSync('historyId');
    console.log(history);
    this.setData({
      hidden: true,
      historyId
    })
    console.log(this.historyId)
  }
})
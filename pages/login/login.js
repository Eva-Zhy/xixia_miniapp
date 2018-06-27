// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:'',
    yzm:'',
    showPhone: true,
    showYzm: false
  },
  suerPhone: function() {
    console.log(this.data.phoneNumber);
    var that = this;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(this.data.phoneNumber)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式错误',
        success: function (res) {
          if (res.confirm) {
          } else {
          }
        }
      })
    } else {
      that.data.showPhone = false;
      that.data.showYzm = true;
      that.setData({
        showPhone: that.data.showPhone,
        showYzm: that.data.showYzm
      })
    } 

  },
  inputPhone: function (e) {
    this.data.phoneNumber = e.detail.value;
  },  
  inputYzm: function (e) {
    this.data.yzm = e.detail.value;
  },  
  suerYzm: function(e) {
    console.log(this.data.yzm);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
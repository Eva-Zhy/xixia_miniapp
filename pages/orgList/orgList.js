import { Config } from '../../utils/config.js';
Page({
  data: {
    orgId: 0,
    mUserId : 0,
    currentPage: 0,
    pageSize: 10,
    cameraList: [],
    orgList: []
  },
  onLoad: function (options) {
    console.log(options);
    var that = this;
    that.data.orgId = options.orgId;
    that.data.mUserId = options.mUserId;

    that._getOrg();
  },
  _getOrg: function(){
    var that = this;
    wx.request({
      url: Config.restUrl + '/service/resource/get_camera_orgs_by_parent',
      data: {
        masterOrgId: that.data.orgId,
        currentPage: that.data.currentPage,
        pageSize: that.data.pageSize,
        mUserId: that.data.mUserId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 200) {
          that.data.cameraList = res.data.data.cameraList;
          that.data.orgList = res.data.data.orgList;

          that.setData({
            cameraList: that.data.cameraList,
            orgList: that.data.orgList
          });
        } else {
          wx.showModal({
            title: '提示',
            content: '获取组织结构详情失败，请稍后再试！',
            success: function (res) {
              if (res.confirm) {
              } else {
              }
            }
          })
        }
      }
    })
  },
  _goPlayerView: function () {
    wx.navigateTo({
      url: '../player/player'
    })
  },
  _goOrgList: function (e) {
    console.log(e);
    var that = this;
    wx.navigateTo({
      url: '../orgList/orgList?orgId=' + e.currentTarget.dataset.id + '&mUserId=' + that.data.mUserId
    })
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
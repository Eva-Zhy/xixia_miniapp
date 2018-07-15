import {
  Config
} from '../../utils/config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    groupName: '',
    cameras: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("playerList");
    var that = this;
    that.data.id = options.id;
    that.data.groupName = options.groupName;
    that._getCamerasList(that.data.id, that.data.groupName);
  },
  _goPlayerView: function(e) {
    var that = this;
    if (e.currentTarget.dataset.type == 'camera') {
      wx.navigateTo({
        url: '../player/player?id=' + e.currentTarget.dataset.id
      })
    } else if (e.currentTarget.dataset.type == 'group') {
      wx.navigateTo({
        url: '../playerList/playerList?id=' + e.currentTarget.dataset.id + '&groupName=' + that.data.groupName + '&type=' + e.currentTarget.dataset.type
      })
    }


  },
  _getCamerasList: function(id, groupName) {
    var that = this;
    wx.request({
      url: Config.restUrl + '/service/video_access_copy/list_cameras',
      data: {
        isRoot: '1',
        id: id,
        type: 'customize',
        groupName: that.data.groupName
      },
      header: {
        'content-type': 'application/json',
        'cookie': wx.getStorageSync("sessionid")
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.code == 200) {
          that.data.cameras = res.data.data.cameras;
          that.setData({
            cameras: that.data.cameras
          });

          if (that.data.cameras.length == 0) {
            wx.showModal({
              title: '提示',
              content: '获取组织结构详情数据为空，返回上一级！',
              success: function(res) {
                if (res.confirm) {
                  wx.navigateBack();
                } else {
                  wx.navigateBack();
                }
              }
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '获取组织结构详情失败，请稍后再试！',
            success: function(res) {
              if (res.confirm) {} else {}
            }
          })
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
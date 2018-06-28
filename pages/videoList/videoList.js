var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
import { Config } from '../../utils/config.js';

Page({
  data: {
    tabs: ["组织结构", "我的收藏"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    groupName: "马群",
    userId: '55',
    orgId: '',
    userType: '2',
    cameraList: [],
    cameras: [],
    currentPage: 0,
    pageSize: 10,
    orgList: []
  },
  _goPlayerView: function () {
    wx.navigateTo({
      url: '../player/player'
    })
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '数据请求中',
    })
    var that = this;
    console.log(options);
    that.data.groupName = options.groupName;
    that.data.userType = options.userType;
    that.data.userId = options.userId;
    that.data.orgId = options.orgId;

    // 获取相机列表
    that._getCamera();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  _getCamera: function () {
    var that = this;
    console.log(that.data.groupName);
    if (that.data.userType == 3) {
      wx.request({
        url: Config.restUrl + '/service/video_access_copy/list_cameras',
        data: {
          isRoot: '1',
          type: 'customize',
          groupName: that.data.groupName
        },
        header: {
          'content-type': 'application/json', // 默认值
          'cookie': wx.getStorageSync("sessionid")
        },
        success: function (res) {
          wx.hideLoading();
          console.log(res.data)
          if (res.data.code == 200) {
            that.data.cameras = res.data.data.cameras;
            that.setData({
              cameras: that.data.cameras
            });
            if (that.data.cameras.length == 0) {
              wx.showModal({
                title: '提示',
                content: '尚未加入任何街道，请和管理员联系！',
                success: function (res) {
                  if (res.confirm) {
                  } else {
                  }
                }
              })
            }
          } else {
            wx.showModal({
              title: '提示',
              content: '获取组织结构失败，请稍后再试！',
              success: function (res) {
                if (res.confirm) {
                } else {
                }
              }
            })
          }
        }
      })
    } else if (that.data.userType == 2 || that.data.userType == 1) {
      wx.request({
        url: Config.restUrl + '/service/resource/get_camera_orgs_by_parent',
        data: {
          masterOrgId: 0,
          currentPage: that.data.currentPage,
          pageSize: that.data.pageSize,
          mUserId: that.data.userId
        },
        header: {
          'content-type': 'application/json', // 默认值
          'cookie': wx.getStorageSync("sessionid")
        },
        success: function (res) {
          wx.hideLoading();
          console.log(res.data)
          if (res.data.code == 200) {
            that.data.orgList = res.data.data.orgList;
            that.setData({
              orgList: that.data.orgList
            });
          } else {
            wx.showModal({
              title: '提示',
              content: '获取组织结构失败，请稍后再试！',
              success: function (res) {
                if (res.confirm) {
                } else {
                }
              }
            })
          }
        }
      })
    }
  },
  _getCameraListByID: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../playerList/playerList?id=' + e.currentTarget.dataset.id + '&groupName=' + that.data.groupName
    })
  },
  _goOrgList: function (e) {
    console.log(e);
    var that = this;
    wx.navigateTo({
      url: '../orgList/orgList?orgId=' + e.currentTarget.dataset.id + '&mUserId=' + that.data.userId
    })
  }
});
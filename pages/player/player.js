import {
  Config
} from '../../utils/config.js';
const app = getApp()
Page({
  data: {
    //测试 rtmp://222.190.121.133:10935/hls/stream_1
    urlMain: "",
    urlAssist: "",
    isPlay: true,
    isUrlMain: true,
    isFullscreen: false,
    isBarShow: true,
    cameraId: 5,
    rtsp_str: '',
    get_id: 0,
    pvgtitle:'',
    postUrl:"",
    cameraTitle:"",
    c_name: ''
  },
  onLoad: function(options) {
    wx.showLoading({
      title: '数据请求中',
    })
    var that = this;
    console.log(options);
    that.data.cameraId = options.id;
    that.data.cameraTitle = options.cameraTitle;
    that._getPvgInfo();
    // that._login();
  },
  _login: function() {
    var that = this;
    wx.request({
      // url: 'http://qxjk.njqxq.gov.cn:10800' + '/login',
      url: that.data.postUrl + 'https://qxjk.njqxq.gov.cn:10800' + '/login',
      data: {
        username: 'admin',
        password: 'e59cf56e33f978124da804b7e12c0d53'
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res)
        var cookie = res.header['Set-Cookie'];
        // console.log(cookie);
        var cookie_arr = cookie.split(";");
        wx.setStorageSync("sid", cookie_arr[0])
        // wx.setStorageSync("sid", cookie)
        console.log(wx.getStorageSync("sid"));
        that._save();
      }
    })
  },
  _get: function() {
    var that = this;
    console.log(that.data.rtsp_str);
    wx.request({
      url: that.data.postUrl+ 'https://qxjk.njqxq.gov.cn:10800' + '/vlive/get',
      data: {
        id: 'c' + that.data.cameraId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'cookie': wx.getStorageSync("sid")
      },
      success: function(res) {
        console.log(res.data)

        if (res.data.session instanceof Object) {
          // that.data.urlMain = 'https://qxjk.njqxq.gov.cn:10800' + res.data.session["HTTP-FLV"];
          that.data.urlMain =res.data.session.RTMP;
          // that.data.urlAssist = 'https://qxjk.njqxq.gov.cn:10800' + res.data.session["HTTP-FLV"];
          that.data.urlAssist = res.data.session.RTMP;
          console.log(that.data.urlMain);
          wx.hideLoading();
          that.setData({
            urlMain: that.data.urlMain,
            urlAssist: that.data.urlAssist
          });
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '获取视频流失败，请稍后再试',
            success: function(res) {
              if (res.confirm) {
                wx.navigateBack();
              } else {
                wx.navigateBack();
              }
            }
          })
        }
      }
    })
  },
  _save: function() {
    var that = this;
    console.log(that.data.rtsp_str);
    wx.request({
      url: that.data.postUrl+'https://qxjk.njqxq.gov.cn:10800' + '/vlive/save',
      data: {
        name: that.data.c_name,
        // cid: 9,
        cid: 'c' + that.data.cameraId,
        type: 'online',
        src: that.data.rtsp_str,
        wawaji: false,
        shared: false
        // id: that.data.cameraId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'cookie': wx.getStorageSync("sid")
      },
      success: function(res) {
        console.log(res.data)
        if (res.data == 'ID已被使用,直播流和虚拟直播需保持ID唯一') {
          that._get();
        } else {
          that._start();
        }
        // 启动
      }
    })
  },
  _start: function() {
    var that = this;
    console.log(that.data.rtsp_str);
    wx.request({
      url: that.data.postUrl+ 'https://qxjk.njqxq.gov.cn:10800' + '/vlive/start',
      data: {
        id: 'c' + that.data.cameraId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'cookie': wx.getStorageSync("sid")
      },
      success: function(res) {
        console.log(res.data)
        // 启动
        setTimeout(function() {
          that._get();
        }, 15000)
      }
    })
  },
  _getRTSP: function() {
    var that = this;
    wx.request({
url:that.data.postUrl+'http://qxjk.njqxq.gov.cn:19999/media/mediauri',
      data: {
        PvgTitle: that.data.pvgtitle,
        CameraName: that.data.c_name
      },
      method: 'POST',
      header: {
        'content-type': 'application/json;charset=utf-8' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.Code == 0) {
          var RtspUri_arr = res.data.RtspUri.split("/av");
          that.data.rtsp_str = RtspUri_arr[0] + '/' + that.data.c_name;
          // that.data.rtsp_str = "rtsp://172.15.1.24:554:554/PVG/live/?PVG=172.15.1.26:2100/admin/admin/av/1/7/10";
          // that._login();
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '获取视频流失败，请稍后再试',
            success: function(res) {
              if (res.confirm) {
                wx.navigateBack();
              } else {
                wx.navigateBack();
              }
            }
          })
        }
      }
    });
  },
  _getPvgInfo: function() {
    var that = this;
    wx.request({
      url: Config.restUrl + '/service/video_access_copy/getCameraTochannelPvgInfo',
      data: {
        cameraId: that.data.cameraId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.code == 200) {
          that.data.rtsp_str = "rtsp://172.15.1.24:554/PVG/live/?PVG=" + res.data.data.channel.sd_channel[0].ip + ':' + res.data.data.channel.sd_channel[0].port + "/" + res.data.data.channel.sd_channel[0].username + "/" + res.data.data.channel.sd_channel[0].password + "/" + res.data.data.channel.sd_channel[0].av_obj;
          // that.data.rtsp_str = 'rtsp://172.15.1.24:554/PVG/live/?PVG=172.15.1.26:2100/admin/admin/av/1/7/31'
          that.data.c_name = res.data.data.channel.sd_channel[0].av_obj;

          ///
          var cataloglist = app.globalData.cataloglist;
          console.log(cataloglist);
         that.data.pvgtitle = null;
          var CameraName = that.data.cameraTitle;
          console.log(CameraName);
          for (var key in cataloglist) {
            console.log("22");
            for (var i = 0; i < cataloglist[key].length; i++) {

              if (cataloglist[key][i].CameraTitle == CameraName) {
                that.data.pvgtitle = key;
                console.log("pvgtitle",that.data.pvgtitle);
                if (that.data.pvgtitle != null ) {
                  that._getRTSP();
                  that._login();
                } else {
                  wx.hideLoading();
                  wx.showModal({
                    title: '提示',
                    content: '获取视频流失败，请稍后再试',
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack();
                      } else {
                        wx.navigateBack();
                      }
                    }
                  })
                }
              }
            }
          }
          console.log(that.data.pvgtitle);
          if (that.data.pvgtitle == null) {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '获取视频流失败，请稍后再试',
              success: function (res) {
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
            content: '获取视频流失败，请稍后再试',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack();
              } else {
                wx.navigateBack();
              }
            }
          })
        }
      }
    })
  },
  onReady() {
    this.playerContext = wx.createLivePlayerContext('myLive');
  },
  onFullscreenChange() {
    this.setData({
      isFullscreen: !this.data.isFullscreen
    });
  },
  onPlayChange(e) {
    console.log('live-player code:', e.detail.code)
  },
  handlePlayStop() {
    if (this.data.isPlay) {
      this.playerContext.stop({
        success: function() {
          console.log('stop success!')
        },
        fail: function() {
          console.log('stop failed!')
        }
      });
      this.setData({
        isPlay: false
      });
    } else {
      this.playerContext.play();
      this.setData({
        isPlay: true
      });
    }
  },
  handlePlay() {
    this.playerContext.play();
    this.setData({
      isPlay: true
    });
  },
  handleMainAssist() {
    if (this.data.isUrlMain) {
      this.setData({
        isUrlMain: false
      });
    } else {
      this.setData({
        isUrlMain: true
      });
    }
  },
  handleRequestFullScreen() {
    this.playerContext.requestFullScreen({
      direction: 90
    });
  },
  handleExitFullScreen() {
    this.playerContext.exitFullScreen();
  },
  handleBarShow() {
    this.setData({
      isBarShow: !this.data.isBarShow
    });
  },
  keepBarShow() {
    this.setData({
      isBarShow: true
    });
  },
})
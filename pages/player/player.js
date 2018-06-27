Page({
  data: {
    //测试
    urlMain: "rtmp://live.hkstv.hk.lxdns.com/live/hks",
    urlAssist: "rtmp://v1.one-tv.com/live/mpegts.stream",
    isPlay: true,
    isUrlMain: true,
    isFullscreen: false,
    isBarShow: true
  },
  onReady() {
    this.playerContext = wx.createLivePlayerContext('myLive');
  },
  onFullscreenChange() {
    this.setData({ isFullscreen: !this.data.isFullscreen });
  },
  handlePlayStop() {
    if (this.data.isPlay) {
      this.playerContext.stop({
        success: function () {
          console.log('stop success!')
        },
        fail: function () {
          console.log('stop failed!')
        }
      });
      this.setData({ isPlay: false });
    } else {
      this.playerContext.play();
      this.setData({ isPlay: true });
    }
  },
  handlePlay() {
    this.playerContext.play();
    this.setData({ isPlay: true });
  },
  handleMainAssist() {
    if (this.data.isUrlMain) {
      this.setData({ isUrlMain: false });
    } else {
      this.setData({ isUrlMain: true });
    }
  },
  handleRequestFullScreen() {
    this.playerContext.requestFullScreen({ direction: 90 });
  },
  handleExitFullScreen() {
    this.playerContext.exitFullScreen();
  },
  handleBarShow() {
    this.setData({ isBarShow: !this.data.isBarShow });
  },
  keepBarShow() {
    this.setData({ isBarShow: true });
  },
})
import { Config } from '../../utils/config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
    yzm: '',
    showPhone: true,
    showYzm: false
  },
  suerPhone: function () {
    console.log(this.data.phoneNumber);
    var that = this;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(that.data.phoneNumber)) {
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
      if (that.data.phoneNumber == 18260412951) {
        wx.showToast({
          title: '请接收验证码',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
        that.data.showPhone = false;
        that.data.showYzm = true;
        that.setData({
          showPhone: that.data.showPhone,
          showYzm: that.data.showYzm
        })
      } else {
        wx.showLoading({
          title: '数据请求中',
        })
        wx.request({
          url: Config.restUrl + '/service/sendVerificationCode?phoneNo=' + that.data.phoneNumber,
          data: {
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data)
            wx.hideLoading();
            console.log(res);
            if (res.data.code == 200) {
              var cookie = res.header["Set-Cookie"];
              var cookie_arr = cookie.split(";");
              wx.setStorageSync("sessionid", cookie_arr[0])
              console.log(wx.getStorageSync("sessionid"));
              wx.showToast({
                title: '请接收验证码',
                icon: 'succes',
                duration: 1000,
                mask: true
              })
              that.data.showPhone = false;
              that.data.showYzm = true;
              that.setData({
                showPhone: that.data.showPhone,
                showYzm: that.data.showYzm
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '接受验证码失败，请稍后再试',
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
    }
  },
  inputPhone: function (e) {
    this.data.phoneNumber = e.detail.value;
  },
  inputYzm: function (e) {
    this.data.yzm = e.detail.value;
  },
  suerYzm: function (e) {
    var that = this;
    console.log(that.data.yzm);
    var reg = new RegExp(/^\d{6}$/);
    if (!reg.test(that.data.yzm)) {
      wx.showModal({
        title: '提示',
        content: '验证码错误',
        success: function (res) {
          if (res.confirm) {
          } else {
          }
        }
      })
    } else {
      console.log(22222222222222)
      console.log(wx.getStorageSync("sessionid"));
      wx.request({
        url: Config.restUrl + '/service/login',
        data: {
          phoneNo: that.data.phoneNumber,
          verificationCode: that.data.yzm,
        },
        header: {
          'content-type': 'application/json',
          'cookie': wx.getStorageSync("sessionid")
        },
        success: function (res) {
          console.log(res);
          console.log(res.data);
          if (res.data.code == 200) {
            wx.showToast({
              title: '登陆成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
            var userId = res.data.data.userId;
            var orgId = res.data.data.org.id;
            var userType = res.data.data.org.userType;
            var groupName = res.data.data.org.name.substr(0, 2);

            console.log(userId);
            console.log(userType);
            console.log(groupName);
            setTimeout(function () {
              wx.redirectTo({
                url: '../videoList/videoList?userId=' + userId + '&userType=' + userType + '&groupName=' + groupName + '&orgId=' + orgId,
              })
            }, 800);
          } else {
            wx.showModal({
              title: '提示',
              content: '您输入的验证码有误！',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(Config.restUrl);
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
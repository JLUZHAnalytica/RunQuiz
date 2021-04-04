//index.js
const app = getApp()

Page({
  data: {
    avatarUrl:"",
    username: "",
    takeSession: false,
    requestResult: '',
    hasUserInfo: false,
  },

  onLoad: function() {

      let username = wx.getStorageSync('username'),
        avater = wx.getStorageSync('avatarUrl');
      if(username){
        this.setData({
          username: username,
          avatarUrl: avater,
          hasUserInfo: true,
        })
      }
      // 调用云函数
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })

      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.werun']) {
            wx.authorize({
              scope: 'scope.werun',
            })
          }
        }
      })

  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          username: res.userInfo.nickName,
          hasUserInfo: true,
        })
        wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
        wx.setStorageSync('username', res.userInfo.nickName)
        // app.globalData.avatarUrl=res.userInfo.avatarUrl
        // app.globalData.nickName=res.userInfo.nickName
        // app.globalData.hasUserInfo=true
      }
      
    })
    
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
    }
  },

  onScanQRCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success (res) {
        console.log(res)
      }
    })
  }

})

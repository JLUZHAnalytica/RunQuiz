//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: "", //存头像链接
    nickName: "", //存用户名
    hasUserInfo: false,
    openid: "",
  },

  onLoad: function () {
    if (app.globalData.hasUserInfo) {
      this.setData({
        nickName: app.globalData.nickName,
        avatarUrl: app.globalData.avatarUrl,
        openid: app.globalData.openid,
        hasUserInfo: true,
      })
    }


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

    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.setStorageSync('openid', res.result.openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
          hasUserInfo: true,
        })
        wx.setStorageSync('hasUserInfo', true)
        wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
        wx.setStorageSync('nickName', res.userInfo.nickName)
        app.globalData.avatarUrl = res.userInfo.avatarUrl
        app.globalData.nickName = res.userInfo.nickName
        app.globalData.hasUserInfo = true
      }

    })

  },

  onSeeBrief: function(i)  {
    console.log("查看第", i+1, "个打卡点的信息")
  },

  onScanQRCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
      }
    })
  }

})
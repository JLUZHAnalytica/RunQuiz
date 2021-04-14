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


    wx.getSetting().then(res=>{
      if (!res.authSetting['scope.werun']) {
        wx.authorize({
          scope: 'scope.werun',
        }).catch(err=>{
          wx.showModal({
            title: '读取微信运动数据失败',
            content: '请在小程序右上角[设置]中开启授权'
          })

        })
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

  onSeeBrief: function(e)  {
    console.log(e.target.id)
  },

  onScanQRCode() {
    let that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
        that.getUserRun()
      }
    })
  },

  // 读取用户的微信运动数据
  getUserRun() {
    wx.getWeRunData({
      success: (result) => {
        wx.cloud.callFunction({
          name: 'login',
          data: {
            weRunData: wx.cloud.CloudID(result.cloudID),
            obj: {
              shareInfo: wx.cloud.CloudID(result.cloudID)
            }
          }
        }).then(res=>{
          console.log(res);
          let step = res.result.event.weRunData.data.stepInfoList[30].step;
          wx.showToast({
            title: "得到的今日步数："+step,
            icon: 'none'
          })
        })
      },
      fail: (error) => {
        wx.showModal({
          title: '读取微信运动数据失败',
          content: '请在小程序右上角[设置]中开启授权'
        })
      }
    })
  }
})
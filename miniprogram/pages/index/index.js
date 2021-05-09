//index.js
const app = getApp()
const db = wx.cloud.database()
let stepIndex = -1;
Page({
  data: {
    avatarUrl: "", //存头像链接
    nickName: "", //存用户名
    hasUserInfo: false,
    openid: "",
    team: "",
    hasteaminfo: false,
    icon: [false, false, false, false, false],
    allTeams: ["美术与设计学院", "工商管理学院", "电子信息工程学院", "计算机学院", "旅游学院", "机械工程学院", "文学院", "公共管理学院", "外国语学院", "药学与食品科学学院", "建筑与城乡规划学院", "金融与贸易学院", "物流管理与工程学院", "音乐舞蹈学院", "公共外语教育学院", "马克思主义学院", "国际教育交流学院", "健康学院", "创新创业学院", "航空工程学院", "化工与新能源材料学院", "公共基础与应用统计学院", "体育科学学院", "阿里云大数据应用学院", "继续教育学院"]
  },

  onLoad: function () {
    if (app.globalData.hasUserInfo) {
      this.setData({
        nickName: app.globalData.nickName,
        avatarUrl: app.globalData.avatarUrl,
        openid: app.globalData.openid,
        hasUserInfo: true,
      })
      if (app.globalData.hasteaminfo) {
        this.setData({
          team: app.globalData.team,
          hasteaminfo: true
        })
      }
    }
    console.log("team:", this.data.team)

    wx.getSetting().then(res => {
      if (!res.authSetting['scope.werun']) {
        wx.authorize({
          scope: 'scope.werun',
        }).catch(err => {
          wx.showModal({
            title: '读取微信运动数据失败',
            content: '请在小程序右上角[设置]中开启授权'
          })

        })
      }
    })

  },

  bindPickerChange: function (e) {
    this.setData({
      team: this.data.allTeams[e.detail.value],
      hasteaminfo: true
    })
    wx.setStorageSync('team', this.data.team)
    wx.setStorageSync('hasteaminfo', true)
    this.modifyData(wx.getStorageSync('_id'), {
      data: {
        team: this.data.team
      }
    })
  },

  getUserProfile(e) {
    let that = this;
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
        that.insertData({
          data: {
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            team: '',
            record: []
          }
        })
      }

    })

  },

  onSeeBrief: function (e) {
    console.log(e.target.id)
  },

  onScanQRCode() {
    let that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res.result);
        if (res.result == 'start') {
          that.setData({
            'icon[0]': true
          })
          wx.showToast({
            title: '扫码成功',
          })
          that.getUserRun();
          setTimeout(() => {
            that.modifyData(wx.getStorageSync('_id'), {
              data: {
                record: db.command.push([{
                  point: '起点',
                  time: db.serverDate(),
                  steps: stepIndex
                }])
              }
            })
          }, 5 * 1000);
        } else if (res.result == 'zfd1') {
          that.setData({
            'icon[1]': true
          })
          wx.showToast({
            title: '扫码成功',
          })
          that.getUserRun();
          setTimeout(() => {
            that.modifyData(wx.getStorageSync('_id'), {
              data: {
                record: db.command.push([{
                  point: '折返点1',
                  time: db.serverDate(),
                  steps: stepIndex
                }])
              }
            })
          }, 5 * 1000);
        } else if (res.result == 'zfd2') {
          that.setData({
            'icon[2]': true
          })
          wx.showToast({
            title: '扫码成功',
          })
          that.getUserRun();
          setTimeout(() => {
            that.modifyData(wx.getStorageSync('_id'), {
              data: {
                record: db.command.push([{
                  point: '折返点2',
                  time: db.serverDate(),
                  steps: stepIndex
                }])
              }
            })
          }, 5 * 1000);
        } else if (res.result == 'zfd3') {
          that.setData({
            'icon[3]': true
          })
          wx.showToast({
            title: '扫码成功',
          })
          that.getUserRun();
          setTimeout(() => {
            that.modifyData(wx.getStorageSync('_id'), {
              data: {
                record: db.command.push([{
                  point: '折返点3',
                  time: db.serverDate(),
                  steps: stepIndex
                }])
              }
            })
          }, 5 * 1000);
        } else if (res.result == 'end') {
          that.setData({
            'icon[4]': true
          })
          wx.showToast({
            title: '扫码成功',
          })
          that.getUserRun();
          setTimeout(() => {
            that.modifyData(wx.getStorageSync('_id'), {
              data: {
                record: db.command.push([{
                  point: '终点',
                  time: db.serverDate(),
                  steps: stepIndex
                }])
              }
            })
          }, 5 * 1000);
        } else {
          wx.showToast({
            title: '非本项目二维码，请重新扫码',
            icon: 'none'
          })
        }
      },
      fail(err) {
        wx.showToast({
          title: '扫码失败',
          icon: 'none'
        })
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
        }).then(res => {
          console.log(res);
          let step = res.result.event.weRunData.data.stepInfoList[30].step;
          wx.showToast({
            title: "得到的今日步数：" + step,
            icon: 'none'
          })
          stepIndex = step;
        })
      },
      fail: (error) => {
        wx.showModal({
          title: '读取微信运动数据失败',
          content: '请在小程序右上角[设置]中开启授权'
        })
      }
    })
  },

  // 增加数据到数据库
  insertData(object) {
    db.collection('users').add(object).then(res => {
      console.log('成功增' + res);
      wx.setStorageSync('_id', res._id)
    }).catch(err => {
      console.log('失败增' + err);
    })
  },

  // 修改数据到数据库
  modifyData(id, object) {
    db.collection('users').doc(id).update(object).then(res => {
      console.log('成功修改' + res);
    }).catch(err => {
      console.log('失败修改' + err);
    })
  }
})
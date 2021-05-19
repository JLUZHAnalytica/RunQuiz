// pages/summary/summary.js
const app = getApp()
const db =wx.cloud.database() 
const MAX_LIMIT = 100
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "", //存头像链接
    nickName: "", //存用户名
    number:'',
    hasUserInfo: true,
    openid: "",
    step:"",//存用户微信步数
    users:[],
    usersort:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.hasUserInfo) {
      this.setData({
        nickName: app.globalData.nickName,
        avatarUrl: app.globalData.avatarUrl,
        openid: app.globalData.openid,
        hasUserInfo: true,
      })
      }

    let that=this;
    //调用云函数
      wx.cloud.callFunction({
        name:'getALLdata',
        data:{},     
        success: res =>{
          console.log('',res)
          //步数排序
          var users=res.result.data.sort(function sortNumber(a,b){
            if(a.record!=0&&b.record.length!=0){
              return b.record[b.record.length-1].steps - a.record[a.record.length-1].steps}
            else if(a.record!=0){
              b.record.steps=-1
              return b.record.steps - a.record[a.record.length-1].steps}
            else{
              a.record.steps=-1
              return b.record[b.record.length-1].steps - a.record.steps}
            })
            for(let i=0;i<users.length;i++){
              if(app.globalData.openid==users[i]._openid&&app.globalData.nickName==users[i].nickName){
                this.setData({
                  number:i+1,
                  step:users[i].record[users[i].record.length-1].steps
                })
              }
            }
            //console.log(users)
            //取前10条
            users = users.slice(0, 10) 
          that.setData({
            usersort:users
            })
        },
        fail: err => {
          console.error('调用失败', err)
        }
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
    console.log('onPullDownRefresh')
    wx.stopPullDownRefresh({// 下拉复位
      success: (res) => {
        this.onLoad()
      },
    })

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

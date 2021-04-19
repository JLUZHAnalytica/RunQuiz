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
    users:{},
    usersort:{},
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
    wx.cloud.init({
      env: 'cloud1-5gzddcqr4caf5f24',
    })
/*    wx.cloud.callFunction({
      name:'getusers',
      data:{},
      success:res=>{

      }
    })
*/

    let that=this;
    db.collection('users').count().then(async res =>{    
      let total = res.total;
      // 计算需分几次取
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      // 承载所有读操作的 promise 的数组
      if(total>20){
        for (let i = 0; i < batchTimes; i++) {
          await db.collection('users').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(async res => {
            let new_data = res.data
            let old_data=that.data.users
          })
        }
        that.setData({
          users:that.old_data.concat(new_data)
        })
       console.log(that.data.users[0])
       for(let i=0;i<that.data.users.length;i++){
         if(nickName==that.data.users[i].nickName){
            number=i
            step==that.data.users[i].record[that.data.users[i].record.length-1].steps
         }else{
           step=0
           number=0
         }
       }
       var usersort = that.data.users.sort(function sortstep(a,b){return a.record[a.record.length-1].steps - b.record[a.record.length-1].steps}).limit(10)
      }else{
        await db.collection('users').orderBy("record[record.length-1].steps",'desc').limit(10).get({
          success:res=>{
            console.log("sucess",res)
            this.setData({
              usersort:res.data
            })
          },
          fail:err=>{
            console.error("error",err)
          }
        })
      }
    })
/*    db.collection('users')
      .orderBy("record[-1].steps",'desc')
      .limit(10)
      .get({
        success: res => { 
          console.log("请求成功",res);   
          this.setData({
            users: res.data
          })
        },
        fail(res){
          console.log("请求失败",res);
        }
      })
 */     
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
      success: (res) => {},
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
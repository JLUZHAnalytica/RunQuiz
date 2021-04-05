// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {
    step: 1,
    counterId: '',
    openid: '',
    count: null,
    queryResult: '',
    nickName: '',
    finished: false,
    checked: false,

    formData: {},
    quiz: {
      text: "这是一道题目的题干",
      ans: 0,
      score: 10,
      ismulti: false,
      items: [{
          name: '这是选项 0 选我就对了',
          value: '0'
        },
        {
          name: '这是选项 1 选我就错了',
          value: '1'
        }
      ],
    },

    questions: [{
      text: "这是一道题目的题干",
      ans: 0,
      ismulti: false,
      items: [{
          name: '这是选项 0 选我就对了',
          value: '0'
        },
        {
          name: '这是选项 1 选我就错了',
          value: '1'
        }
      ],
    }],
  },



  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid,
        nickName: app.globalData.nickName
      })
    }
  },

  getQuiz() {
    db.collection('Questions').aggregate().sample({
        size: 10
      }).end()
      .then(res => {
        console.log(res.list);
        this.setData({
          questions: res.list
        })
      })
  },


  submitForm: function () {
    // 待优化，展示答案时不跳转到下一页
    console.log(this.data.formData)
    if(this.data.formData.radio == this.data.quiz.ans){
      wx.showModal({
        title: '恭喜🎉',
        content: '回答正确，请进入下一题',
        showCancel: false
      })
      app.globalData.score+=this.data.quiz.score
    }
    else
    {
      wx.showModal({
        title: '回答错误，正确答案是：',
        confirmText: '下一题',
        content: this.data.quiz.items[this.data.quiz.ans].name,
        showCancel: false
      })
    }
    console.log(app.globalData.score)
    this.setData({
      finished: false,
      step: this.data.step + 1
    })

    
    if (this.data.step>10) 
    {
        const pages = getCurrentPages()
        if (pages.length === 2) {
          wx.navigateBack()
        } else if (pages.length === 1) {
          wx.redirectTo({
            url: '../index/index',
          })
        } else {
          wx.reLaunch({
            url: '../index/index',
          })
        }
    }
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.quiz.items;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems,
      [`formData.radio`]: e.detail.value
    });

  },




  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },

  

})
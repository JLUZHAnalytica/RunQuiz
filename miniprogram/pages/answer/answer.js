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

    formData: {},
    quiz: {
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
    db.collection('quiz').aggregate().sample({
        size: 1
      }).end()
      .then(res => {
        console.log(res.list[0]);
        this.setData({
          quiz: res.list[0]
        })
      })
  },


  submitForm() {
    console.log(this.data.formData)
    this.setData({
      finished: true
    })
    console.log(this.data.finished)
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


  nextStep: function () {
    // 在第一步，需检查是否有 openid，如无需获取
    
      this.setData({
        finished: false,
        step: this.data.step + 1
      })
    
  },

  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },

  goHome: function () {
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

})
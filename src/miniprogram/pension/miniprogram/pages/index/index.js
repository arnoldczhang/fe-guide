//index.js
const app = getApp()

Page({
  data: {
    // 月工资
    salary: null,
    // 职工上年月平均工资
    lastAvgSalary: null,
    // 现在年龄
    age: null,
    // 打算退休时年龄
    retireAge: null,
    // 帐户累积的养老金额
    accumulate: null,
    // 默认个人工资增长率
    rate: null,
    // 默认职工工资增长率
    avgRate: null,
    // 最终计算出的养老金
    pension: null,
  },

  onLoad() {
    const cach = wx.getStorageSync('pension_cach');
    if (cach) {
      this.setData(cach)
    }
  },
  onShareAppMessage(res) {},

  storeData() {
    const {
      lastAvgSalary,
      retireAge,
      accumulate,
      age,
      salary,
      avgRate,
      rate,
    } = this.data;
    wx.setStorageSync('pension_cach', {
      lastAvgSalary,
      retireAge,
      accumulate,
      age,
      salary,
      avgRate,
      rate,
    });
  },

  onHandleInput({
    currentTarget: {
      dataset: {
        key,
      },
    },
    detail: {
      value,
    },
  }) {
    if (key) {
      this.setData({
        [key]: value,
      });
    }
  },

  calculatePension() {
    const {
      lastAvgSalary,
      retireAge,
      accumulate,
      age,
      salary,
      avgRate,
      rate,
    } = this.data;
    const base = lastAvgSalary * (1 + (parseFloat(retireAge) - parseFloat(age)) * parseFloat(avgRate) / 100) * 0.2;
    const increasing = parseFloat(accumulate) + salary * 0.08 * 12 * (Math.pow(1 + (parseFloat(rate) / 100), parseFloat(retireAge) - parseFloat(age)) - 1) / (parseFloat(rate) / 100);
    this.storeData();
    this.setData({
      pension: (base + increasing / 120).toFixed(2) || 0,
    });
  },

  onGetUserInfo({
    detail: {
      userInfo,
    }
  }) {
    this.calculatePension();
    userInfo.pension = this.data.pension;
    this.onGetSaveUser(userInfo);
  },

  onGetMobile(e) {
    console.log(e);
  },

  onGetSaveUser: function(userInfo) {
    wx.cloud.callFunction({
      name: 'user',
      data: {
        method: 'put',
        ...userInfo,
      },
      success: (res) => {
        console.log('res', res);
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
})

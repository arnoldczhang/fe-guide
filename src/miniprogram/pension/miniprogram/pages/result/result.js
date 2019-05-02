// miniprogram/pages/result/result.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 能满足预期
    matched: true,
    // 现在年龄
    age: null,
    // 打算退休时年龄
    retireAge: null,
    // 期望退休后的月花销
    expectedPension: null,
    // 最终计算出的养老金
    pension: null,
    // 缺额
    lackPension: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { age, retireAge, pension, expectedPension } = options;
    const { nickName, avatarUrl } = getApp().userInfo;
    this.setData({
      matched: expectedPension <= pension,
      age,
      retireAge,
      pension,
      expectedPension,
      nickName,
      avatarUrl
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});

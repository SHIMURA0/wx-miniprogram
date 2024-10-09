const app = getApp();

Page({
  data: {
    showNameInput: false,
    realName: '',
    targetPage: '',
    params: {}
  },

  onLoad: function(options) {
    this.setData({
      targetPage: decodeURIComponent(options.targetPage || '/pages/index/index'),
      params: options.params ? JSON.parse(decodeURIComponent(options.params)) : {}
    });

    app.checkAuth()  // 用户身份验证
    .then(userInfo => {
      if (!userInfo.real_name) {
        // 如果是新用户（没有真实姓名），直接显示输入框
        this.setData({
          showNameInput: true
        });
      } else {
        // 已有真实姓名，直接跳转到目标页面
        this.navigateToTargetPage(userInfo.real_name);
      }
    })
    .catch(error => {
      console.error('身份验证失败:', error);
      // 身份验证失败，重定向到登录页面
      wx.redirectTo({
        url: '/pages/auth/auth'
      });
    });
  },

  // 处理输入的真实姓名
  inputRealName: function(e) {
    this.setData({
      realName: e.detail.value
    });
  },

  // 提交真实姓名
  submitRealName: function() {
    if (!this.data.realName.trim()) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      });
      return;
    }
  
    wx.showLoading({
      title: '正在提交...',
      mask: true
    });
  
    // 把用户填写的真实姓名更新到后端数据库
    wx.request({
      // url: 'https://lab.guhejk.com/update_name',
      url: 'https://lab.guhejk.com/api/wechat/v1/users/update_user_name',
      method: 'PUT',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('accessToken'),
        'content-type': 'application/json'
      },
      data: JSON.stringify({
        real_name: this.data.realName
      }),
      // 若对后端请求记录真实姓名成功
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          app.globalData.userInfo.real_name = this.data.realName
          wx.showToast({
            title: `欢迎，${this.data.realName}`,
            icon: 'success',
            duration: 1500
          });
          // 更新成功，显示提示然后直接跳转
          setTimeout(() => {
            this.navigateToTargetPage(this.data.realName);
          }, 1500);
        } else {
          wx.showToast({
            title: res.data.detail || '更新失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('更新真实姓名失败:', error);
        wx.showToast({
          title: '更新失败，请重试',
          icon: 'none'
        });
      }
    });
  },  

  navigateToTargetPage: function(realName = '') {
    const url = this.buildUrl(this.data.targetPage, this.data.params);
    wx.redirectTo({
      url: url,
      success: () => {
        if (realName) {
          // 在页面跳转成功后显示欢迎消息
          setTimeout(() => {
            wx.showToast({
              title: `欢迎回来，${app.globalData.userInfo.real_name}`,
              icon: 'none',
              duration: 3000
            });
          }, 500);
        }
      },
      fail: function(error) {
        console.error('页面跳转失败:', error);
        wx.redirectTo({
          url: '/pages/index/index'
        });
      }
    });
  },

  buildUrl: function(path, params) {
    let url = path;
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
    return url;
  }
});




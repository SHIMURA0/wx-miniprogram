App({
  // 全局数据对象，用于存储应用级别的数据
  globalData: {
    userInfo: null,     // 用户信息
    accessToken: null,  // 访问令牌
    refreshToken: null, // 刷新令牌
    realName: ''
  },

  // 小程序启动时执行的函数
  onLaunch: function() {
    this.checkAuth(); // 检查用户认证状态
  },

  // 检查用户认证状态的函数
	checkAuth: function() {
	  return new Promise((resolve, reject) => {
	    // 从本地存储中获取访问令牌和刷新令牌
	    const accessToken = wx.getStorageSync('accessToken');
	    const refreshToken = wx.getStorageSync('refreshToken');
	
	    if (accessToken && refreshToken) {
	      // 如果令牌以本地缓存的形式存在，更新全局数据并获取用户信息
	      this.globalData.accessToken = accessToken;
	      this.globalData.refreshToken = refreshToken;
	      
	      // 使用访问令牌从后端调取用户的真实姓名
	      this.getUserInfo(this.globalData.accessToken)
	        .then(userInfo => {
	          this.globalData.userInfo = userInfo;
	          resolve(userInfo);
	        })
	        .catch(error => {
	          if (error.statusCode === 401) {
	            // 如果使用访问令牌对后端请求用户真实姓名出错（大概率访问令牌过期失效）
	            // 则使用刷新令牌对后端请求刷新访问令牌
	            this.refreshToken(this.globalData.refreshToken)
	              .then(({ accessToken, refreshToken }) => {
	                // 更新全局状态 + 更新本地存储
	                this.updateTokens(accessToken, refreshToken);
	                // 使用新的 accessToken 获取用户信息
	                return this.getUserInfo(accessToken);
	              })
	              .then(userInfo => {
	                this.globalData.userInfo = userInfo;
	                resolve(userInfo);
	              })
	              .catch(err => {
	                console.error('Token refresh failed:', err);
	                // 如果刷新失败，重新登录
	                return this.login();
	              })
	              .then(resolve)
	              .catch(reject);
            } else if (error.statusCode === 404) {
              // 如果当地有令牌缓存但是在后端数据其实找不到用户记录，则执行登陆流程
              this.login().then(resolve).catch(reject);
            } else {
	            reject(error);
	          }
	        });
	    } else {
	      // 如果令牌不存在，执行登录流程
	      this.login().then(resolve).catch(reject);
	    }
	  });
	},


  // 登录函数
	login: function() {
	  return new Promise((resolve, reject) => {
	    wx.login({
	      success: res => {
	        if (res.code) {
	          // 发送 res.code 到后端换取 openId, sessionKey, unionId
	          wx.request({
              // url: 'https://lab.guhejk.com/login',
              url: 'https://lab.guhejk.com/api/wechat/v1/auth/login',
	            method: 'POST',
	            header: {
	              'content-type': 'application/json'
	            },
	            data: JSON.stringify({
	              code: res.code
	            }),
	            success: (res) => {
                console.log('returned data:', res.data)
	              if (res.statusCode === 200 && res.data) {
                  const { access_token, refresh_token } = res.data;
                  
	                this.updateTokens(access_token, refresh_token);
	                
	                // 登录成功后，调用 checkAuth 来获取用户信息
	                this.checkAuth()
	                  .then(() => {
	                    resolve(this.globalData.userInfo);
	                  })
	                  .catch(error => {
	                    console.error('检查认证状态失败', error);
	                    reject(error);
	                  });
	              } else {
	                const error = new Error('登录失败：服务器返回异常');
	                console.error(error);
	                reject(error);
	              }
	            },
	            fail: (error) => {
	              console.error('登录请求失败', error);
	              reject(error);
	            }
	          });
	        } else {
	          const error = new Error('登录失败！' + res.errMsg);
	          console.error(error);
	          reject(error);
	        }
	      },
	      fail: (loginError) => {
	        console.error('微信登录接口调用失败', loginError);
	        reject(loginError);
	      }
	    });
	  });
	},
	

  // 获取用户信息的函数
  getUserInfo: function(token) {
    return new Promise((resolve, reject) => {
      wx.request({
        // url: 'https://lab.guhejk.com/user_info',
        url: 'https://lab.guhejk.com/api/wechat/v1/users/get_user_info',
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + token
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            reject({statusCode: res.statusCode, message: res.data});
          }
        },
        fail: (error) => {
          console.error('Get user info failed:', error);
          reject(error);
        }
      });
    });
  },
  
  // 辅助函数用于集中处理令牌的更新操作
  updateTokens: function(accessToken, refreshToken) {
  // 更新全局状态
	  this.globalData.accessToken = accessToken;
	  this.globalData.refreshToken = refreshToken;
	
	  // 更新本地存储
	  wx.setStorageSync('accessToken', accessToken);
    wx.setStorageSync('refreshToken', refreshToken);
    
    console.log(this.globalData.accessToken, this.globalData.refreshToken);
	},
  
  // 刷新令牌的函数
  refreshToken: function(refreshToken) {
	  return new Promise((resolve, reject) => {
	    wx.request({
        url: 'https://lab.guhejk.com/api/wechat/v1/auth/refresh_token',
	      method: 'POST',
	      header: {
	        'content-type': 'application/json'
	      },
	      data: JSON.stringify({
	        refresh_token: refreshToken
	      }),
	      success: (res) => {
          if (res.statusCode === 200 && res.data.access_token && res.data.refresh_token) {
	          // 更新全局数据和本地存储
	          resolve({
	            accessToken: res.data.access_token,
	            refreshToken: res.data.refresh_token
	          });
	        } else {
	          reject(new Error('Invalid response from refresh token endpoint'));
	        }
	      },
	      fail: (error) => {
	        console.error('Refresh token failed:', error);
	        reject(error);
	      }
	    });
	  });
	},
	


  // 封装的请求方法，自动处理 token 刷新
  request: function(options) {
    const originalRequest = () => {
      wx.request({
        ...options,
        header: {
          ...options.header,
          'Authorization': 'Bearer ' + this.globalData.accessToken
        },
        fail: (err) => {
          if (err.statusCode === 401) {
            // 如果返回 401 错误，尝试刷新 token 后重新请求
            this.refreshToken().then(() => {
              originalRequest();
            }).catch(() => {
              // 如果刷新 token 也失败，重新登录
              this.login();
            });
          } else if (options.fail) {
            // 其他错误，调用原始的失败回调
            options.fail(err);
          }
        }
      });
    };

    // 执行请求
    originalRequest();
  }
});





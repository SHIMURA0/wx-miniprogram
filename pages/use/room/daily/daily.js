Page({
  data: {
    currentDateTime: "",
    isSuccess: false, // 新增变量来表示提交成功的状态,
    instruments: [
      { id: 1, name: '房间2', checked: false, isSlider: true },
      { id: 2, name: '操作', isSlider: true, selectedIndex: -1, isLocked: false },
      { id: 3, name: '台式离心机 (左)', checked: true },
      { id: 4, name: '台式离心机 (右)', checked: true },
      { id: 5, name: '生物安全柜 (加样)', checked: true },
      { id: 6, name: '生物安全柜 (提取)', checked: true },
      { id: 7, name: '电热恒温水浴槽', checked: true },
      { id: 8, name: '东森超声波清洗机', checked: true },
      { id: 9, name: '冰柜', checked: true },
      { id: 10, name: '冰箱', checked: true },
      { id: 11, name: '单人净化工作台', checked: true},
      { id: 12, name: '核酸提取仪', checked: true},
      { id: 13, name: '迷你离心机(EP管)', checked: true},
      { id: 14, name: '振荡器(Vortex)', checked: true},
      { id: 15, name: '电脑', checked: true},
      { id: 16, name: '电脑显示器', checked: true},
      { id: 17, name: '低温酒精玻璃液体温度计', checked: true},
      { id: 18, name: '96道手动手动移液工作站', checked: true},
      { id: 19, name: '迷你微孔板离心机(96孔板)', checked: true},
      { id: 20, name: 'TianGen全波长分光光度计', checked: true},
      { id: 21, name: '移液器', checked: true},
      { id: 22, name: '12道移液器', checked: true},
    ],
    operationOptions: ['日常操作', '提取', 'CNAS'],
    operationOptionsIndex: null,
    userInfo: null,
    realName: '',
    // 新增: 用于控制是否只显示房间状态
    showOnlyRoom: false,
    remarks: "",
    // 处理核酸提取仪的弹框
    showDialog: false,
    dialogInstrumentName: '',
    serialNumber: "",
    testObject: "",
    nucleicAcidExtractorInfo: '',
  },

  // 获得当前的时间
  setCurrentDateTime: function () {
    const now = new Date();
    const formattedDateTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    this.setData({
      currentDateTime: formattedDateTime
    });
  },

  onLoad: function(options) {
    // 解析传入的参数
    let params = options;
    if (options.params) {
      try {
        params = JSON.parse(decodeURIComponent(options.params));
      } catch (error) {
        console.error('Failed to parse params:', error);
      }
    }
    
    this.setData({ params }, () => {
      console.log('Params set in data:', this.data.params);
      this.handleParams();  //见下面的handleParams()函数
    });
    const app = getApp();
    // 调用app.js中的checkAuth()函数来进行用户身份验证
    app.checkAuth()
    .then(userInfo => {
      if (userInfo.real_name) {
        this.setData(
          { 
            realName: userInfo.real_name 
          }
        );
      } else {
        // 如果没有真实姓名，重定向到身份验证页面
        const currentPage = '/pages/daily_instrument/daily_instrument';
        const encodedParams = encodeURIComponent(JSON.stringify(this.data.params));
        wx.redirectTo({
          url: `/pages/auth/auth?targetPage=${encodeURIComponent(currentPage)}&params=${encodedParams}`
        });
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

  // 判断房间2滑块按钮怎么选择以及操作这一个下拉选项应该选哪个（index）
  handleParams: function() {
    // 提取解析出来的两个参数roomStatus和operationType
    
    const { roomStatus, operationType } = this.data.params;
    let updatedInstruments = [...this.data.instruments];
  
    if (roomStatus) {
      updatedInstruments = updatedInstruments.map(item => {
        if (item.name === '房间2') {
          return { ...item, isLocked: true, checked: roomStatus === 'leave'};
        }
        return item;
      });

      // 更新 showOnlyRoom 状态
      this.setData({ showOnlyRoom: roomStatus === 'leave' });
    }
    
    let operationIndex = -1;
    if (operationType) {
      if (operationType.toLowerCase() === 'daily') {
        operationIndex = this.data.operationOptions.findIndex(op => op === '日常操作');
      } else if (operationType.toLowerCase() === 'extraction') {
        operationIndex = this.data.operationOptions.findIndex(op => op === '提取');
      } else if (operationType.toLowerCase() === 'cnas') {
        operationIndex = this.data.operationOptions.findIndex(op => op === 'CNAS');
      }

    if (operationIndex !== -1) {
      updatedInstruments = this.handleOperationChange(operationIndex, updatedInstruments);
    }
  }

  this.setData({ instruments: updatedInstruments });
},

  handleOperationChange: function(selectedIndex, instruments = this.data.instruments) {
    const selectedOperation = this.data.operationOptions[selectedIndex];
    
    return instruments.map(item => {
      if (item.name === '操作') {
        return { ...item, selectedIndex, isLocked: true };
      }
      
      if (item.name === '房间2') {
        return item;
      }
      
      if (selectedOperation === '日常操作') {
        return { ...item, checked: true };
      } else if (selectedOperation === '提取') {
        const extractionInstruments = [
          '台式离心机 (左)', 
          '台式离心机 (右)', 
          '生物安全柜 (加样)', 
          '生物安全柜 (提取)', 
          '东森超声波清洗机', 
          '电热恒温水浴槽'
        ];
        return { ...item, checked: extractionInstruments.includes(item.name) };
      } else if (selectedOperation === 'CNAS') {
        const extractionInstruments = [
          '台式离心机 (右)', 
          '生物安全柜 (加样)', 
          '生物安全柜 (提取)', 
          '东森超声波清洗机', 
          '冰柜',
          '数字温湿度计',
          '数字温度计',
          '冰箱',
          '数字温度计',
          '电热恒温水浴槽',
          '震荡器Vortex',
          '电脑',
          '电脑显示器',
          '低温酒精玻璃液体温度计',
          'TianGen全波长分光光度计',
          '单人净化工作台',
          '数显恒温水浴锅',
        ];
        return { ...item, checked: extractionInstruments.includes(item.name) };
        // return { ...item, checked: item.name === '台式离心机（左）' };
      } else {
        return item;
      }
    });
  },

  toggleInstrument(e) {
    const id = e.currentTarget.dataset.id;
    const instruments = this.data.instruments.map(item => {
      if (item.id === id && !item.isLocked) {
        const newChecked = !item.checked;
        if (item.name === '房间2') {
          // 更新 showOnlyRoom 状态
          this.setData({ showOnlyRoom: newChecked });
        }
        return { ...item, checked: newChecked };
      }
      return item;
    });
    this.setData({ instruments });
  },

  submitSelection() {

    if (!this.data.realName) {
      wx.showToast({
        title: '未获取到用户姓名',
        icon: 'none'
      });
      return;
    }

    const room2 = this.data.instruments.find(item => item.name === '房间2');
    const roomStatus = room2.checked ? '离开' : '进入';


    this.setCurrentDateTime();
      // // 创建符合后端结构的数据对象
      const data = {
        room_id: 2, // 假设 room2.id 对应于 room_id
        operator_name: this.data.realName, // 用户的真实姓名
        room_status: roomStatus, // 房间状态
        operator_type: '', // 根据后续逻辑设定
        details: {} // 详细信息
      };
  
      if (roomStatus !== '离开') {
        const operationInstrument = this.data.instruments.find(i => i.name === '操作');
        if (operationInstrument) {
            data.operation_type = this.data.operationOptions[operationInstrument.selectedIndex] || '未选择';

            // 示例：你可能想要包括的额外详细信息
            data.details = {
                instrument_number: this.data.instruments.map(i => i.id),
                operation_date: new Date().toISOString(), // 如有必要，调整格式
            };
        }

        this.data.instruments.forEach(item => {
            if (item.name !== '房间2' && item.name !== '操作') {
                let status;
                if (item.name === '操作') {
                    status = this.data.operationOptions[item.selectedIndex] || '未选择';
                } else {
                    status = item.checked ? '是' : '否';
                }
                // 根据需求，你可能需要在此处向 `details` 添加更多数据
            }
        });
      }

    wx.showLoading({
      title: '正在提交...',
      mask: true
    });

    wx.request({
      // url: 'https://lab.guhejk.com/submit_instrument_usage',
      url: 'http://127.0.0.1:8000/api/wechat/v1/rooms/submit_room_record',
      method: 'POST',
      data: data,
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('accessToken'),
        'content-type': 'application/json'
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          this.setCurrentDateTime();
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500
          });
          // 设置定时器，2秒后更改状态
          setTimeout(() => {
            this.setData({ isSuccess: true }); // 2秒后设置 isSuccess 为 true
          }, 1000); // 2000毫秒=2秒
          setTimeout(() => {
            wx.showModal({
                title: '温馨提示',
                content: '表单已提交，请手动关闭小程序。',
                showCancel: false,
                confirmText: '确定',
                success: function(res) {
                    if (res.confirm) {
                        // 用户点击了确定
                    }
                }
              });
          }, 6000); // 2秒后显示提示框
        } else {
          wx.showToast({
            title: res.data.detail || '提交失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('提交失败:', error);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 处理核酸提取仪的弹框
  showDialogForInstrument(e) {
    // console.log('showDialogForInstrument called');
    this.setData({
      showDialog: true,
      dialogInstrumentName: e.currentTarget.dataset.name,
      serialNumber: '',
      testObject: ''
    });
    // console.log(this.data.showDialog);
  },

  hideDialog(e) {
    this.setData({
      showDialog: false
    });
  },

  stopPropagation(e) {
    e.stopPropagation();
  },

  inputSerialNumber(e) {
    this.setData({
      serialNumber: e.detail.value
    });
  },

  inputTestObject(e) {
    this.setData({
      testObject: e.detail.value
    });
  },

  submitInstrumentInfo() {
    const info = `${this.data.serialNumber} ${this.data.testObject}`.trim();
    this.setData({
      remarks: this.data.serialNumber + this.data.testObject,
      nucleicAcidExtractorInfo: info,
      showDialog: false,
    });
    console.log(this.data.remarks);
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });
  }

  

});


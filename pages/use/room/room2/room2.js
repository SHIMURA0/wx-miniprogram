Page({
  data: {
    instruments: [
      {
        name: '迷你离心机（EP管）',
        inUse: false,
        numbers: [
          {number: 'GHJC-EQ0017', inUse: false, remark: '', hasCNAS: true}
        ],
      },
      {
        name: '台式离心机（右）',
        inUse: false,
        numbers: [
          {number: 'GHJC-EQ0018', inUse: false, remark: '', hasCNAS: true}
        ]
      },
      {
        name: '生物安全柜（加样）',
        inUse: false,
        numbers: [
          {number: 'GHJC-EQ0019', inUse: false, remark: '', hasCNAS: true}
        ]
      },
      {
        name: '生物安全柜（提取）',
        inUse: false,
        numbers: [
          {number: 'GHJC-EQ0020', inUse: false, remark: '', hasCNAS: true}
        ]
      },
      {
        name: '东森超声波清洗机',
        inUse: false,
        numbers: [
          {number: 'GHJC-EQ0021', inUse: false, remark: '', hasCNAS: true}
        ]
      },
      {
        name: '电热恒温水浴槽',
        inUse: false,
        numbers: [
          {number: 'GHJC-EQ0024', inUse: false, remark: '', hasCNAS: true}
        ]
      },
      {
        name: '电脑',
        inUse: false,
        numbers: [
          {number: 'GHJC-EQ0029', inUse: false, remark: '', hasCNAS: true}
        ]
      },
      {
        name: '电脑显示器',
        inUse: false,
        numbers: [
          {number: 'GHJC-EQ0030', inUse: false, remark: '', hasCNAS: true}
        ]
      },
      {
        name: '台式离心机（左）',
        inUse: false,
        numbers: [
          {number: 'GHJC-EQ0032', inUse: false, remark: ''}
        ]
      },
      {
        name: '96道手动手动移液工作站',
        inUse: false,
        numbers: [
          {number: 'GHJC-EQ0033', inUse: false, remark: ''}
        ]
      },

      {
        name: '迷你微孔板离心机（96孔板）',
        inUse: false,
        numbers: [
          {number: 'GHJC-EQ0034', inUse: false, remark: ''}
        ]
      },

      {
        name: '移液器',
        inUse: true,
        numbers: [
          { number: 'GHJC-YYQ0004', inUse: false, remark: '', hasCNAS: true },
          { number: 'GHJC-YYQ0005', inUse: false, remark: '', hasCNAS: true },
          { number: 'GHJC-YYQ0006', inUse: false, remark: '', hasCNAS: true },
          { number: 'GHJC-YYQ0007', inUse: true, remark: '' },
          { number: 'GHJC-YYQ0008', inUse: true, remark: '' },
          { number: 'GHJC-YYQ0013', inUse: true, remark: '' },
          { number: 'GHJC-YYQ0014', inUse: true, remark: '' },
          { number: 'GHJC-YYQ0016', inUse: true, remark: '' },
          { number: 'GHJC-YYQ0020', inUse: true, remark: '' },
          { number: 'GHJC-YYQ0021', inUse: true, remark: '' },
          { number: 'GHJC-YYQ0022', inUse: true, remark: '' },
          { number: 'GHJC-YYQ0023', inUse: true, remark: '' },
          
        ]
      },

      {
        name: '核酸提取仪',
        inUse: false,
        numbers: [
          { number: 'GHJC-EQ0146', inUse: false, remark: '' },
          { number: 'GHJC-EQ0152', inUse: false, remark: '' },
          { number: 'GHJC-EQ0153', inUse: false, remark: '' }
        ]
      },

      {
        name: 'TianGen全波长分光光度计',
        inUse: false,
        numbers: [
          {number: 'GHJC-EQ0035', inUse: false, remark: '', hasCNAS : true}
        ]
      },


      {
        name: '震荡器 Vortex',
        inUse: false,
        numbers: [
          { number: 'GHJC-EQ0025', inUse: false, remark: '', hasCNAS: true },
          { number: 'GHJC-EQ0156', inUse: false, remark: '', hasCNAS: true },
        ]
      },

      // {
      //   name: '冰柜',
      //   inUse: false,
      //   numbers: [
      //     {number: 'GHJC-EQ0022', inUse: false, remark: '', hasCNAS: true}
      //   ]
      // },

      // {
      //   name: '数字温湿度计（冰柜）',
      //   inUse: false,
      //   numbers: [
      //     {number: 'GHJC-EQ0026', inUse: false, remark: '', hasCNAS: true}
      //   ]
      // },

      // {
      //   name: '数字温度计（冰柜）',
      //   inUse: false,
      //   numbers: [
      //     {number: 'GHJC-EQ0027', inUse: false, remark: '', hasCNAS: true}
      //   ]
      // },

      // {
      //   name: '冰箱',
      //   inUse: false,
      //   numbers: [
      //     {number: 'GHJC-EQ0023', inUse: false, remark: '', hasCNAS: true}
      //   ]
      // },

      // {
      //   name: '数字温度计（冰箱）',
      //   inUse: false,
      //   numbers: [
      //     {number: 'GHJC-EQ0028', inUse: false, remark: '', hasCNAS: true}
      //   ]
      // },

      // {
      //   name: '低温酒精玻璃液体温度计',
      //   inUse: false,
      //   numbers: [
      //     {number: 'GHJC-EQ0031', inUse: false, remark: '', hasCNAS: true}
      //   ]
      // },

      // {
      //   name: '单人净化工作台',
      //   inUse: false,
      //   numbers: [
      //     {number: 'GHJC-EQ0159', inUse: false, remark: '', hasCNAS: true}
      //   ]
      // },
      // {
      //   name: '数显恒温水浴锅',
      //   inUse: false,
      //   numbers: [
      //     {number: 'GHJC-EQ0117', inUse: false, remark: '', hasCNAS: true}
      //   ]
      // },
      {
        name: '12道移液器',
        inUse: false,
        numbers: [
          {number: 'GHJC-YYQ0009', inUse: false, remark: ''},
          {number: 'GHJC-YYQ0010', inUse: false, remark: ''},
          {number: 'GHJC-YYQ0011', inUse: false, remark: ''},
          // {number: 'GHJC-YYQ0015', inUse: false, remark: ''},
          {number: 'GHJC-YYQ0017', inUse: false, remark: ''},
          // {number: 'GHJC-YYQ0018', inUse: false, remark: ''},
          {number: 'GHJC-YYQ0019', inUse: false, remark: ''}
        ]
      },
    ],
    // 在离开房间的时候要检查的仪器（包括是否清洁/是否紫外线消毒30分钟）
    check_instruments: [
      {
        name: '台式离心机（右）',
        inUse: true,
        numbers: [
          {number: '是否清洁', inUse: true, hasCNAS: true}
          // {number: '是否紫外消毒30分钟', inUse: true}
        ]
      },
      {
        name: '台式离心机（左）',
        inUse: true,
        hasCNAS: true,
        numbers: [
          {number: '是否清洁', inUse: true}
          // {number: '是否紫外消毒30分钟', inUse: true}
        ]
      },
      {
        name: '生物安全柜(加样)',
        inUse: true,
        numbers: [
          {number: '是否清洁', inUse: true, hasCNAS: true},
          {number: '是否紫外消毒30分钟', inUse: true, hasCNAS: true}
        ]
      },
      {
        name: '生物安全柜(提取)',
        inUse: true,
        numbers: [
          {number: '是否清洁', inUse: true, hasCNAS: true},
          {number: '是否紫外消毒30分钟', inUse: true, hasCNAS: true}
        ]
      },
      {
        name: '核酸提取仪（GHJC-EQ0146）',
        inUse: true,
        numbers: [
          {number: '是否清洁', inUse: true},
          {number: '是否紫外消毒30分钟', inUse: true}
        ]
      },
      {
        name: '核酸提取仪（GHJC-EQ0152）',
        inUse: true,
        numbers: [
          {number: '是否清洁', inUse: true},
          {number: '是否紫外消毒30分钟', inUse: true}
        ]
      },
      {
        name: '核酸提取仪（GHJC-EQ0153）',
        inUse: true,
        numbers: [
          {number: '是否清洁', inUse: true},
          {number: '是否紫外消毒30分钟', inUse: true}
        ]
      },
      
    ],

      // 其他仪器...
    preselectedInstruments: [],
    showDialog: false,
    operatorName : '',
    operation : '',
    process : '',
    currentDateTime : "", // 当前的时间，用于实时更新报告提交的时间点,
    processMap : {
      'extraction': '提取',
      'culture': '培养',
      'CNAS': 'CNAS',
      'daily': '日常',
    },
    if_submit : false, 
  },

  onLoad: function(options) {
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    // 从页面参数中获取流程
    const process = options.process || '';
    this.setData(
      { 
        operatorName : userInfo.real_name,
        process : this.data.processMap[process],
        operation : options.operation
      }
    );
    this.preSelectInstruments(process);
  },

  // 根据传入的流程参数，预先选定一些流程要用到的仪器
  preSelectInstruments: function(process) {
    // 定义流程与仪器/编号的映射
    const processMap = {
      // CNAS
      'CNAS': [
        { 
          name: '移液器', 
          numbers: [
            'GHJC-YYQ0004',
            'GHJC-YYQ0005',
            'GHJC-YYQ0006',
          ] 
        },
        { name: '迷你离心机（EP管）', numbers: ['GHJC-EQ0017'] },
        { name: '台式离心机（右）', numbers: ['GHJC-EQ0018'] },
        { name: '生物安全柜（提取）', numbers: ['GHJC-EQ0020'] },
        { name: '东森超声波清洗机', numbers: ['GHJC-EQ0021'] },
        { name: '电热恒温水浴槽', numbers: ['GHJC-EQ0024'] },
        { name: '电脑', numbers: ['GHJC-EQ0029'] },
        { name: '电脑显示器', numbers: ['GHJC-EQ0030'] },
      ],
      // 提取
      'extraction': [
        { name: '迷你离心机（EP管）', numbers: ['GHJC-EQ0017'] },
        { name: '台式离心机（右）', numbers: ['GHJC-EQ0018'] },
        { name: '生物安全柜（加样）', numbers: ['GHJC-EQ0019'] },
        { name: '生物安全柜（提取）', numbers: ['GHJC-EQ0020'] },
        { name: '东森超声波清洗机', numbers: ['GHJC-EQ0021'] },
        { name: '电热恒温水浴槽', numbers: ['GHJC-EQ0024'] },
        { name: '电脑', numbers: ['GHJC-EQ0029'] },
        { name: '电脑显示器', numbers: ['GHJC-EQ0030'] },
        { name: '台式离心机（左）', numbers: ['GHJC-EQ0032'] },
        { name: '96道手动手动移液工作站', numbers: ['GHJC-EQ0033'] },
        { name: '迷你微孔板离心机（96孔板）', numbers: ['GHJC-EQ0034'] },
        { 
          name: '移液器', 
          numbers: [
            // 'GHJC-YYQ0004',
            // 'GHJC-YYQ0005',
            // 'GHJC-YYQ0006',
            'GHJC-YYQ0007',
            'GHJC-YYQ0008',
            'GHJC-YYQ0013',
            'GHJC-YYQ0014',
            'GHJC-YYQ0016',
            'GHJC-YYQ0020',
            'GHJC-YYQ0021',
            'GHJC-YYQ0022',
            'GHJC-YYQ0023',
          ] 
        },
        { 
          name: '12道移液器', 
          numbers: [
            'GHJC-YYQ0009',
            'GHJC-YYQ0010',
            'GHJC-YYQ0011',
            'GHJC-YYQ0015',
            'GHJC-YYQ0017',
            'GHJC-YYQ0018',
            'GHJC-YYQ0019',
          ]}
      ],
      // 培养
      'culture': [
        { name: '数显恒温水浴锅', numbers: ['GHJC-EQ0117'] },
        { name: '单人净化工作台', numbers: ['GHJC-EQ0159'] }
      ],
      // 日常
      'daily': [],
      // ... 其他流程
      
    };

    const selectedInstruments = processMap[process] || [];

    let instruments = this.data.instruments.map(instrument => {
      const selected = selectedInstruments.find(item => item.name === instrument.name);
      if (selected) {
        instrument.inUse = true;
        instrument.numbers = instrument.numbers.map(number => {
          number.inUse = selected.numbers.includes(number.number);
          return number;
        });
      } else {
        instrument.inUse = false;
        instrument.numbers.forEach(number => number.inUse = false);
      }
      return instrument;
    });

    this.setData({ instruments });

    // 在设置 instruments 后，获取预选的仪器列表
    const preselected = instruments
      .filter(instrument => instrument.inUse)
      .map(instrument => instrument.name);

    this.setData({ 
      instruments: instruments,
      preselectedInstruments: preselected
    }, () => {
      // 在数据更新完成后执行
      // console.log(this.data.preselectedInstruments);
      this.showDialog();
      });
  },

  showDialog: function() {
    if (this.data.operation === 'enter') {
      console.log(this.data.preselectedInstruments);
      this.setData({ 
        showDialog: true
      });
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    }
  },

  closeDialog: function() {
    this.setData({ 
      showDialog: false
    });
  },

  preventTouchMove: function() {
    // 防止背景滚动
    return false;
  },


  toggleUsage: function(e) {
    if (this.data.operation !== 'leave') {
      const { index } = e.currentTarget.dataset;
      const isChecked = e.detail.value;
      
      let instruments = this.data.instruments;
      instruments[index].inUse = isChecked;

      // 只有当仪器开关被关闭时，才自动关闭所有编号的开关
      if (!isChecked) {
        instruments[index].numbers.forEach(number => {
          number.inUse = false;
        });
      }

      this.setData({ instruments });

      console.log(`Instrument ${instruments[index].name} usage toggled to ${isChecked}`);
    } else {
      const { index } = e.currentTarget.dataset;
      const isChecked = e.detail.value;
      
      let check_instruments = this.data.check_instruments;
      check_instruments[index].inUse = isChecked;

      // 只有当仪器开关被关闭时，才自动关闭所有编号的开关
      if (!isChecked) {
        check_instruments[index].numbers.forEach(number => {
          number.inUse = false;
        });
      }

      this.setData({ check_instruments });

      console.log(`Instrument ${check_instruments[index].name} usage toggled to ${isChecked}`);
    }
    
  },


  toggleNumberUsage: function(e) {
    if (this.data.operation !== 'leave') {
      const { instrumentIndex, numberIndex } = e.currentTarget.dataset;
      const isChecked = e.detail.value;
      
      let instruments = this.data.instruments;
      instruments[instrumentIndex].numbers[numberIndex].inUse = isChecked;

      // 如果有任何编号被打开，自动打开仪器开关
      if (isChecked) {
        instruments[instrumentIndex].inUse = true;
      } else {
        // 如果所有编号都被关闭，自动关闭仪器开关
        const allNumbersClosed = instruments[instrumentIndex].numbers.every(number => !number.inUse);
        if (allNumbersClosed) {
          instruments[instrumentIndex].inUse = false;
        }
      }

      this.setData({ instruments });

      console.log(`Instrument ${instruments[instrumentIndex].name}, Number ${numberIndex + 1} usage toggled to ${isChecked}`);
    } else {
      const { instrumentIndex, numberIndex } = e.currentTarget.dataset;
      const isChecked = e.detail.value;
      
      let check_instruments = this.data.check_instruments;
      check_instruments[instrumentIndex].numbers[numberIndex].inUse = isChecked;

      // 如果有任何编号被打开，自动打开仪器开关
      if (isChecked) {
        check_instruments[instrumentIndex].inUse = true;
      } else {
        // 如果所有编号都被关闭，自动关闭仪器开关
        const allNumbersClosed = check_instruments[instrumentIndex].numbers.every(number => !number.inUse);
        if (allNumbersClosed) {
          check_instruments[instrumentIndex].inUse = false;
        }
      }

      this.setData({ check_instruments });
    }
  },

  updateRemark: function(e) {
    const { instrumentIndex, numberIndex } = e.currentTarget.dataset;
    const remark = e.detail.value;
    
    let instruments = this.data.instruments;
    instruments[instrumentIndex].numbers[numberIndex].remark = remark;

    this.setData({ instruments });
  },

  // 获得当前的时间
  setCurrentDateTime: function () {
    const now = new Date();
    const formattedDateTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    this.setData({
      currentDateTime: formattedDateTime
    });
  },

  submitForm: function() {
    // 在这里处理表单提交逻辑
    this.setCurrentDateTime();
    // 可以在这里添加数据验证、发送到服务器等操作
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    });
    this.submitToBackend();
  },

  // 提交到后端的数据函数
  submitToBackend: function() {

    let formData = {
      room_id : 2,
      operator_name : this.data.operatorName,
      room_status : this.data.operation === 'enter' ? '进入房间' : '离开房间',
      operation_type : this.data.operation === 'enter' ? this.data.process : '',
      details: {
        operation_date: this.data.currentDateTime,
        instruments_used : this.data.operation === 'enter' ? {} : ''
      }
    };
    if (this.data.operation === 'enter') {
      // 遍历所有仪器
      this.data.instruments.forEach(instrument => {
        if (instrument.inUse) {
          let usedNumbers = instrument.numbers.filter(num => num.inUse);
          
          if (usedNumbers.length > 0) {
            if (instrument.numbers.length === 1) {
              // 如果仪器只有一个编号
              formData.details.instruments_used[instrument.name] = usedNumbers[0].number;
            } else {
              // 检查是否有任何编号带有备注
              let hasRemarks = usedNumbers.some(num => num.remark && num.remark.trim() !== '');
              
              if (hasRemarks) {
                // 如果有备注，创建一个包含编号和备注的对象
                let numberWithRemarks = {};
                usedNumbers.forEach(num => {
                  numberWithRemarks[num.number] = num.remark ? num.remark.trim() : '';
                });
                formData.details.instruments_used[instrument.name] = numberWithRemarks;
              } else {
                // 如果没有备注，只返回编号列表
                formData.details.instruments_used[instrument.name] = usedNumbers.map(num => num.number);
              }
            }
          }
        }
      });
    }

    console.log("Sending data to backend:", formData);
    wx.request({
      url: 'https://lab.guhejk.com/api/wechat/v1/rooms/submit_room_record',
      method: 'POST',
      data: formData,
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('accessToken'),
        'content-type': 'application/json'
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 3000
          });
          // 可以在这里添加成功后的操作，比如重置表单或返回上一页
          this.setData({if_submit : true});
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
          }, 1200); // 2秒后显示提示框
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

});











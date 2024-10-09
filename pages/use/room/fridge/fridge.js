Page({
  // 初始化数据
  data: {
    currentDateTime: "", // 当前的时间，用于实时更新报告提交的时间点
    roomNumber: '',  // 仪器所在房间
    freezerFridge: '',  // 传入的参数，用来指定是冰柜还是冰箱，然后对页面进行条件渲染

    // 冷冻设备的状态
    iceStatus: ['正常', '异常'],
    iceStatusIndex: null,

    freezerNumber: '',  // 冰柜编号，以参数的形式传入
    fridgeNumber: '',  // 冰箱编号
    statuses: ['正常', '异常'],
    statusIndex: null,
    showAbnormalModal: false,
    abnormalDescription: '',

    // 温湿度计
    // th是thermo-hygrometer的缩写，湿温度计的意思
    thNumber: '',  // 温湿度计编号
    thStatus: ['正常', '异常'],  //湿温度计的状态选择
    thStatusIndex: null,
    thInput: '',  // 温湿度计正常状态下的读数
    thBackUpInput: '',  // 温湿度计异常状态下，备用的温湿度计读数

    // 温度计
    tNumber: '',  // 温度计编号
    tStatus: ['正常', '异常'],
    tStatusIndex: null,
    tInput: '',  // 正常状态下温度计读数
    tBackUpInput: '',  // 温度计异常状态下，备用的温度计读数
    
    // 实验操作员
    operatorName: "",
    // 备注
    remarks: "",
    // 选定的仪器
    selectedInstrument: "测序仪",
    // 弹出的确认数据是否已经被备份的
    showBackupModal: false,
    isBackupConfirmed: false,
    backupRadioValue: '0', // 新增：用于控制单选按钮的值
    // 判断是否测序
    canSubmitForm: true,
    showConfirmModal: false,
    // isValid: false,
    // 扫码登录功能所求要的数据
    userInfo: null,
    showNameInput: false,
    isLoading: true

  },

  // 在加载该页面时候要调用的函数
  onLoad: function (options) {
    this.setCurrentDateTime();
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    this.setData({
      operatorName : userInfo.real_name,
      isValid: false // 初始化表单为无效状态
    })
    // 接收传入的参数
    let parameters = options;
    if (options.params) {
      try {
        // 尝试解码传入的参数
        parameters = JSON.parse(decodeURIComponent(options.params));
      } catch (error) {
        console.error('Failed to parse params:', error);
      }
    }
    this.setData({ parameters }, () => {
      console.log('Params set in data:', this.data.parameters);
      this.handleParameters();
    });
    // this.checkFormValidity();
  },

  // 处理传入的参数
  handleParameters: function () {
    const params = this.data.parameters;
    const roomMap = new Map([
      ['2', 'II样品处理室'],
      ['3', 'IIIPCR扩增室'],
      ['4', 'Ⅳ分析检测室'],
      ['5', 'Ⅴ样本接收间'],
      ['11', 'Ⅺ低温保存室'],
      ['yf', 'YF研发实验室'],
      // 可以继续添加更多的映射
    ]);
    // 传入两个参数
    this.setData({
      freezerFridge: params.freezerFridge,
      roomNumber: roomMap.get(params.roomNumber),
    });

    if (params.hasOwnProperty('thNumber')) {
      // 如果传入了温湿度计参数
      this.setData({thNumber : params.thNumber});
    }

    if (params.hasOwnProperty('tNumber')) {
      // 如果传入了温度计参数
      this.setData({tNumber : params.tNumber});
    }

    if (params.freezerFridge === 'freezer') {
      // 如果选定为冰柜
      this.setData({
        freezerNumber: params.freezerNumber,
      });
    } else {
      // 如果选定为冰箱
      this.setData({
        fridgeNumber: params.fridgeNumber,
      });
    }
    this.checkFormValidity();
  },

  // 获得当前的时间
  setCurrentDateTime: function () {
    const now = new Date();
    const formattedDateTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    this.setData({
      currentDateTime: formattedDateTime
    });
  },

  // 控制冰柜状态的下拉选项函数，当选择状态为异常时，应弹出填写框填写具体冰柜/冰箱异常表现
  bindIceStatusChange: function(e) {
    const selectedIndex = e.detail.value;
    const selectedStatus = this.data.iceStatus[selectedIndex];
    let showModal = false;

    if (selectedStatus === '异常') {
      showModal = true;
    }

    this.setData({
      iceStatusIndex: selectedIndex,
      showAbnormalModal: showModal
    });

    this.checkFormValidity();
  },

  inputAbnormalDescription(e) {
    this.setData({ 
      abnormalDescription: e.detail.value 
    });
    this.checkFormValidity();
  },

  submitAbnormalDescription() {
    const { abnormalDescription } = this.data;
    const remarkText = `异常：${abnormalDescription}`;
    
    this.setData({
      remarks: remarkText,
      showAbnormalModal: false,
    });
    this.checkFormValidity();
  },

  bindtthStatusChange: function(e) {
    const selectedtIndex = e.detail.value;
    this.setData({
      thStatusIndex: selectedtIndex,
    })
    this.checkFormValidity();
  },

  // 控制温湿度计的读数输入框函数
  inputth: function (e) {
    this.setData({
      thInput: e.detail.value
    });
    // 用户输入完后，检查表单的可提交性
    this.checkFormValidity();
  },

  // 控制温度计的读数输入框函数
  inputT: function (e) {
    this.setData({
      tInput: e.detail.value
    });
    // 用户输入完后，检查表单的可提交性
    this.checkFormValidity();
  },

  // 控制温湿度计的读数输入框函数
  inputthBackUp: function (e) {
    this.setData({
      thBackUpInput: e.detail.value
    });
    // 用户输入完后，检查表单的可提交性
    this.checkFormValidity();
  },

  // 控制温湿度计的读数输入框函数
  inputTBackUp: function (e) {
    this.setData({
      tBackUpInput: e.detail.value
    });
    // 用户输入完后，检查表单的可提交性
    this.checkFormValidity();
  },

  bindtStatusChange: function(e) {
    const selectedtIndex = e.detail.value;
    this.setData({
      tStatusIndex: selectedtIndex
    })
    this.checkFormValidity();
  },

  inputRemarks: function (e) {
    this.setData({
      remarks: e.detail.value
    });
    this.checkFormValidity();
  },

  // 表单提交函数
  submitForm: function () {
    this.setCurrentDateTime();
    this.checkFormValidity();
    let confirmContent = this.generateConfirmContent();
    this.setData({
      showConfirmModal: true,
      confirmContent: confirmContent
    });
  },
  
  // 最终确认的提示框中的内容生成
  generateConfirmContent: function() {
    let content = []; // 使用数组来存储内容，方便后续处理
  
    const addLine = (label, value) => {
      content.push(`<div><b>${label}：</b>${value}</div>`);
    };

    addLine('操作人员', this.data.operatorName);
    addLine('实验房间', this.data.roomNumber);
    addLine('冷冻设备', this.data.freezerFridge === 'freezer' ? '冰柜' : '冰箱');

    if (this.data.freezerFridge === 'freezer') {
      // 如果选定的为冰柜
      addLine('冰柜编号', this.data.freezerNumber);
      addLine('冰柜状态', this.data.iceStatus[this.data.iceStatusIndex]);
    } else {
      addLine('冰箱编号', this.data.fridgeNumber);
      addLine('冰箱状态', this.data.iceStatus[this.data.iceStatusIndex]);
    }

    if (this.data.iceStatus[this.data.iceStatusIndex] === '异常') {
      // 如果冰柜/冰箱状态为异常
      addLine('备注', this.data.remarks);
    } else {
      // 如果冰柜/冰箱状态为正常
      if (this.data.thNumber) {
        addLine('温湿度计编号', this.data.thNumber);
        addLine('温湿度计状态', this.data.thStatus[this.data.thStatusIndex]);
        if (this.data.thStatus[this.data.thStatusIndex] === '异常') {
          addLine('温湿度计状态', `编号为${this.data.thNumber}的温湿度计异常，已使用备用温湿度计`);
          addLine('备用温湿度计读数', this.data.thBackUpInput);
        } else {
          addLine('温湿度计读数', this.data.thInput);
        }
      }
  
      if (this.data.tNumber) {
        addLine('温度计编号', this.data.tNumber);
        addLine('温度计状态', this.data.tStatus[this.data.tStatusIndex]);
        if (this.data.tStatus[this.data.tStatusIndex] === '异常') {
          addLine('温度计状态', `编号为${this.data.tNumber}的温湿度计异常，已使用备用温度计`);
          addLine('备用温度计读数', this.data.tBackUpInput);
        } else {
          addLine('温度计读数', this.data.tInput);
        }
      }

      // 只有当备注非空时才添加备注到最终确认表单中
      if (this.data.remarks.trim() !== '') {
        addLine('备注', this.data.remarks);
      }
    }

    addLine('操作日期', this.data.currentDateTime);

    return content.join('');
  },

  // 提交到后端的数据函数
  submitToBackend: function() {

    let formData = {
      instrument_code: this.data.freezerFridge === 'freezer' ? this.data.freezerNumber : this.data.fridgeNumber,  // 仪器编号
      instrument: this.data.freezerFridge === 'freezer' ? '冰柜' : '冰箱',  // 仪器名称
      instrument_status: this.data.iceStatus[this.data.iceStatusIndex],  // 仪器状态
      operator_name: this.data.operatorName,  // 操作人员
      details: {},  // 详细信息
    };

    if (this.data.thNumber) {
      if (this.data.tNumber) {
        formData.details.bond_instruments = '温湿度计 + 温度计';  // 绑定的附属仪器
      } else {
        formData.details.bond_instruments = '温湿度计';  // 绑定的附属仪器
      }
    } else {
      if (this.data.tNumber) {
        formData.details.bond_instruments = '温度计';  // 绑定的附属仪器
      }
    }

    if (this.data.iceStatus[this.data.iceStatusIndex] === '正常') {
      // 如果冰柜/冰箱状态为正常
      if (this.data.thNumber) {
        // 如果传入了温湿度计
        formData.details.th_number = this.data.thNumber;
        if (this.data.thStatus[this.data.thStatusIndex] === '正常') {
          formData.details.th_status = this.data.thStatus[this.data.thStatusIndex];
          formData.details.th_value = this.data.thInput;
        } else {
          formData.details.th_status = `编号为${this.data.thNumber}的温湿度计异常，已使用备用温湿度计`;
          formData.details.th_backup_value = this.data.thBackUpInput;
        }
      }

      if (this.data.tNumber) {
        // 如果传入了温度计
        formData.details.t_number = this.data.tNumber;
        if (this.data.tStatus[this.data.tStatusIndex] === '正常') {
          formData.details.t_status = this.data.tStatus[this.data.tStatusIndex];
          formData.details.t_value = this.data.tInput;
        } else {
          formData.details.t_status = `编号为${this.data.tNumber}的温度计异常，已使用备用温湿度计`;
          formData.details.t_backup_value = this.data.tBackUpInput;
        }
      }

    } else {
      // 如果冰柜/冰箱状态为异常
      formData.details.remarks = this.data.remarks;  // 备注（其中包含异常信息）
    }
    formData.details.operation_date = this.data.currentDateTime;  // 操作时间

    console.log("Sending data to backend:", formData);
    wx.request({
      url: 'https://lab.guhejk.com/api/wechat/v1/instruments/submit_instrument_usage_record',
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
            duration: 2000
          });
          // 可以在这里添加成功后的操作，比如重置表单或返回上一页
          this.resetForm();
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
  
  closeConfirmModal: function() {
    this.setData({
      showConfirmModal: false,
      operationIndex: null, // 重置操作选择
      canSubmitForm: true
    });
    this.checkFormValidity();
  },
  
  inputAbnormalDescription(e) {
    this.setData({ 
      abnormalDescription: e.detail.value 
    });
    this.checkFormValidity();
  },

  submitAbnormalDescription() {
    const { abnormalDescription } = this.data;
    const remarkText = `异常：${abnormalDescription}`;
    
    this.setData({
      remarks: remarkText,
      showAbnormalModal: false,
    });
  
    this.checkFormValidity();
  },

  inputRemarks(e) {
    this.setData({ remarks: e.detail.value });
    this.checkFormValidity();
  },

  finalSubmit: function() {
    const formData = {
      dateTime: this.data.currentDateTime,
      operation: this.data.operations[this.data.operationIndex],
      status: this.data.statuses[this.data.statusIndex],
      instrument: this.data.selectedInstrument,
      slotType: this.data.thStatus[this.data.slotTypeIndex],
      chipSequence: this.data.chipSequence,
      operator: this.data.operatorName,
      remarks: this.data.remarks
    };
    console.log('提交的表单数据：', formData);
  
    this.setData({
      showConfirmModal: false
    });
    // this.resetForm();
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    });
  },

  // 检查必要的信息是否都已经填入，决定表单下面的提交按钮是否被点亮
  checkFormValidity() {
    console.log('Checking form validity');
    const {
      freezerFridge,
      operatorName,
      roomNumber,
      freezerNumber,
      fridgeNumber,
      iceStatus,
      iceStatusIndex,
      thNumber,
      thStatus,
      thStatusIndex,
      thInput,
      thBackUpInput,
      tNumber,
      tStatus,
      tStatusIndex,
      tInput,
      tBackUpInput,
      currentDateTime,
      remarks
    } = this.data;
  
    let isValid = false;

    isValid = operatorName !== '' &&  // 操作人员不为空
              roomNumber  !== '' &&  // 房间变好不为空
              currentDateTime !== '' &&  // 操作日期不为空 
              iceStatusIndex !== null;  // 冰柜/冰箱状态选择不为空
    
    if (freezerFridge === 'freezer') {
      // 如果是选择的是冰柜
      isValid = isValid && freezerNumber !== '';  // 冰柜仪器编号不为空
    } else {
      // 如果选择的是冰箱
      isValid = isValid && fridgeNumber !== '';  // 冰箱仪器编号不为空
    }

    if (iceStatus[iceStatusIndex] === '异常') {
      isValid = isValid && 
                remarks.trim() !== '';  // 如果冰柜/冰箱状态为异常，则备注不为空
    } else {
      if (thNumber) {
        // 如果传入了温湿度计编号
        isValid = isValid && 
                  thNumber !== '' &&  // 温湿度计仪器编号不为空
                  thStatusIndex !== null;  // 温湿度计状态选择不为空
        if (thStatus[thStatusIndex] === '异常') {
          isValid = isValid && 
                    thBackUpInput !== '';  // 如果温湿度计异常，备用的温湿度计读数不为空
        } else {
          isValid = isValid && 
                    thInput !== '';  // 如果温湿度计正常，则读数不为空
        }
      }
  
      if (tNumber) {
        // 如果传入了温度计编号
        isValid = isValid && 
                  tNumber !== '' &&  // 温度计仪器编号不为空
                  tStatusIndex !== null;  // 温度计状态选择不为空
        if (tStatus[tStatusIndex] === '异常') {
          isValid = isValid && 
                    tBackUpInput !== '';  // 温度计状态异常时，备用温度计读数不为空
        } else {
          isValid = isValid && 
                    tInput !== '';  // 温度计状态正常时，温度计读数不为空
        }
      }
    }

    this.setData({ isFormValid: isValid });
    console.log('Form validity:', isValid); 
  },

  // 重置表单函数
  resetForm: function() {
    this.setData({
      currentDateTime: "", // 当前的时间，用于实时更新报告提交的时间点
      roomNumber: '',  // 仪器所在房间
      freezerFridge: '',  // 传入的参数，用来指定是冰柜还是冰箱，然后对页面进行条件渲染

      // 冷冻设备的状态
      iceStatus: ['正常', '异常'],
      iceStatusIndex: null,

      freezerNumber: '',  // 冰柜编号，以参数的形式传入
      fridgeNumber: '',  // 冰箱编号
      statuses: ['正常', '异常'],
      statusIndex: null,
      showAbnormalModal: false,
      abnormalDescription: '',

      // 温湿度计
      // th是thermo-hygrometer的缩写，湿温度计的意思
      thNumber: '',  // 温湿度计编号
      thStatus: ['正常', '异常'],  //湿温度计的状态选择
      thStatusIndex: null,
      thInput: '',  // 温湿度计正常状态下的读数
      thBackUpInput: '',  // 温湿度计异常状态下，备用的温湿度计读数

      // 温度计
      tNumber: '',  // 温度计编号
      tStatus: ['正常', '异常'],
      tStatusIndex: null,
      tInput: '',  // 正常状态下温度计读数
      tBackUpInput: '',  // 温度计异常状态下，备用的温度计读数
      
      // 实验操作员
      operatorName: "",
      // 备注
      remarks: "",
      // 判断是否测序
      canSubmitForm: true,
      showConfirmModal: false,
      // 扫码登录功能所求要的数据
      userInfo: null,
    }, () => {
      this.checkFormValidity();
    });
  },

  bindNonSeqOperationChange: function(e) {
    this.setData({
      nonSeqOperationIndex: e.detail.value
    });
    this.checkFormValidity();
  },

  bindNonSeqStatusChange: function(e) {
    this.setData({
      nonSeqStatusIndex: e.detail.value
    });
    this.checkFormValidity();
  },

  inputOperationReason: function(e) {
    this.setData({
      operationReason: e.detail.value
    });
    this.checkFormValidity();
  },

  closeConfirmModal: function() {
    this.setData({
      showConfirmModal: false
    });
  },
  
  // 最终确认信息的确认提交按钮函数
  confirmSubmit: function() {
    wx.showLoading({
      title: '提交中...',
    });
  
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 200
      });
      this.setData({
        showConfirmModal: false
      });
      this.submitToBackend();
      this.resetForm();
    }, 200);
  },
  
   
});
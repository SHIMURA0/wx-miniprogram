Page({
  // 初始化数据
  data: {
    currentDateTime: "", // 当前的时间，用于实时更新报告提交的时间点
    selectedInstrument: '超净工作台',  //选定仪器（锁定）为超净工作台
    selectedInstrumentNumber: 'GHJC-EQ0159',  //选定仪器的编号（锁定）为GHJC-EQ0159
    boundInstrument: '数显恒温水浴锅',  // 绑定的仪器（锁定）为数显恒温水浴锅
    boundInstrumentNumber: 'GHJC-EQ0117',  // 绑定仪器的编号（锁定）为GHJC-EQ0117
    operationStatus: ['开始', '结束'],  // 超净工作台的操作状态，分为（开始/结束）
    operationStatusIndex: null,
    workBenchStatus: ['正常', '异常'],  // 超净工作台状态
    workBenchStatusIndex: null,
    waterBathStatus: ['正常', '异常'],  // 水浴锅状态
    waterBathStatusIndex: null,
    cleanStatus: ['是'],
    cleanStatusIndex: null,
    uvStatus: ['是，已杀菌30分钟'],
    uvStatusIndex: null,
    showWorkBenchAbnormalModal: false,
    showWaterBathAbnormalModal: false,
    showAbnormalModal: false,  // 控制异常状态时的弹窗
    abnormalWorkBenchDescription: '',  // 超净工作台异常状态弹框内要填写的内容
    abnormalWaterBathDescription: '',  // 水浴锅异常状态弹框内要填写的内容
    operatorName: '',  // 实验操作员
    remarks: "",  // 备注
    showConfirmModal: false,
    isFormValid: false,
    // 扫码登录功能所求要的数据
    userInfo: null,
    // realName: '',
    showNameInput: false,
    isLoading: true
  },

  // 在加载该页面时候要调用的函数
  onLoad: function (options) {
    
    this.setCurrentDateTime();
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    this.setData({
      operatorName: userInfo.real_name,
      isValid: false // 初始化表单为无效状态
    })
  },

  // 获得当前的时间
  setCurrentDateTime: function () {
    const now = new Date();
    const formattedDateTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    this.setData({
      currentDateTime: formattedDateTime
    });
    this.checkFormValidity();
  },

  // 控制用户选择操作类型的函数
  operationStatusChange: function(e) {
    const selectedIndex = e.detail.value;
    const selectedStatus = this.data.operationStatus[selectedIndex];
    let showModal = false;

    if (selectedStatus === '异常') {
      showModal = true;
    }

    this.setData({
      operationStatusIndex: selectedIndex,
      showAbnormalModal: showModal
    });

    this.checkFormValidity();
  },

  // 超净工作台状态选择函数
  workBenchStatusChange: function(e) {
    const selectedIndex = e.detail.value;
    const selectedStatus = this.data.workBenchStatus[selectedIndex];
    let showModal = false;
    // 如果用户选择超净工作台的状态为异常，则需要弹窗填写具体的异常描述（下方的函数）
    if (selectedStatus === '异常') {
      showModal = true;
    }
    this.setData({
      workBenchStatusIndex: selectedIndex,  // 显示用户选择的超净工作台状态
      showWorkBenchAbnormalModal: showModal  
    });
    this.checkFormValidity();
  },

  // 超净工作台状态异常时，填写具体的异常描述函数
  inputAbnormalWorkBenchDescription(e) {
    this.setData({ 
      abnormalWorkBenchDescription: e.detail.value 
    });
    this.checkFormValidity();
  },

  cancelWorkBenchAbnormalDescription: function() {
    this.setData({
      showWorkBenchAbnormalModal: false,
    });
  },

  // 提交超净工作台异常表现的函数
  submitWorkBenchAbnormalDescription() {
    const { abnormalWorkBenchDescription,  abnormalWaterBathDescription} = this.data;
    if (abnormalWorkBenchDescription.trim()) {
      const remarkText = `超净工作台异常：${abnormalWorkBenchDescription}`;
      this.setData({
        remarks: `${remarkText};\n${abnormalWaterBathDescription ? `水浴锅异常：${abnormalWaterBathDescription}` : ''}`, // 保持水浴锅的异常描述
        // remarks: (this.data.remarks || '') + `${remarkText}\n`,
        showWorkBenchAbnormalModal: false,  // 在提交具体异常表现后，关闭弹窗
      });
    }
    this.checkFormValidity();  // 检查整体表单是否满足可以提交的条件
  },

  // 水浴锅状态选择函数
  waterBathStatusChange: function(e) {
    const selectedIndex = e.detail.value;
    const selectedStatus = this.data.waterBathStatus[selectedIndex];
    let showModal = false;
    // 如果用户选择水浴锅的状态为异常，则需要弹窗填写具体的异常描述（下方的函数）
    if (selectedStatus === '异常') {
      showModal = true;
    }
    this.setData({
      waterBathStatusIndex: selectedIndex,  // 显示用户选择的水浴锅状态
      showWaterBathAbnormalModal: showModal  
    });
    this.checkFormValidity();
  },

  // 水浴锅状态异常时，填写具体的异常描述函数
  inputAbnormalWaterBathDescription(e) {
    this.setData({ 
      abnormalWaterBathDescription: e.detail.value 
    });
    this.checkFormValidity();
  },

  // 处理取消按钮点击事件
  cancelWaterBathAbnormalDescription: function() {
    this.setData({
        showWaterBathAbnormalModal: false,
    });
  },

  // 提交水浴锅异常表现的函数
  submitWaterBathAbnormalDescription() {
    const { abnormalWorkBenchDescription, abnormalWaterBathDescription} = this.data;
    if (abnormalWaterBathDescription.trim()) {
      const remarkText = `水浴锅异常：${abnormalWaterBathDescription}`;
      this.setData({
        remarks: `${abnormalWorkBenchDescription ? `超净工作台异常：${abnormalWorkBenchDescription}` : ''};\n${remarkText}`,  // 保持超净工作台的异常描述
        showWaterBathAbnormalModal: false,  // 在提交具体异常表现后，关闭弹窗
      });
    }
    this.checkFormValidity();  // 检查整体表单是否满足可以提交的条件
  },

  // 控制是否清洁状态的函数
  cleanStatusChange: function(e) {
    const selectedIndex = e.detail.value;
    this.setData({
      cleanStatusIndex: selectedIndex,  // 显示用户选择的清洁状态
    });
    this.checkFormValidity();
  },

  // 控制是否紫外线杀菌函数
  uvStatusChange: function(e) {
    const selectedIndex = e.detail.value;
    this.setData({
      uvStatusIndex: selectedIndex,  // 显示用户选择的紫外线杀菌状态
    });
    this.checkFormValidity();
  },

  // 输入备注函数
  inputRemarks: function (e) {
    this.setData({
      remarks: e.detail.value
    });
    this.checkFormValidity();
  },

  // 表单提交函数
  submitForm: function () {
    this.setCurrentDateTime();
    let confirmContent = this.generateConfirmContent();
    
    this.setData({
      showConfirmModal: true,
      confirmContent: confirmContent  // 汇总最终提交表单的信息
    });
  },

  // 关闭确认表单提交的函数
  closeConfirmModal: function() {
    this.setData({
      showConfirmModal: false,
    });
  },
  
  // 最终确认的提示框中的内容生成
  generateConfirmContent: function() {
    let content = []; // 使用数组来存储内容，方便后续处理
  
    const addLine = (label, value) => {
      content.push(`<div><b>${label}：</b>${value}</div>`);
    };
    addLine('操作人员', this.data.operatorName);
    addLine('操作类型', `${this.data.operationStatus[this.data.operationStatusIndex]}使用超净工作台`);
    addLine('选定仪器', this.data.selectedInstrument);
    addLine('仪器编号', this.data.selectedInstrumentNumber);
    addLine('绑定仪器', this.data.boundInstrument);
    addLine('仪器编号', this.data.boundInstrumentNumber);
    addLine('超净工作台状态', this.data.workBenchStatus[this.data.workBenchStatusIndex]);
    addLine('水浴锅状态', this.data.waterBathStatus[this.data.waterBathStatusIndex]);
    if (this.data.operationStatus[this.data.operationStatusIndex] === '结束') {
      addLine('是否清洁', this.data.cleanStatus[this.data.cleanStatusIndex]);
      addLine('是否紫外线杀菌', this .data.uvStatus[this.data.uvStatusIndex]);
    }
    addLine('操作日期', this.data.currentDateTime);
    if (this.data.remarks.trim() !== '') {
      addLine('备注', this.data.remarks);
    }
    return content.join('');
  },

  // 发送到后端的数据
  submitToBackend: function() {
    let formData = {
      instrument_code: this.data.selectedInstrumentNumber,
      instrument: this.data.selectedInstrument,
      instrument_status: this.data.workBenchStatus[this.data.workBenchStatusIndex],
      operator_name: this.data.operatorName,
      details: {},
    };
    formData.details.openration_type = `${this.data.operationStatus[this.data.operationStatusIndex]}使用超净工作台`;
    formData.details.instrument_code = this.data.selectedInstrumentNumber;
    formData.details.bound_instrument = this.data.boundInstrument;
    formData.details.bound_instrument_code = this.data.boundInstrumentNumber;
    formData.details.bound_instrument_status = this.data.waterBathStatus[this.data.waterBathStatusIndex];
    if (this.data.operationStatus[this.data.operationStatusIndex] === '结束') {
      formData.details.if_clean = this.data.cleanStatus[this.data.cleanStatusIndex];
      formData.details.if_uv = this.data.uvStatus[this.data.uvStatusIndex];
    }
    formData.details.operation_date = this.data.currentDateTime;
    if (this.data.remarks) {
      formData.details.remark = this.data.remarks;
    }

    // 打印输出以检查 JSON 格式
    console.log(formData);
  
    console.log("Sending data to backend:", formData);
    wx.request({
      // url: 'https://lab.guhejk.com/submit_sequencing_record',
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
            title: '提交成功!',
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

  // 检查必要的信息是否都已经填入，决定表单下面的提交按钮是否被点亮
  checkFormValidity() {
    const { 
      operatorName,
      operationStatus,
      operationStatusIndex,
      selectedInstrument,
      selectedInstrumentNumber,
      boundInstrument,
      boundInstrumentNumber,
      workBenchStatusIndex,
      waterBathStatusIndex,
      currentDateTime,
      cleanStatusIndex,
      uvStatusIndex
    } = this.data;
  
    let isValid = false;

    isValid = operatorName !== '' &&
              operationStatusIndex !== null &&
              selectedInstrument !== '' &&
              selectedInstrumentNumber !== '' &&
              boundInstrument !== '' &&
              boundInstrumentNumber !== '' &&
              currentDateTime !== '' &&
              workBenchStatusIndex !== null &&
              waterBathStatusIndex !== null;

    if (operationStatus[operationStatusIndex] === '结束') {
      isValid = isValid && 
                cleanStatusIndex !== null &&
                uvStatusIndex !== null;
    }

    this.setData({ isFormValid: isValid });
    console.log('Form validity:', isValid);
  },

  // 重置表单函数
  resetForm: function() {
    this.setData({
      currentDateTime: '', // 当前的时间，用于实时更新报告提交的时间点
      selectedInstrument: '超净工作台',  //选定仪器（锁定）为超净工作台
      selectedInstrumentNumber: 'GHJC-EQ0159',  //选定仪器的编号（锁定）为GHJC-EQ0159
      boundInstrument: '数显恒温水浴锅',  // 绑定的仪器（锁定）为数显恒温水浴锅
      boundInstrumentNumber: 'GHJC-EQ0117',  // 绑定仪器的编号（锁定）为GHJC-EQ0117
      operationStatus: ['开始', '结束'],  // 超净工作台的操作状态，分为（开始/结束）
      operationStatusIndex: null,
      workBenchStatus: ['正常', '异常'],  // 超净工作台状态
      workBenchStatusIndex: null,
      waterBathStatus: ['正常', '异常'],  // 水浴锅状态
      waterBathStatusIndex: null,
      cleanStatus: ['是'],
      cleanStatusIndex: null,
      uvStatus: ['是，已杀菌30分钟'],
      uvStatusIndex: null,
      showWorkBenchAbnormalModal: false,
      showWaterBathAbnormalModal: false,
      showAbnormalModal: false,  // 控制异常状态时的弹窗
      abnormalWorkBenchDescription: '',  // 超净工作台异常状态弹框内要填写的内容
      abnormalWaterBathDescription: '',  // 水浴锅异常状态弹框内要填写的内容
      operatorName: '',  // 实验操作员
      remarks: "",  // 备注
      showConfirmModal: false,
      isFormValid: false,
      // 扫码登录功能所求要的数据
      userInfo: null,
    }, () => {
      this.checkFormValidity();
    });
  },

  closeConfirmModal: function() {
    this.setData({
      showConfirmModal: false
    });
  },
  
  // 最终确认信息表单的确认提交按钮函数
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
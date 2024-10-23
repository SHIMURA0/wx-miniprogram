Page({
  // 初始化数据
  data: {
    currentDateTime: "", // 当前的时间，用于实时更新报告提交的时间点
    instrumentNumbers: 'GHJC-EQ0056', // 示例仪器编号列表
    // instrumentNumberIndex: null,
    operations: ['打开仪器并开始测序', '新增测序', '关闭仪器'],
    operationIndex: null,
    statuses: ['正常', '异常'],
    statusIndex: null,
    showAbnormalModal: false,
    abnormalDescription: '',
    slotTypes: ['A', 'B', 'A + B'],
    slotTypeIndex: null,

    // 芯片序列号/数据文件名
    // chipSequence: "",
    // isChipSequenceValid: false,
    // chipSequenceError: "",
    // hasStartedTyping: false,
    chipSequenceA: "",
    chipSequenceB: "",
    isChipSequenceValidA: false,
    isChipSequenceValidB: false,
    chipSequenceErrorA: "",
    chipSequenceErrorB: "",
    hasStartedTypingA: false,
    hasStartedTypingB: false,
    
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
    isSequencing: true,
    // 非测序表单的数据
    nonSeqOperations: ['打开仪器', '关闭仪器'],
    nonSeqStatuses: ['正常', '异常'],
    // 操作原因（在非测序表填写）
    operationReason: "",
    nonSeqOperationIndex: null,
    nonSeqStatusIndex: null,
    canSubmitForm: true,
    showConfirmModal: false,
    isFormValid: false,
    // 扫码登录功能所求要的数据
    userInfo: null,
    realName: '',
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
      isChipSequenceValidA: false,
      isChipSequenceValidB: false,
      isSequencing: true, // 确保初始状态是测序模式
      isValid: false, // 初始化表单为无效状态
      statusIndex: 0
    })
  },

  // 获得当前的时间
  setCurrentDateTime: function () {
    const now = new Date();
    const formattedDateTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    this.setData({
      currentDateTime: formattedDateTime
    });
  },

  // 当选择操作类型为关闭仪器时，弹窗确认函数
  bindOperationChange: function(e) {
    const selectedIndex = e.detail.value;
    const selectedOperation = this.data.operations[selectedIndex];
    this.setData({
      operationIndex: selectedIndex,
      // 每次选择操作时重置备份确认状态
      isBackupConfirmed: false,
      backupRadioValue: '0' // 重置为 '否'
    });

    if (selectedOperation === '关闭仪器') {
      this.showBackupModal();
    } else {
      this.setData({
        canSubmitForm: true
      });
    }
    this.checkFormValidity();
  },

  onBackupConfirm: function(e) {
    const isConfirmed = e.detail.value === '1';
    this.setData({
      isBackupConfirmed: isConfirmed,
      backupRadioValue: e.detail.value
    });
  },

  showBackupModal: function() {
    this.setData({
      showBackupModal: true,
      isBackupConfirmed: false,  // 重置确认状态
      backupRadioValue: '0',  // 确保默认选择 "否"
    });
  },

  closeBackupModal: function() {
    this.setData({
      showBackupModal: false,
      // isBackupConfirmed: false,
      operationIndex: null,
      canSubmitForm: true
    });
  },

  confirmBackup: function() {
    if (this.data.backupRadioValue === '1') {
      this.setData({
        showBackupModal: false,
        canSubmitForm: true
      });
    } else {
      wx.showToast({
        title: '请确认数据已备份！',
        icon: 'none'
      });
    }
  },

  // 选择仪器编号
  // bindInstrumentNumberChange: function(e) {
  //   this.setData({
  //     instrumentNumberIndex: e.detail.value
  //   });
  //   this.checkFormValidity();
  // },

  // 选择测序槽类型时的函数
  bindSlotTypeChange: function(e) {
    const selectedIndex = e.detail.value;
    const selectedSlot = this.data.slotTypes[selectedIndex];
    let newLabel = "芯片序列号/数据文件名：";
    
    if (selectedSlot === 'A' || selectedSlot === 'B') {
      newLabel = `（测序槽${selectedSlot}）芯片序列号/数据文件名：`;
    }
    
    this.setData({
      slotTypeIndex: selectedIndex,
      chipSequenceLabel: newLabel
    });
  },

  inputChipSequenceA: function (e) {
    this.handleChipSequenceInput(e, 'A');
  },
  
  inputChipSequenceB: function (e) {
    this.handleChipSequenceInput(e, 'B');
  },
  
  handleChipSequenceInput: function (e, slot) {
    const value = e.detail.value;
    let isValid = false;
    let errorMsg = "";
    let hasStarted = value.length > 0;
  
    if (hasStarted) {
      if (value.length < 11) {
        errorMsg = "不能少于11位字符";
      } else if (value.length > 11) {
        errorMsg = "不能超过11位字符";
      } else {
        isValid = true;
      }
    }
  
    this.setData({
      [`chipSequence${slot}`]: value,
      [`isChipSequenceValid${slot}`]: isValid,
      [`chipSequenceError${slot}`]: errorMsg,
      [`hasStartedTyping${slot}`]: hasStarted
    });
    () => {
      console.log(`Chip Sequence ${slot}:`, value);
      console.log(`Is Valid ${slot}:`, isValid);
    }
    this.checkFormValidity();
  },

  // 芯片序列号扫码自动识别，自动填写函数
  scanCode: function(e) {
    const slot = e.currentTarget.dataset.slot; // 'A' 或 'B'
    wx.scanCode({
      success: (res) => {
        console.log('扫码成功：', res.result);
        
        // 使用 setData 更新相应的 chipSequence，这会触发界面更新
        this.setData({
          [`chipSequence${slot}`]: res.result,
          [`hasStartedTyping${slot}`]: true
        });
        
        // 手动调用 handleChipSequenceInput 进行验证
        this.handleChipSequenceInput({ detail: { value: res.result } }, slot);
      },
      fail: (error) => {
        console.log('扫码失败：', error);
        wx.showToast({
          title: '扫码失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  inputRemarks: function (e) {
    this.setData({
      remarks: e.detail.value
    });
    this.checkFormValidity();
  },

  submitForm: function () {
    if (!this.data.isFormValid) {
      wx.showToast({
        title: '请填写所有必要信息',
        icon: 'none'
      });
      return;
    }
  
    if (this.data.isSequencing && !this.data.canSubmitForm) {
      wx.showToast({
        title: '请先确认数据备份',
        icon: 'none'
      });
      return;
    }
    this.setCurrentDateTime();
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
  
    if (this.data.isSequencing) {
      addLine('操作人员', this.data.operatorName);
      addLine('操作类型', this.data.operations[this.data.operationIndex]);
      addLine('选定仪器', this.data.selectedInstrument);
      addLine('仪器编号', this.data.instrumentNumbers);
      addLine('仪器状态', this.data.statuses[this.data.statusIndex]);
  
      if (this.data.operations[this.data.operationIndex] !== '关闭仪器' && this.data.statusIndex !== 1) {
        const slotType = this.data.slotTypes[this.data.slotTypeIndex];
        addLine('测序槽类型', slotType);
  
        // 根据选择的测序槽类型显示相应的芯片序列号
        if (slotType === 'A' || slotType === 'A + B') {
          addLine('测序槽A芯片序列号', this.data.chipSequenceA);
        }
        if (slotType === 'B' || slotType === 'A + B') {
          addLine('测序槽B芯片序列号', this.data.chipSequenceB);
        }
      }
    } else {
      addLine('操作人员', this.data.operatorName);
      addLine('操作类型', this.data.nonSeqOperations[this.data.operationIndex]);
      addLine('选定仪器', this.data.selectedInstrument);
      addLine('仪器编号', this.data.instrumentNumbers);
      addLine('仪器状态', this.data.nonSeqStatuses[this.data.statusIndex]);
      addLine('操作原因', this.data.operationReason);
    }
    addLine('操作日期', this.data.currentDateTime);
    // 只有当备注非空时才添加备注到最终确认表单中
    if (this.data.remarks.trim() !== '') {
      addLine('备注', this.data.remarks);
    }
    return content.join('');
  },
  
  // 发送给后端的数据函数
  submitToBackend: function() {

    let formData = {
      instrument_code: this.data.instrumentNumbers,  // 仪器编号
      instrument: '测序仪',  // 仪器名称：测序仪
      instrument_status: this.data.statuses[this.data.statusIndex],  // 仪器状态
      operator_name: this.data.operatorName,  // 操作员姓名
      details: {},  // 详细数据
    };
    formData.details.is_sequencing = this.data.isSequencing ? '测序' : '非测序';  // 是否测序
    if (this.data.isSequencing) {
      // 如果是进行测序操作
      formData.details.operation_type = this.data.operations[this.data.operationIndex];
      formData.details.slot_type = this.data.slotTypes[this.data.slotTypeIndex];  // 测序槽类型
      if (this.data.slotTypes[this.data.slotTypeIndex] === 'A' || this.data.slotTypes[this.data.slotTypeIndex] === 'A + B') {
        // 如果选择了测序槽为A或者A+B
        formData.details.slot_a = this.data.chipSequenceA;
      } else if (this.data.slotTypes[this.data.slotTypeIndex] === 'B' || this.data.slotTypes[this.data.slotTypeIndex] === 'A + B') {
        // 如果选择了测序槽为B或者A+B
        formData.details.slot_b = this.data.chipSequenceB;
      }
      if (this.data.operations[this.data.operationIndex] === '关闭仪器') {
        formData.details.if_backup = '数据已备份';
      }
    } else if (!this.data.isSequencing) {
      // 如果非测序操作
      formData.details.operation_type = this.data.nonSeqOperations[this.data.operationIndex];
      if (this.data.nonSeqOperations[this.data.operationIndex] !== '关闭仪器') {
        formData.details.operation_reason = this.data.operationReason;
      }
    }
    formData.details.operation_date = this.data.currentDateTime;  // 操作日期时间
    if (this.data.remarks.trim()) {
      // 如果备注不为空
      formData.details.remark = this.data.remarks;
    }

    wx.request({
      // url: 'https://lab.guhejk.com/submit_sequencing_record',
      url: 'https://lab.guhejk.com/api/wechat/v1/instruments/submit_instrument_usage_record',
      method: 'POST',
      data: formData,
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('accessToken'),
        'content-type': 'application/json'
      },
      // 发送到后端成功
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          });

          // 在提交成功后重置表单
          this.resetForm();
          // 相比于滑动按钮的重置表单，额外去除操作人员的姓名和操作日期，放置成功提交后再次提交
          this.setData({
            currentDateTime: '',
            operatorName: ''
          });
          // 在成功提交表单后2秒，弹框显示'表单已提交，请手动关闭小程序。'提醒用户手动关闭小程序
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
      // 发送到后端失败
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
  },

  // 控制在仪器状态选择为异常时候的功能
  bindStatusChange(e) {
    const statusIndex = parseInt(e.detail.value);
    let newStatusStyle = '';
    let showModal = false;
  
    if (statusIndex === 1) { // 假设索引1代表"异常"状态
      newStatusStyle = 'background-color: #ffcccc;';
      showModal = true;
    }
  
    this.setData({ 
      statusIndex,
      statusStyle: newStatusStyle,
      showAbnormalModal: showModal
    });
  
    if (statusIndex === 0) { // 假设索引0代表"正常"状态
      // 如果状态改回正常，清除异常描述
      this.setData({
        abnormalDescription: '',
        remarks: ''
      });
    }
  
    this.checkFormValidity();
  },
  

  inputAbnormalDescription(e) {
    this.setData({ abnormalDescription: e.detail.value });
  },

  submitAbnormalDescription() {
    const { operations, operationIndex, abnormalDescription } = this.data;
    const operationType = operations[operationIndex];
    const remarkText = `异常：${abnormalDescription}`;
    
    this.setData({
      remarks: remarkText,
      showAbnormalModal: false,
      // 这一行的作用是当用户选择仪器状态为异常时，使对应的状态栏变红
      statusStyle: 'background-color: #ffcccc;'
    });
    
    // 更新表单有效性
    this.checkFormValidity();
  },

  inputRemarks(e) {
    this.setData({ remarks: e.detail.value });
  },

  finalSubmit: function() {
    const formData = {
      dateTime: this.data.currentDateTime,
      operation: this.data.operations[this.data.operationIndex],
      status: this.data.statuses[this.data.statusIndex],
      instrument: this.data.selectedInstrument,
      slotType: this.data.slotTypes[this.data.slotTypeIndex],
      chipSequence: this.data.chipSequence,
      operator: this.data.operatorName,
      remarks: this.data.remarks
    };
    console.log('提交的表单数据：', formData);
  
    this.setData({
      showConfirmModal: false
    });
  
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    });
  },

  // 输入操作原因
  // inputOperationReason(e) {
  //   this.setData({
  //     operationReason: e.detail.value
  //   });
  //   this.checkFormValidity();  // 输入完检查一下
  // },    

  // 检查必要的信息是否都已经填入，决定表单下面的提交按钮是否被点亮
  checkFormValidity() {
    console.log('Checking form validity');
    const { 
      isSequencing,
      operationIndex, 
      statusIndex, 
      slotTypeIndex, 
      chipSequenceA,
      chipSequenceB,
      isChipSequenceValidA,
      isChipSequenceValidB,
      operations,
      nonSeqOperations,
      instrumentNumberIndex,
      operationReason,
      slotTypes,
      remarks
    } = this.data;
  
    let isValid = false;
  
    if (isSequencing) {
      // 测序表单验证逻辑
      if (operationIndex !== null) {
        const selectedOperation = operations[operationIndex];
        if (selectedOperation === '关闭仪器') {
          // 如果是关闭仪器，需要选择操作类型、仪器状态和仪器编号
          isValid = statusIndex !== null;
        } else if (statusIndex === 1) {  // 1 表示异常状态
          // 如果状态是异常，不需要检查测序槽类型和芯片序列号
          isValid = remarks !== null;
        } else {
          // 正常状态下，需要检查所有字段
          isValid = statusIndex !== null &&
                    slotTypeIndex !== null;
  
          // 根据选择的测序槽类型验证芯片序列号
          const selectedSlotType = slotTypes[slotTypeIndex];
          if (selectedSlotType === 'A') {
            isValid = isValid && chipSequenceA.length === 11 && isChipSequenceValidA;
          } else if (selectedSlotType === 'B') {
            isValid = isValid && chipSequenceB.length === 11 && isChipSequenceValidB;
          } else if (selectedSlotType === 'A + B') {
            isValid = isValid && 
                      chipSequenceA.length === 11 && isChipSequenceValidA &&
                      chipSequenceB.length === 11 && isChipSequenceValidB;
          }
        }
      }
    } 
    // 非测序操作
    else {
      if (operationIndex !== null) {
        console.log(nonSeqOperations[operationIndex])
        const selectedOperation = nonSeqOperations[operationIndex];
        if (selectedOperation === '关闭仪器') {
          isValid = statusIndex !== null;
        } else {
          isValid = operationIndex !== null &&  // 检查操作类型不为空
                    statusIndex !== null &&  // 检查仪器状态不为空
                    operationReason.trim() !== ''
        }
      }
    }
    this.setData({ isFormValid: isValid });
    console.log('Form validity:', isValid);  // 添加这行
  },
  
  // 滑动切换按钮功能
  switchSequencing: function(e) {
    this.setData({
      isSequencing: e.detail.value
    });
    this.resetForm();
    if (this.data.statusIndex === 0) {
      this.setData({statusIndex : 0});
    } else {
      this.setData({statusIndex : null});
    }
  },

  // 重置表单函数
  resetForm: function() {
    this.setData({
      operationIndex: null,
      // statusIndex: null,
      slotTypeIndex: null,
      chipSequenceA: "",
      chipSequenceB: "",
      isChipSequenceValidA: false,
      isChipSequenceValidB: false,
      chipSequenceErrorA: "",
      chipSequenceErrorB: "",
      hasStartedTypingA: false,
      hasStartedTypingB: false,
      nonSeqOperationIndex: null,
      nonSeqStatusIndex: null,
      operationReason: '',
      remarks: '',
      instrumentNumberIndex: null,
      statusStyle: '', // 重置状态样式
      isFormValid: false, // 重置表单有效性
      isBackupConfirmed: false, // 重置备份确认状态
      backupRadioValue: '0', // 重置备份单选按钮值
      showBackupModal: false // 确保备份模态框是关闭的
    }, () => {
      // 在状态更新后，重新验证表单
      this.checkFormValidity();
      // 重新加载页面初始数据
      // this.onLoad();
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


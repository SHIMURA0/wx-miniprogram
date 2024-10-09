// index.js

Page({
  data: {
    instruments: [
      // { name: "生物安全柜" },
      // { name: "水浴锅" },
      // { name: "离心机" },
      // { name: "PCR仪" },
      // { name: "核酸自动提取仪" },
      // { name: "超声仪" },
      // { name: "冰箱（冰柜）" },
      { name: "测序仪", page: "sequencer" },
      // { name: " "},
      // { name: "凝胶成像系统" },
      // { name: "纯水仪" },
      // { name: "超低温冰箱" },
      { name: "房间"}
    ]
  },

  // 在选择时候，点击触发的函数
  selectInstrument: function(e) {
    const index = e.currentTarget.dataset.index;
    const selectedInstrument = this.data.instruments[index];
    console.log('选择:', selectedInstrument.name);
    
    let url;
    // 这里你可以添加选择仪器后的逻辑
    // 比如跳转到另一个页面或显示更多信息
    if (selectedInstrument.name === '房间') {
        url = '/pages/use/room/room';
    } else {
        url = `/pages/use/sequencer/sequencer?instrument=${selectedInstrument.name}`;
    }
    wx.navigateTo({
      url: url,
      success: () => {
          console.log('页面跳转成功');
      },
      fail: (error) => {
          console.error('页面跳转失败', error);
          wx.showToast({
              title: '页面跳转失败',
              icon: 'none',
              duration: 2000
          });
        }
      });
    
    wx.showToast({
      title: '已选择 ' + selectedInstrument.name,
      icon: 'success',
      duration: 2000
    });
  }
})


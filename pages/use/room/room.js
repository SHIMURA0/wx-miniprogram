Page({
  data: {
    operations: [
      { name: "日常操作", page: "daily" },
      { name: "流程操作", page: "process" },
      { name: "冰箱冰柜", page: "fridge"},
      { name: "房间2", page: "room2"}
    ]
  },

  selectOperation: function(e) {
    const index = e.currentTarget.dataset.index;
    const selectedOperation = this.data.operations[index];
    console.log('选择:', selectedOperation.name);
    const url = `/pages/use/room/${selectedOperation.page}/${selectedOperation.page}`;
    
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
      title: '已选择 ' + selectedOperation.name,
      icon: 'success',
      duration: 2000
    });
  }
})

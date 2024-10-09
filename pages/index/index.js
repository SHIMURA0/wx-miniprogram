// index.js

// Page({
//   data: {
//     options: [
//       { text: "实验仪器使用", page: "use", isActive: false },
//       { text: "实验仪器维护", page: "maintain", isActive: false },
//       { text: "实验仪器维修", page: "repair", isActive: false },
//       { text: "实验试剂采购", page: '', isActive: false },
//       { text: "实验试剂验收", page: '', isActive: false },
//       { text: "实验试剂领用", page: '', isActive: false },
//     ]
//   },

//   handleTouchStart: function(e) {
//     const index = e.currentTarget.dataset.index;
//     let options = this.data.options;
//     options[index].isActive = true;
//     this.setData({ options });
//   },

//   handleTouchEnd: function(e) {
//     const index = e.currentTarget.dataset.index;
//     let options = this.data.options;
//     options[index].isActive = false;
//     this.setData({ options });
//   },

//   navigateTo(e) {
//     const page = e.currentTarget.dataset.page;
//     let url = "";
    
//     switch(page) {
//       case "use":
//         url = '/pages/use/use';
//         break;
//       case "maintain":
//         url = '/pages/maintain/maintain';
//         break;
//       case "repair":
//         url = '/pages/repair/repair';
//         break;
//     }
    
//     if (url) {
//       wx.navigateTo({
//         url: url
//       });
//     }
//   }
// })

Page({
  data: {
    options: [
      { text: "实验仪器使用", page: "use", isActive: false },
      { text: "实验仪器维护", page: "", isActive: false },
      { text: "实验仪器维修", page: "", isActive: false },
      { text: "实验试剂采购", page: '', isActive: false },
      { text: "实验试剂验收", page: '', isActive: false },
      { text: "实验试剂领用", page: '', isActive: false },
      // 可以继续添加更多选项...
    ]
  },

  handleTouchStart: function(e) {
    const index = e.currentTarget.dataset.index;
    let options = this.data.options;
    options[index].isActive = true;
    this.setData({ options });
  },

  handleTouchEnd: function(e) {
    const index = e.currentTarget.dataset.index;
    let options = this.data.options;
    options[index].isActive = false;
    this.setData({ options });
  },
  
  navigateTo(e) {
    const page = e.currentTarget.dataset.page;
    let url = "";
    
    switch(page) {
      case "use":
        url = "/pages/use/use";
        break;
      case "maintain":
        url = '/pages/maintain/maintain';
        break;
      case "repair":
        url = '/pages/repair/repair';
        break;
    }
    
    if (url) {
      wx.navigateTo({
        url: url,
        fail: function(err) {
          console.error('Navigation failed:', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    } else {
      wx.showToast({
        title: '功能开发中，敬请期待',
        icon: 'none'
      });
    }
  }

})




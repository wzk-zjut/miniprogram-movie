// pages/comment/comment1.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    score:5,
    content:'',
    images: [],
    fileIds: [],
    movieId: -1
  },
  onContentChange: function(event){
    this.setData({
      content: event.detail
    });
  },
  onScoreChange: function(event){
    this.setData({
      score: event.detail
    });
  },
  submit: function(){
    wx.showLoading({
      title: '评价中',
    })
    let promiseArr = [];
    for(let i=0;i<this.data.images.length; i++){
      promiseArr.push(new Promise((reslove, reject) =>{
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0];
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: item,
          success: res=>{
            console.log(res.fileID)
            this.setData({
              fileIds: this.data.fileIds.concat(res.fileID)
            });
            reslove();
          }, 
          fail: console.error
        })
      }));
    }
    Promise.all(promiseArr).then(res =>{
      db.collection('comment').add({
        data: {
          content: this.data.content,
          score: this.data.score,
          movieid: this.data.movieId,
          fileIds: this.data.fileIds
        }
      }).then(res=>{
        wx.hideLoading();
        wx.showToast({
          title: '评价成功',
        })
      }).catch(err=>{
        wx.hideLoading();
        wx.showToast({
          title: '评价失败',
        })
      })
    });
  },
  uploadImg: function(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: res=> {
        const tempFilePaths = res.tempFilePaths
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        });
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieId: options.movieid
    });
    wx.showLoading({
      title: '加载中',
    })
    console.log(options);
    wx.cloud.callFunction({
      name: 'getDatail',
      data: {
        movieid: options.movieid
      }
    }).then(res => {
      // console.log(res);
      this.setData({
        detail: JSON.parse(res.result)
      });
      wx.hideLoading();
    }).catch(err => {
      console.error(err);
      wx.hideLoading();
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
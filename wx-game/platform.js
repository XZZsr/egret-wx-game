/**
 * 请在白鹭引擎的Main.ts中调用 platform.login() 方法调用至此处。
 */
const host = 'https://wx.game.luochen.com'
class WxgamePlatform {

  name = 'wxgame'
  //微信登录
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          resolve(res)
        }
      })
    })
  }
  //微信获取用户信息接口
  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        openIdList: ['selfOpenId'],
        success: function (res) {
          var userInfo = res.userInfo
          var nickName = userInfo.nickName
          var avatarUrl = userInfo.avatarUrl
          var gender = userInfo.gender //性别 0：未知、1：男、2：女
          var province = userInfo.province
          var city = userInfo.city
          var country = userInfo.country

          resolve(userInfo);
        }
      })
    })
  }
  //群排行分享
  groupShare() {
    return new Promise((resolve, reject) => {
      wx.showShareMenu({
        withShareTicket: true,
        success: (res => {
          wx.shareAppMessage({
            imageUrl: 'resource/imgs/groupShare.png',
            title: '听说只有聪明的人敢挑战，本群看你排第几？'
          })
        })
      })

    })
  }
  //设置分数
  setScore(scoreStr = '0') {
    let uid = wx.getStorageSync('bid');
    return new Promise((resolve, reject) => {
      let upData = new Array();
      upData.push({ key: "score", value: scoreStr });
      wx.setUserCloudStorage({
        KVDataList: upData,
        success: res => {
          resolve(scoreStr)
        },
        fail: err => {
          reject(err)
        },
        complete: () => {
          resolve(scoreStr)
        }
      })
    })
  }
  //获取场景值
  getShareTicket() {
    return new Promise((resolve, reject) => {
      let result = wx.getLaunchOptionsSync()
      resolve(result)
    })
  }
}


window.platform = new WxgamePlatform();
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.testNum = '1552';
        wx.onMessage(function (data) {
            if (data.isDisplay) {
                if (data.isFriend) {
                    //获取小游戏开放数据接口 --- 开始
                    wx.getFriendCloudStorage({
                        keyList: ['score'],
                        success: function (res) {
                            //数据排序增加属性
                            var rankData = res.data;
                            var myInfo = {};
                            for (var i in rankData) {
                                rankData[i]['score'] = rankData[i].KVDataList[0].value;
                            }
                            rankData.sort(_this.compare('score'));
                            for (var i in rankData) {
                                rankData[i]['index'] = parseInt(i) + 1;
                                if (rankData[i].openid == data.userInfo.open_id) {
                                    myInfo = rankData[i];
                                }
                            }
                            _this.runGame(rankData, data.userInfo);
                        },
                        fail: function (err) {
                            console.log(err);
                        },
                        complete: function () {
                        }
                    });
                }
                else if (data.isGroupRank) {
                    //获取小游戏开放数据接口 --- 开始
                    wx.getGroupCloudStorage({
                        shareTicket: data.shareInfo.shareTicket,
                        keyList: ['score'],
                        success: function (res) {
                            //数据排序增加属性
                            var rankData = res.data;
                            var myInfo = {};
                            for (var i in rankData) {
                                rankData[i]['score'] = rankData[i].KVDataList[0].value;
                            }
                            rankData.sort(_this.compare('score'));
                            for (var i in rankData) {
                                rankData[i]['index'] = parseInt(i) + 1;
                                if (rankData[i].openid == data.userInfo.open_id) {
                                    myInfo = rankData[i];
                                }
                            }
                            _this.groupRank(rankData, data.userInfo);
                        },
                        fail: function (err) {
                            console.log(err);
                        },
                        complete: function () {
                        }
                    });
                }
                //监听消息 isDisplay
            }
            else {
                // this.cancelGame();
            }
        });
        return _this;
        //获取小游戏开放数据接口 --- 结束        
    }
    //排序
    Main.prototype.compare = function (property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value2 - value1;
        };
    };
    Main.prototype.createMyRank = function (myInfo, scale) {
        var _this = this;
        this.myRank = new eui.Group();
        this.myRank.width = 528;
        this.myRank.height = 100;
        this.myRank.x = 56;
        this.myRank.y = 830 * scale;
        var bg = new egret.Shape();
        if (myInfo.nickname == undefined) {
            this.labelNodata = new eui.Label();
            this.labelNodata.x = 0;
            this.labelNodata.y = 35;
            this.labelNodata.width = 528;
            this.labelNodata.height = 38;
            this.labelNodata.fontFamily = "PingFang-SC-Medium";
            this.labelNodata.size = 30;
            this.labelNodata.textAlign = 'center';
            this.labelNodata.verticalAlign = 'middle';
            this.labelNodata.textColor = 0x999999;
            this.labelNodata.text = "您尚未挑战,等你上榜!";
            this.myRank.addChild(this.labelNodata);
            return;
        }
        this.myRank.removeChild(this.labelNodata);
        //前三名次
        var rectHonour = new eui.Rect();
        rectHonour.x = 30;
        rectHonour.y = 32;
        rectHonour.width = 42;
        rectHonour.height = 42;
        rectHonour.ellipseWidth = 42;
        rectHonour.ellipseHeight = 42;
        // 名次
        var labelIndex = new eui.Label();
        labelIndex.x = 30;
        labelIndex.y = 35;
        labelIndex.width = 38;
        labelIndex.height = 38;
        labelIndex.fontFamily = "PingFang-SC-Medium";
        labelIndex.size = 24;
        labelIndex.textAlign = 'center';
        labelIndex.verticalAlign = 'middle';
        labelIndex.textColor = 0x999999;
        labelIndex.text = myInfo.index;
        switch (myInfo.index) {
            case 1:
                labelIndex.textColor = 0xffffff;
                rectHonour.fillColor = 0xDF6240;
                break;
            case 2:
                labelIndex.textColor = 0xffffff;
                rectHonour.fillColor = 0xE98E5B;
                break;
            case 3:
                labelIndex.textColor = 0xffffff;
                rectHonour.fillColor = 0xEEA65F;
                break;
            default:
                rectHonour.alpha = 0;
        }
        this.myRank.addChild(rectHonour);
        this.myRank.addChild(labelIndex);
        //头像
        var imageLoader = new egret.ImageLoader();
        imageLoader.addEventListener(egret.Event.COMPLETE, function (event) {
            var imageLoader = event.currentTarget;
            var bgtexture = new egret.Texture();
            bgtexture._setBitmapData(imageLoader.data);
            var bitmapAvatar = new egret.Bitmap(bgtexture);
            bitmapAvatar.x = 100;
            bitmapAvatar.y = 30;
            bitmapAvatar.width = 50;
            bitmapAvatar.height = 50;
            _this.myRank.addChild(bitmapAvatar);
        }, this);
        imageLoader.load(myInfo.avatarUrl);
        //昵称
        var labelName = new eui.Label();
        labelName.x = 200;
        labelName.y = 42;
        labelName.fontFamily = "PingFang-SC-Medium";
        labelName.size = 24;
        labelName.textAlign = 'center';
        labelIndex.verticalAlign = 'middle';
        labelName.textColor = 0x333333;
        labelName.text = myInfo.nickname;
        this.myRank.addChild(labelName);
        //得分
        var labelScore = new eui.Label();
        labelScore.x = 405;
        labelScore.y = 43;
        labelScore.width = 100;
        labelScore.fontFamily = "PingFang-SC-Medium";
        labelScore.size = 24;
        labelScore.textAlign = 'center';
        labelIndex.verticalAlign = 'middle';
        labelScore.textColor = 0x333333;
        labelScore.text = myInfo.score;
        this.myRank.addChild(labelScore);
    };
    //完整排行
    Main.prototype.runGame = function (res, userData) {
        this.removeChild(this.myRank);
        this.removeChild(this.myScroller);
        this.removeChild(this.mainNodata);
        //滚动容器
        this.myScroller = new eui.Scroller();
        this.myScroller.width = 528;
        this.myScroller.height = 500;
        this.myScroller.x = 56;
        this.myScroller.y = 280;
        var group = new eui.Group();
        if (res.length == 0) {
            this.mainNodata = new eui.Label();
            this.mainNodata.x = 56;
            this.mainNodata.y = 280;
            this.mainNodata.width = 528;
            this.mainNodata.height = 500;
            this.mainNodata.fontFamily = "PingFang-SC-Medium";
            this.mainNodata.size = 32;
            this.mainNodata.textAlign = 'center';
            this.mainNodata.verticalAlign = 'middle';
            this.mainNodata.textColor = 0x999999;
            this.mainNodata.text = "暂无人挑战，等你上榜~";
            this.addChild(this.myRank);
            this.addChild(this.mainNodata);
            return;
        }
        res.forEach(function (value, index) {
            if (index % 2 == 0) {
                value['isEven'] = 0;
            }
            else {
                value['isEven'] = 1;
            }
            // value['honor'] = 1;
            switch (value.index) {
                case 1:
                    value['honor'] = '1';
                    value['honorBg'] = '0xDF6240';
                    value['honortxtColor'] = '0xffffff';
                    break;
                case 2:
                    value['honor'] = 1;
                    value['honorBg'] = 0xE98E5B;
                    value['honortxtColor'] = 0xffffff;
                    break;
                case 3:
                    value['honor'] = 1;
                    value['honorBg'] = 0xEEA65F;
                    value['honortxtColor'] = 0xffffff;
                    break;
                default:
                    value['honor'] = 'false';
                    value['honortxtColor'] = '0x999999';
            }
        });
        this.myScroller.width = 620;
        this.myScroller.height = 500;
        this.myScroller.x = 56;
        this.myScroller.y = 280;
        var list = new eui.List();
        list.dataProvider = new eui.ArrayCollection(res);
        list.itemRenderer = listRender;
        group.addChild(list);
        this.myScroller.viewport = group;
        this.addChild(this.myRank);
        this.addChild(this.myScroller);
    };
    Main.prototype.groupRank = function (res, userData) {
        this.removeChild(this.myScroller);
        this.removeChild(this.mainNodata);
        //滚动容器
        this.myScroller = new eui.Scroller();
        this.myScroller.width = 528;
        this.myScroller.height = 500;
        this.myScroller.x = 56;
        this.myScroller.y = 280;
        if (res.length == 0) {
            this.mainNodata = new eui.Label();
            this.mainNodata.x = 56;
            this.mainNodata.y = 280;
            this.mainNodata.width = 528;
            this.mainNodata.height = 500;
            this.mainNodata.fontFamily = "PingFang-SC-Medium";
            this.mainNodata.size = 32;
            this.mainNodata.textAlign = 'center';
            this.mainNodata.verticalAlign = 'middle';
            this.mainNodata.textColor = 0x999999;
            this.mainNodata.text = "暂无人挑战，等你上榜~";
            this.addChild(this.myRank);
            this.addChild(this.mainNodata);
            return;
        }
        var group = new eui.Group();
        res.forEach(function (value, index) {
            if (index % 2 == 0) {
                value['isEven'] = 0;
            }
            else {
                value['isEven'] = 1;
            }
            // value['honor'] = 1;
            switch (value.index) {
                case 1:
                    value['honor'] = '1';
                    value['honorBg'] = '0xDF6240';
                    value['honortxtColor'] = '0xffffff';
                    break;
                case 2:
                    value['honor'] = 1;
                    value['honorBg'] = 0xE98E5B;
                    value['honortxtColor'] = 0xffffff;
                    break;
                case 3:
                    value['honor'] = 1;
                    value['honorBg'] = 0xEEA65F;
                    value['honortxtColor'] = 0xffffff;
                    break;
                default:
                    value['honor'] = 'false';
                    value['honortxtColor'] = '0x999999';
            }
        });
        this.myScroller.width = 620;
        this.myScroller.height = 500;
        this.myScroller.x = 56;
        this.myScroller.y = 280;
        var list = new eui.List();
        list.dataProvider = new eui.ArrayCollection(res);
        list.itemRenderer = listRender;
        group.addChild(list);
        this.myScroller.viewport = group;
        this.addChild(this.myRank);
        this.addChild(this.myScroller);
    };
    //整理出三行数据
    Main.prototype.converRankData = function (data, meIndex) {
        var threeRank = [];
        //如果数据小于等于三条
        if (data.length <= 3) {
            return data;
        }
        else if ((data.length - 1) == meIndex) {
            for (var i = (data.length - 3); i < data.length; i++) {
                threeRank.push(data[i]);
            }
        }
        else if (meIndex == 0) {
            for (var i = 0; i < 3; i++) {
                threeRank.push(data[i]);
            }
        }
        else {
            for (var i = (meIndex - 1); i < meIndex + 2; i++) {
                threeRank.push(data[i]);
            }
        }
        return threeRank;
    };
    Main.prototype.cancelGame = function () {
        for (var i = 0, l = this.numChildren; i < l; i++) {
            this.removeChildAt(0);
        }
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var listRender = (function (_super) {
    __extends(listRender, _super);
    function listRender() {
        var _this = _super.call(this) || this;
        //自定义的 ItemRenderer
        _this.createRank();
        return _this;
    }
    listRender.prototype.createRank = function () {
        //奇偶排行
        this.rectBg = new eui.Rect();
        this.rectBg.x = 0;
        this.rectBg.y = 0;
        this.rectBg.width = 528;
        this.rectBg.height = 100;
        this.rectBg.fillColor = 0xFFDE94;
        this.addChild(this.rectBg);
        //前三名次
        this.rectHonour = new eui.Rect();
        this.rectHonour.x = 30;
        this.rectHonour.y = 32;
        this.rectHonour.width = 42;
        this.rectHonour.height = 42;
        this.rectHonour.ellipseWidth = 42;
        this.rectHonour.ellipseHeight = 42;
        this.addChild(this.rectHonour);
        // 名次
        this.labelIndex = new eui.Label();
        this.labelIndex.x = 30;
        this.labelIndex.y = 32;
        this.labelIndex.width = 42;
        this.labelIndex.height = 42;
        this.labelIndex.fontFamily = "PingFang-SC-Medium";
        this.labelIndex.size = 24;
        this.labelIndex.textAlign = 'center';
        this.labelIndex.verticalAlign = 'middle';
        this.addChild(this.labelIndex);
        //昵称
        this.labelName = new eui.Label();
        this.labelName.x = 200;
        this.labelName.y = 40;
        this.labelName.fontFamily = "PingFang-SC-Medium";
        this.labelName.size = 24;
        this.labelName.textAlign = 'center';
        this.labelIndex.verticalAlign = 'middle';
        this.labelName.textColor = 0x333333;
        this.addChild(this.labelName);
        //得分
        this.labelScore = new eui.Label();
        this.labelScore.x = 405;
        this.labelScore.y = 40;
        this.labelScore.width = 100;
        this.labelScore.fontFamily = "PingFang-SC-Medium";
        this.labelScore.size = 24;
        this.labelScore.textAlign = 'center';
        this.labelIndex.verticalAlign = 'middle';
        this.labelScore.textColor = 0x333333;
        this.addChild(this.labelScore);
    };
    listRender.prototype.dataChanged = function () {
        var _this = this;
        //数据改变时，会自动调用 dataChanged 这个方法
        //前三名次
        switch (this.data.index) {
            case 1:
                this.rectHonour.fillColor = 0xDF6240;
                this.labelIndex.textColor = 0xffffff;
                break;
            case 2:
                this.rectHonour.fillColor = 0xE98E5B;
                this.labelIndex.textColor = 0xffffff;
                break;
            case 3:
                this.rectHonour.fillColor = 0xEEA65F;
                this.labelIndex.textColor = 0xffffff;
                break;
            default:
                this.rectHonour.alpha = 0;
                this.labelIndex.textColor = 0x999999;
        }
        //显示数据中的 label 值
        this.labelIndex.text = this.data.index;
        this.labelName.text = this.data.nickname;
        this.labelScore.text = this.data.score;
        this.rectBg.alpha = this.data.isEven;
        var imageLoader = new egret.ImageLoader();
        imageLoader.addEventListener(egret.Event.COMPLETE, function (event) {
            var imageLoader = event.currentTarget;
            var bgtexture = new egret.Texture();
            bgtexture._setBitmapData(imageLoader.data);
            _this.bitmapAvatar = new egret.Bitmap(bgtexture);
            _this.bitmapAvatar.x = 100;
            _this.bitmapAvatar.y = 28;
            _this.bitmapAvatar.width = 50;
            _this.bitmapAvatar.height = 50;
            _this.addChild(_this.bitmapAvatar);
        }, this);
        imageLoader.load(this.data.avatarUrl);
    };
    return listRender;
}(eui.ItemRenderer));
__reflect(listRender.prototype, "listRender");

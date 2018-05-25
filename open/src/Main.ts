class Main extends egret.DisplayObjectContainer {
    private getResData;
    constructor() {
        super();  
        wx.onMessage(data => {
            if (data.isDisplay) {
                if(data.isFriend){
                    //获取小游戏开放数据接口 --- 开始
                    wx.getFriendCloudStorage({
                        keyList: ['score'],
                        success: res => {
                            //数据排序增加属性
                            let rankData = res.data
                            for(let i in rankData){
                                rankData[i]['score'] = rankData[i].KVDataList[0].value;
                            }
                            rankData.sort(this.compare('score'));
                            this.runGame(rankData);
                        },
                        fail: err => {
                            console.log(err);
                        },
                        complete: () => {

                        }
                    });
                }else if(data.isGroupRank){
                    //获取小游戏开放数据接口 --- 开始
                    wx.getGroupCloudStorage({
                        shareTicket: data.shareInfo.shareTicket,
                        keyList: ['score'],
                        success: res => {
                            //数据排序增加属性
                            let rankData = res.data
                            for(let i in rankData){
                                rankData[i]['score'] = rankData[i].KVDataList[0].value;
                            }
                            rankData.sort(this.compare('score'));
                            this.runGame(rankData);
                        },
                        fail: err => {
                            console.log(err);
                        },
                        complete: () => {

                        }
                    });
                }
                //监听消息 isDisplay
            } else {
                // this.cancelGame();
            }
        });
        //获取小游戏开放数据接口 --- 结束        
        
    }
    //排序
    private compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value2 - value1;
        }
    }
    //排行榜数据
    private myScroller:eui.Scroller;
    //无数据的时候
    private labelNodata:eui.Label;

    //完整排行
    private runGame(res) {
        this.removeChild(this.myScroller);
        this.removeChild(this.labelNodata);
        //滚动容器
        this.myScroller = new eui.Scroller();
        this.myScroller.width = 528;
        this.myScroller.height = 500;
        this.myScroller.x= 56;
        this.myScroller.y = 50;
        
        let bg = new eui.Rect();
        bg.fillColor = 0xF6D167;
        bg.width = 528;
        bg.height = 500;
        bg.x = 56;
        bg.y = 50;
       //背景

        let group = new eui.Group();
        if(res.length == 0){
            this.labelNodata = new eui.Label()
            this.labelNodata.x = 56;
            this.labelNodata.y = 50;
            this.labelNodata.width = 528;
            this.labelNodata.height = 500;
            this.labelNodata.fontFamily="PingFang-SC-Medium"
            this.labelNodata.size = 32;
            this.labelNodata.textAlign = 'center';
            this.labelNodata.verticalAlign = 'middle';
            this.labelNodata.textColor = 0x999999;
            this.labelNodata.text = "暂无人挑战，等你上榜~";
            this.addChild(this.labelNodata);
            return;
        }
        res.forEach(
            (value, index) => {
                if(index % 2 ==0){
                    value['isEven'] = 0
                }else{
                    value['isEven'] = 1
                }
                value['index'] = parseInt(index) +1;
                // value['honor'] = 1;
            switch(value.index){
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
        })
        var list = new eui.List();
        list.dataProvider = new eui.ArrayCollection(res);
        list.itemRenderer  = listRender;
        group.addChild(list)
        this.myScroller.viewport = group;
        this.addChild(bg);
        this.addChild(this.myScroller);
    }

    private cancelGame(): void {
        for (let i = 0, l = this.numChildren; i < l; i++) {
            this.removeChildAt(0);
        }
    }
}

class listRender extends eui.ItemRenderer{
    public constructor(){
        super();
        //自定义的 ItemRenderer
        this.createRank();

    }


    private labelIndex:eui.Label; //名次
    private labelName:eui.Label; //名次
    private labelScore:eui.Label; //得分
    private rectBg:eui.Rect; //奇偶排行
    private bitmapAvatar:egret.Bitmap; //头像
    private rectHonour:eui.Rect;

    public createRank(){
        //奇偶排行
        this.rectBg = new eui.Rect()
        this.rectBg.x = 0;
        this.rectBg.y = 0;
        this.rectBg.width = 528;
        this.rectBg.height = 100;
        this.rectBg.fillColor = 0xFFDE94;
        this.addChild(this.rectBg)

        //前三名次
        this.rectHonour = new eui.Rect()
        this.rectHonour.x = 30;
        this.rectHonour.y = 32;
        this.rectHonour.width = 42;
        this.rectHonour.height = 42;
        this.rectHonour.ellipseWidth = 42;
        this.rectHonour.ellipseHeight = 42;
        this.addChild(this.rectHonour)
        // 名次
        this.labelIndex = new eui.Label()
        this.labelIndex.x = 30;
        this.labelIndex.y = 32;
        this.labelIndex.width = 42;
        this.labelIndex.height = 42;
        this.labelIndex.fontFamily="PingFang-SC-Medium"
        this.labelIndex.size = 24;
        this.labelIndex.textAlign = 'center';
        this.labelIndex.verticalAlign = 'middle';
        this.addChild(this.labelIndex)
        //昵称
        this.labelName = new eui.Label()
        this.labelName.x = 200;
        this.labelName.y = 40;
        this.labelName.fontFamily="PingFang-SC-Medium"
        this.labelName.size = 24;
        this.labelName.textAlign = 'center';
        this.labelIndex.verticalAlign = 'middle';
        this.labelName.textColor = 0x333333;
        this.addChild(this.labelName)
        //得分
        this.labelScore = new eui.Label()
        this.labelScore.x = 405;
        this.labelScore.y = 40;
        this.labelScore.width = 100;
        this.labelScore.fontFamily="PingFang-SC-Medium"
        this.labelScore.size = 24;
        this.labelScore.textAlign = 'center';
        this.labelIndex.verticalAlign = 'middle';
        this.labelScore.textColor = 0x333333;
        this.addChild(this.labelScore)
    }
    protected dataChanged():void{
        //数据改变时，会自动调用 dataChanged 这个方法
        //前三名次
        switch(this.data.index){
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
                this.rectHonour.alpha = 0
                this.labelIndex.textColor = 0x999999;
        }
        //显示数据中的 label 值
        this.labelIndex.text = this.data.index;
        this.labelName.text = this.data.nickname;
        this.labelScore.text = this.data.score;
        this.rectBg.alpha = this.data.isEven

        let imageLoader = new egret.ImageLoader();
            imageLoader.addEventListener(egret.Event.COMPLETE, (event: egret.Event) => {
                let imageLoader = <egret.ImageLoader>event.currentTarget;
                let bgtexture = new egret.Texture();
                bgtexture._setBitmapData(imageLoader.data);
                this.bitmapAvatar= new egret.Bitmap(bgtexture);
                this.bitmapAvatar.x = 100;
                this.bitmapAvatar.y = 28;
                this.bitmapAvatar.width = 50;
                this.bitmapAvatar.height = 50;
                this.addChild(this.bitmapAvatar)
            }, this);
            imageLoader.load( this.data.avatarUrl)
    }
}

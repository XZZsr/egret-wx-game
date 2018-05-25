class FriendRank extends eui.Component implements  eui.UIComponent {
	public constructor() {
		super();
		this.skinName = "FriendRankSkin";
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
		this.width = Utils.getInstance().stageWidth;
		this.height = Utils.getInstance().stageHeight;
		this.createRank();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
	}
	private bitmap: egret.Bitmap;
    private btnClose:eui.Button;
    private isdisplay = false;
	private createRank(){
        let openDataContext = wx.getOpenDataContext();
        if (this.isdisplay) {
            this.bitmap.parent && this.bitmap.parent.removeChild(this.bitmap);
            this.isdisplay = false;
        } else {

            //简单实现，打开这关闭使用一个按钮。
            // this.addChild(this.btnClose);
            //主要示例代码开始
            const bitmapdata = new egret.BitmapData(window["sharedCanvas"]);
            bitmapdata.$deleteSource = false;
            const texture = new egret.Texture();
            texture._setBitmapData(bitmapdata);
            this.bitmap = new egret.Bitmap(texture);
            this.addChild(this.bitmap);

            egret.startTick((timeStarmp: number) => {
                egret.WebGLUtils.deleteWebGLTexture(bitmapdata.webGLTexture);
                bitmapdata.webGLTexture = null;
                return false;
            }, this);
            //主要示例代码结束            
            this.isdisplay = true;
        }
        //发送消息
        openDataContext.postMessage({
            isDisplay: this.isdisplay,
            isFriend: true,
			isGroupRank: false
        });
    }
    public close(e: egret.TouchEvent){
        let that = this.parent;
        that.removeChild(this);
    }
}
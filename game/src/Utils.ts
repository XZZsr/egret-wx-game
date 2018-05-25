// TypeScript file
class Utils {
    public constructor(){}
    //分享的信息
    public shareInfo :Object = {};

    //舞台长宽
    public stageWidth   :   number = 750;
    public stageHeight   :   number = 1334;

    private static instance:Utils;
    //获取属性
    public static getInstance():Utils{
        if(this.instance == null){
            this.instance = new Utils();
        }
    	return this.instance;
    }
    //获取分享信息
    public getShareInfo(info = {}){
        this.shareInfo = info;
    }
    //设置舞台长宽
    public setStage(width,height){
        this.stageWidth = width;
        this.stageHeight = height;
    }
}
//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;
    /**
     * 创建场景界面
     * Create scene interface
     */

    private myEditableText:eui.EditableText = new eui.EditableText();
    private warn: eui.Label;
    protected createGameScene(): void {

        //设置舞台
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        Utils.getInstance().setStage(stageW,stageH);

        //判断是否群排行
        platform.getShareTicket().then(res=>{
            Utils.getInstance().getShareInfo(res);
            if (res['scene'] == 1044 || res['scene'] == 1007) {
                this.addChild(new GroupRank())
            }
        })
        //背景
        let bg = this.createBitmapByName("god_jpg");
        this.addChild(bg);
        bg.width = stageW;
        bg.height = stageH;

        //指定默认文本，用户可以自己输入，也可以将其删除
        this.myEditableText.text = "在这输入分数";
        //指定文本的颜色。
        this.myEditableText.textColor = 0x00CD00;                          
        //指定我们的文本输入框的宽和高    
        this.myEditableText.width = stageW;                 
        this.myEditableText.height = 100; 
        this.myEditableText.textAlign = 'center';
        //设置我们的文本编剧
        this.myEditableText.left = 0; 
        this.myEditableText.top = 100;
        this.addChild(this.myEditableText)
        //错误提示
        this.warn = new eui.Label();
        this.warn.textColor = 0xf20000;
        this.warn.width = stageW;
        this.warn.x = 0;
        this.warn.y = 200;
        this.warn.size = 24;
        this.warn.textAlign = 'center';
        this.addChild(this.warn)
        // let 
        //设置分数按钮
        let button1 = new eui.Button();
        button1.label = "设置分数";
        button1.horizontalCenter = 0;
        button1.verticalCenter = 0;
        this.addChild(button1);

        button1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.setScore, this);
        let button2 = new eui.Button();
        button2.label = "朋友排行";
        button2.horizontalCenter = 0;
        button2.verticalCenter = 100;
        this.addChild(button2);
        
        button2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showFriendRank, this);
        let button3 = new eui.Button();
        button3.label = "群排行";
        button3.horizontalCenter = 0;
        button3.verticalCenter = 200;
        this.addChild(button3);
        button3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showGroupRank, this);
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }

    /**
     * 点击按钮
     * Click the button
     */
    
    private setScore(e: egret.TouchEvent) {
        var res = /^[0-9]+.?[0-9]*$/
        let txt = this.myEditableText.text
        if(!res.test(txt)){
            this.warn.text = "请输入数字";
        }else{
            this.warn.text = "";
            platform.setScore(txt).then(res=>{
                this.warn.text = res;
            })
        }
    }
    //朋友排行榜
    private showFriendRank(e: egret.TouchEvent) {
        this.addChild(new FriendRank())
    }
    //群排行榜
    private showGroupRank(e: egret.TouchEvent) {
        platform.groupShare();
    }
}

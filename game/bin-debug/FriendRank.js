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
var FriendRank = (function (_super) {
    __extends(FriendRank, _super);
    function FriendRank() {
        var _this = _super.call(this) || this;
        _this.skinName = "FriendRankSkin";
        return _this;
    }
    FriendRank.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    FriendRank.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    return FriendRank;
}(eui.Component));
__reflect(FriendRank.prototype, "FriendRank", ["eui.UIComponent", "egret.DisplayObject"]);

const { WeiXin } = require("./weixin");

let accArr = WeiXin.getAllAccount();
log(accArr);

let c = WeiXin.getCurrentAccount();
log(c);

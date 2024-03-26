// const { WeiXin } = require("./weixin");

// let accArr = WeiXin.getAllAccount();
// log(accArr);

// let c = WeiXin.getCurrentAccount();
// log(c);

log();

let x = className("EditText").visibleToUser(true).clickable(true).find();
// x[0].setText("1");
// x[1].setText("2");
x[2].setText("1553733");
x[3].setText("1111");

text("确认").clickable(true).findOne().click();

// sleep(4000); //todo 等待提现成功

// 刷新，或者back吧。

// for (let a of x) {
//   log("xdfd");
//   a.setText("1553733"); //1553733
// }

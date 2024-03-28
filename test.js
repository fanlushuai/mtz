// // const { WeiXin } = require("./weixin");

const { AutojsUtil } = require("./autojsUtil");

// // let accArr = WeiXin.getAllAccount();
// // log(accArr);

// // let c = WeiXin.getCurrentAccount();
// // log(c);

// log();

// let x = className("EditText").visibleToUser(true).clickable(true).find();
// // x[0].setText("1");
// // x[1].setText("2");
// x[2].setText("1553733");
// x[3].setText("1111");

// text("确认").clickable(true).findOne().click();

// // sleep(4000); //todo 等待提现成功

// // 刷新，或者back吧。

// // for (let a of x) {
// //   log("xdfd");
// //   a.setText("1553733"); //1553733
// // }

// engines.stopAll();

// AutojsUtil.pageDownBySwipe();
// log(text("互助活动").findOne().parent());

let e = text("我知道了").visibleToUser(true).clickable(true).findOne(3000);
log(AutojsUtil.isInScreen(e));
log(e);
// log(text("文章阅读推荐").find());

// function getTop() {
//   let a = text("文章阅读推荐").visibleToUser(true).find();
//   for (let b of a) {
//     let c = b.parent().find(text("每日可领取600-1200"));
//     if (c.size() == 0) {
//       // log(b.bounds());
//       return b.bounds().top;
//     }
//   }
// }

// let top = getTop();
// let buttom = text("长按识别开始阅读").findOne().bounds().top;
// log(buttom);
// let x = device.width / 2;
// let y = top + (buttom - top) / 2;

// AutojsUtil.showPoint(100, 200);

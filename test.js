const { AutojsUtil } = require("./autojsUtil");
const { WeiXin } = require("./weixin");

let t=text("文章阅读推荐").findOne(10000)
// let t=text("111311").findOne(1000)
// log(t)
// log(t)

log(t==null)
// log(t==false)
// log("{}"==t)
// log(t.text())
// log(t.parent())

// let ele = AutojsUtil.getEleBySelectorWithRetry(
//     text("文章阅读推荐"),
//     "文章阅读推荐",
//     5,
//     "微信",
//     function () {
//       WeiXin.refreshWeb();
//     }
//   );

//   log("1111111")
//   log(ele)
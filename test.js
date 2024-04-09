const { AutojsUtil } = require("./autojsUtil");
const { MTZ } = require("./mtz");
const { WeiXin } = require("./weixin");

AutojsUtil.testAndBack(
  function () {
    // return id("title").text("设置").findOnce() != null

    // return text("发现").findOnce() != null
    // return id("ouv").findOnce() != null
    sleep(800);
    return !desc("返回").exists();
  },
  10,
  WeiXin.backTab
);

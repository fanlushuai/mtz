const { AutojsUtil } = require("./autojsUtil");
const { DailyStorage } = require("./dailyStorage");
const { WeiXin } = require("./weixin");

const MTZ = {
  //  美添赚
  flushAll: function () {
    log("重载所有");
    back();
  },
  myPage: function () {
    // sleep(1000)

    log("我的主页");
    while (1) {
      let e = text("我的主页").findOne(3 * 1000);
      if (e) {
        log("点击 我的主页");
        AutojsUtil.clickEle(e.parent());

        sleep(2000);
        if (textMatches(/(.*今日签到.*)/).exists()) {
          break;
        }

        WeiXin.refreshWeb();
      } else {
        log("没有找到");
        WeiXin.refreshWeb();
      }
    }
  },
  sign: function () {
    log("签到"); //这个位置卡住了

    while (1) {
      let ele = textMatches(/(.*今日签到.*)/).findOne(5 * 1000);

      if (ele) {
        let eles = ele.parent().find(text("点击领取"));
        if (eles) {
          log("点击 点击领取");
          AutojsUtil.clickEle(eles[0]);

          // 签到成功，会有弹窗

          if (AutojsUtil.waitFor(text("长按或截图保存推广海报"), 5)) {
            log("签到成功");
            DailyStorage.setSignToday();

            sleep(1000);
            WeiXin.refreshWeb(); //关闭签到的弹窗
          }
        } else {
          log("没有找到签到，可能已经签到");
        }

        return;
      } else {
        log("没有找到");
        WeiXin.refreshWeb();
      }
    }
  },
  helpEach: function () {
    log("互动活动");
    // while (1) {
    //     let e = text("互助活动").findOne(5 * 1000)
    //     if (e) {
    //         log("点击 互助活动")
    //         AutojsUtil.clickEle(e)
    //         break
    //     } else {
    //         log("没有找到")
    //         WeiXin.refreshWeb()
    //     }
    // }

    // sleep(1.5 * 1000)
    AutojsUtil.clickSelectorWithAutoRefresh(
      text("互助活动"),
      "互助活动",
      10,
      "微信",
      function () {
        WeiXin.refreshWeb();
      }
    );
  },

  activeRead: function () {
    sleep(1000);

    log("参加文章阅读推荐");

    let ele = AutojsUtil.getEleBySelectorWithAutoRefresh(
      text("文章阅读推荐"),
      "文章阅读推荐",
      10,
      "微信",
      function () {
        WeiXin.refreshWeb();
      }
    );

    while (1) {
      let eles = ele.parent().find(text("开始活动"));
      if (eles && eles.length > 0) {
        AutojsUtil.clickEle(eles[0]);

        sleep(1000);

        // 活动获取中

        if (AutojsUtil.waitFor(text("长按识别开始阅读"), 4)) {
          log("发现二维码弹窗");
          return true;
        }
      } else {
        log("开始活动，未找到");
        //todo 查看时间 剩余54分钟

        let leftTimeEle = ele.parent().findOne(textMatches(/(剩余\d+分钟)/));
        if (leftTimeEle) {
          let miniteStr = leftTimeEle
            .getText()
            .replace("剩余", "")
            .replace("分钟", "");
          let futureTime =
            parseInt(miniteStr) * 1000 * 60 + new Date().getTime();

          DailyStorage.setReadNextTime(futureTime);
        }
        return false;
        // let leftEles = ele.parent().find(textMatches("剩余"))
        // if (leftEles) {
        //     log("活动已经参与 %s", leftEles[0].getText())
        //     return false
        // }
      }
    }
  },
  read: function () {
    log("开始阅读");

    log("第一次等待长一点");
    // 需要进去，等待他获取，然后跳入第一篇文章
    AutojsUtil.waitFor(idMatches("activity-name"), 8);
    log("进入第一篇文章");

    while (1) {
      let randomNum = random(10, 15);
      log("阅读 %s 秒", randomNum);
      sleep(randomNum * 1000);

      log("后退被动刷新");
      back();

      let yetBackEle = text("长按或截图保存推广海报").findOne(4 * 1000);
      if (yetBackEle) {
        log("已经返回了");
        break;
      }
    }

    // let timesLimit = timesLimit || 20
    // let doTimes = 0
    // while (1) {

    //     let publishTime = id("publish_time").findOne(10 * 1000)
    //     if (publishTime) {
    //         log("文章发布时间 %s", publishTime)

    //         let randomNum = random(6, 8)
    //         log("开始随机阅读 %s 秒", randomNum)
    //         sleep(randomNum)
    //         doTimes++
    //         log("第 %s 次阅读", doTimes)
    //         if (doTimes >= timesLimit) {
    //             log("阅读次数达标")
    //             break
    //         }

    //         log("切换文章")
    //         back()
    //         sleep(1000)
    //     } else {
    //         log("没有找到发布时间")
    //         back()
    //     }
    // }
  },
  getQrPosition: function () {
    log("获取二维码粗略坐标");
    let t2 = text("长按识别开始阅读").findOne();
    let t1 = text("240积分/轮").visibleToUser(true).findOne(); //这个要放在上面的下面。因为，平面上也有，弹窗上也有

    let qrX = device.width / 2;
    let qrY =
      t1.bounds().top + parseInt((t2.bounds().top - t1.bounds().top) / 2);

    return { x: qrX, y: qrY };
  },
  exchange: function () {
    log("兑换");
    AutojsUtil.clickSelectorWithAutoRefresh(text("兑换"), "兑换", 10, "微信");
  },
  payout2WeiXin: function () {
    log("提现到微信");
    AutojsUtil.clickSelectorWithAutoRefresh(
      text("提现到微信"),
      "提现到微信",
      10,
      "微信"
    );
  },
  transferScore: function () {
    log("积分转移");
    AutojsUtil.clickSelectorWithAutoRefresh(
      text("积分转移"),
      "积分转移",
      10,
      "微信"
    );
    sleep(1000);
    log("再次点击 积分转移");
    let e = text("积分转移").clickable(true).findOne();
    AutojsUtil.clickEle(e);
  },
  tryLookError: function () {
    let ele = textMatches(/(.*悬浮窗已失效,请重新扫码进入.*)/).findOne(1500);
    if (ele) {
      log(ele.getText());
      return true;
    }
  },
  getUserId: function () {
    let e = textMatches(/(用户ID：\d+)/).findOne();
    let userId = e.getText().split("：")[1];
    log(userId);
    return userId;
  },
  tryNotification: function () {
    let e = text("我知道了").findOne(2000);
    if (e) {
      log("阅读公告");
      sleep(4000);
      log("点击 我知道了");
      AutojsUtil.clickEle(e);
    } else {
      log("没发现公告");
    }
  },
};

// MTZ.getUserId()
// MTZ.exchange()
// MTZ.transferScore()
// sleep(2000)
// MTZ.transferScore()

// log(find())

// AutojsUtil.clickEle(text("输入用户ID").findOne())
// let e=text("输入用户ID").findOne()
// sleep(1000*1)
// e.setText(dfdf)
// e.input(1111)

// log(desc("返回").findOne())
// log(desc("@").findOne())
// log(desc("下一步").findOne())

// setText([0],"1111")
// setText(1,"ddd")

// AutojsUtil.clickEle(text("输入用户ID").findOne())
// log("dfdf")
// text("输入提现密码").findOne().setText("dfdfdfdf")

// text("用户ID：1553733")

// log(textMatches(/(用户ID：\d+)/).findOne())

// log("开始")
// let title = idMatches("activity-name").findOnce()
// log(title)

// // log(find())

// // text("奖积分获取中请稍后")

// log(text("奖积分获取中请稍后").findOnce())
// MTZ.read(10)

module.exports = {
  MTZ,
};
// MTZ.payout2WeiXin()
// MTZ.transferScore()

// text("创建密码(4位数字即可，建议手机号后4位)").findOne().setText("12312313")

// back()

// MTZ.helpEach()

// log(text("文章阅读推荐").findOne().parent().find(text("开始活动"))
// )

// MTZ.activeRead()

// MTZ.longPressQr()
// MTZ.exchange()

// MTZ.myPage()

// log(text("活动获取中").findOne())

// bounds("(140,1511,753,1565)") 1538
// bounds("(774,1500,996,1573)") 1536.5

// MTZ.sign()

// AutojsUtil.clickSelectorWithAutoRefresh(text(""), "x", 10, this.name)

// log(text("").visibleToUser(true).drawingOrder("0").indexInParent("0").depth("24").find())

// AutojsUtil.clickEle(text("").visibleToUser(true).drawingOrder("0").indexInParent("0").depth("24").find())

// boundsInParent: Rect(13, 12 - 45, 46); boundsInScreen: Rect(496, 1956 - 583, 2048);

// boundsInParent: Rect(11, 10 - 39, 39); boundsInScreen: Rect(502, 1857 - 577, 1935); packageName:

// boundsInParent: Rect(13, 12 - 45, 47); boundsInScreen: Rect(496, 2097 - 583, 2191); packageName: com.tencent.mm; className: android

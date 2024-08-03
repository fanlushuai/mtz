const { AutojsUtil } = require("./autojsUtil");
const { DailyStorage } = require("./dailyStorage");
const { pushplus } = require("./msgPush");
const { readStatics } = require("./statics");
const { WeiXin } = require("./weixin");

const MTZ = {
  withdrawPW: "1111",
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
        log("点 我的主页");
        AutojsUtil.clickEle(e.parent());

        sleep(2000);
        if (textMatches(/(.*积分3000以上奖励300.*)/).exists()) {
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
    function clickQiandao() {
      let testBelowEle = text("活动积分3000以上奖励300积分").findOne(5000);

      if (testBelowEle == null) {
        return false;
      }

      let b = testBelowEle.bounds();

      let maxHeight = b.top;

      log("最大高度 %d", maxHeight);

      let actionsEles = text("点击领取").find();
      for (let actionsEle of actionsEles) {
        // log(actionsEle.text());
        // log(actionsEle.bounds().top);
        if (actionsEle.bounds().top < maxHeight) {
          log("获得目标 点击领取 高度 %d", actionsEle.bounds().top);
          AutojsUtil.clickEle(actionsEle);
          return true;
        }
      }

      return false;
    }

    log("签到"); //这个位置卡住了

    if (clickQiandao()) {
      // 签到成功，会有弹窗

      if (AutojsUtil.waitFor(text("长按或截图保存推广海报"), 5)) {
        log("签到成功");
        DailyStorage.setSignToday();

        sleep(1000);
        WeiXin.refreshWeb(); //关闭签到的弹窗
      }

      return true;
    } else {
      return false;
    }
  },
  helpEach: function () {
    log("互动活动");

    let e = AutojsUtil.getEleBySelectorWithAutoRefresh(
      text("互助活动"),
      "互助活动",
      10,
      "微信",
      function () {
        WeiXin.refreshWeb();
      }
    );

    log("点 互助活动");
    AutojsUtil.clickEle(e.parent());

    // AutojsUtil.clickSelectorWithAutoRefresh(
    //   text("互助活动"),
    //   "互助活动",
    //   10,
    //   "微信",
    //   function () {
    //     WeiXin.refreshWeb();
    //   }
    // );

    // 莫名其妙，有时候会弹出来
    // sleep(1.5 * 1000);
    this.tryNotification();
  },
  tryGetSetLeftReadTime: function () {
    let ele = AutojsUtil.getEleBySelectorWithAutoRefresh(
      text("文章阅读推荐"),
      "文章阅读推荐",
      5,
      "微信",
      function () {
        WeiXin.refreshWeb();
      }
    );

    if (ele) {
      log("未找到文章阅读推荐元素");
      return;
    }

    //剩余54分钟
    // 剩余1小时15分钟
    let leftTimeEle = ele.parent().findOne(textMatches(/(剩余.+分钟)/));
    if (leftTimeEle) {
      let textStr = leftTimeEle
        .getText()
        .replace("剩余", "")
        .replace("分钟", "");

      let futureTime;
      if (textStr.indexOf("小时") > 0) {
        let time2 = textStr.split("小时");
        futureTime =
          parseInt(time2[0]) * 1000 * 60 * 60 +
          time2[1] * 1000 * 60 +
          new Date().getTime();
      } else {
        futureTime = parseInt(textStr) * 1000 * 60 + new Date().getTime();
      }

      log("设置剩余时间到内存 %s", futureTime);

      DailyStorage.setReadNextTime(futureTime);
    }
  },

  activeRead: function () {
    sleep(1000);

    log("参加文章阅读推荐");

    let ele = AutojsUtil.getEleBySelectorWithRetry(
      text("文章阅读推荐"),
      "文章阅读推荐",
      5,
      "微信",
      function () {
        WeiXin.refreshWeb();
      }
    );

    if (ele == null) {
      // 有时候账号没有，文章阅读选项
      log("没有发现文章阅读推荐");
      log("设置此账号休息一个半小时，怎么会没有呢？？");

      pushplus.push("没有发现阅读活动跳过", "没有发现阅读活动");
      let now = new Date();
      now.setHours(now.getHours() + 1.5);

      DailyStorage.setReadNextTime(now.getTime());
      return;
    }

    let maxRetryTimes = 5;
    let retry = 0;

    while (1) {
      let eles = ele.parent().find(text("开始活动"));
      if (eles && eles.length > 0) {
        AutojsUtil.clickEle(eles[0]);

        sleep(1000);

        // 活动获取中

        if (AutojsUtil.waitFor(text("长按识别开始阅读"), 4)) {
          log("发现二维码弹窗");
          return true;
        } else {
          log("获取活动二维码超时");
          retry++;
          if (retry >= maxRetryTimes) {
            log("多次找不到二维码，猜测此账号频率过快");
            log("设置此账号休息一个半小时");

            let now = new Date();
            now.setHours(now.getHours() + 1.5);

            DailyStorage.setReadNextTime(now.getTime());
            break;
          }
        }
      } else {
        log("开始活动，未找到");
        //剩余54分钟
        // 剩余1小时15分钟
        let leftTimeEle = ele.parent().findOne(textMatches(/(剩余.+分钟)/));
        if (leftTimeEle) {
          let textStr = leftTimeEle
            .getText()
            .replace("剩余", "")
            .replace("分钟", "");

          let futureTime;
          if (textStr.indexOf("小时") > 0) {
            let time2 = textStr.split("小时");
            futureTime =
              parseInt(time2[0]) * 1000 * 60 * 60 +
              time2[1] * 1000 * 60 +
              new Date().getTime();
          } else {
            futureTime = parseInt(textStr) * 1000 * 60 + new Date().getTime();
          }

          log("随机增加一个时间，防止被检测");
          let futureTimePlus = futureTime + random(2, 6) * 1000 * 60;

          DailyStorage.setReadNextTime(futureTimePlus);
        } else {
          log("没有找到剩余时间");
        }
        return false;
      }
    }
  },
  read: function () {
    log("开始阅读");

    log("第一次等待长一点");

    // 判断是否存在，继续访问。安全限制。

    let eleError = text("继续访问").findOne(8000);
    if (eleError != null) {
      log("点击 继续访问");
      AutojsUtil.clickEle(eleError);
    }

    // 需要进去，等待他获取，然后跳入第一篇文章
    AutojsUtil.waitFor(idMatches("activity-name"), 8);

    let docCount = 1;

    while (1) {
      log("等待进入第 %s 篇文章，最长等15s", docCount);
      let ok = AutojsUtil.waitFor(idMatches("activity-name"), 20);
      if (ok) {
        log("已进入 %s", docCount);
        docCount++;

        // 模拟阅读，进行向下滑动。大概滑动5次吧。

        log("模拟阅读10s");
        let times = 0;
        do {
          sleep(2000);
          AutojsUtil.pageDownBySwipe();
          times++;
        } while (times < 5);

        // let randomNum = random(10, 15);
        let randomNum = random(0, 5);
        log("随机阅读 %s 秒", randomNum);
        sleep(randomNum * 1000);
      } else {
        log("进入失败");
      }

      log("后退");
      back();
      log("等待被动刷新");

      let yetBackEle = text("长按或截图保存推广海报").findOne(4 * 1000);
      if (yetBackEle) {
        log("已经返回了");
        //
        WeiXin.refreshWeb();

        break;
      }
    }

    log("本轮共阅读 %s 篇", docCount - 1);
    readStatics.add(DailyStorage.currentAccount, docCount - 1);
  },
  getQrPosition: function () {
    log("获取二维码粗略坐标");

    function getTop() {
      let a = text("文章阅读推荐").visibleToUser(true).find();
      for (let b of a) {
        let c = b.parent().find(text("每日可领取600-1200"));
        if (c.size() == 0) {
          // log(b.bounds());
          return b.bounds().top;
        }
      }
    }

    let top = getTop();
    let buttom = text("长按识别开始阅读").findOne().bounds().top;
    log(buttom);
    let qrX = device.width / 2;
    let qrY = top + (buttom - top) / 2;

    return { x: qrX, y: qrY };
  },
  exchange: function () {
    log("兑换");
    AutojsUtil.clickSelectorWithAutoRefresh(text("兑换"), "兑换", 10, "微信");
  },
  payout2WeiXin: function (userId) {
    log("--> 进行提现");
    AutojsUtil.clickSelectorWithAutoRefresh(
      text("提现到微信"),
      "提现到微信",
      10,
      "微信"
    );

    if (AutojsUtil.waitFor(text("抱歉提现金额最低1元"), 3)) {
      log("提现额度太小，结束");
      WeiXin.refreshWeb();
      return;
    }

    log("输入账号，密码");

    let withdrawEditEle = text("输入提现密码")
      .findOne()
      .parent()
      .findOne(className("EditText"));
    withdrawEditEle.setText(this.withdrawPW);

    let userIdEditEle = text("输入用户ID")
      .findOne()
      .parent()
      .findOne(className("EditText"));
    userIdEditEle.setText(userId);

    log("确认");
    AutojsUtil.clickEle(text("确认").clickable(true).findOne());

    log("等待提现成功");
    sleep(4000); //todo 等待提现成功

    // 刷新，或者back吧
    WeiXin.refreshWeb();
  },
  transferScore: function (userId) {
    log("--> 转移积分");
    sleep(2000);
    AutojsUtil.clickSelectorWithAutoRefresh(
      text("积分转移"),
      "积分转移",
      10,
      "微信"
    );
    sleep(2000);
    log("再次点击 积分转移");
    let e = text("积分转移").clickable(true).findOne();
    AutojsUtil.clickEle(e);

    // 抱歉转移最低1积分
    if (AutojsUtil.waitFor(text("抱歉转移最低1积分"), 3)) {
      log("积分不够，结束");
      WeiXin.refreshWeb();

      return;
    }

    sleep(1000);
    log("输入账号，密码");
    let x = className("EditText").visibleToUser(true).clickable(true).find();
    // x[0].setText("1");
    // x[1].setText("2");
    // x[2].setText("1553733");
    x[2].setText(userId);
    x[3].setText(this.withdrawPW);

    log("确认");
    AutojsUtil.clickEle(text("确认").clickable(true).findOne());

    sleep(3000);

    WeiXin.refreshWeb();
  },
  tryLookError: function () {
    let ele = textMatches(/(.*悬浮窗已失效,请重新扫码进入.*)/).findOne(1500);
    if (ele) {
      log(ele.getText());
      return true;
    }
  },
  getUserId: function () {
    let userIDELe;
    while (1) {
      userIDELe = AutojsUtil.getEleBySelectorWithAutoRefresh(
        textMatches(/(用户ID.*)/),
        "获取用户id",
        8,
        "微信",
        function () {
          WeiXin.refreshWeb();
          sleep(2000);
        }
      );

      if (userIDELe) {
        break;
      }
    }

    let userId = userIDELe.text().replace("用户ID：", "");

    log("用户id %s", userId);
    return userId;
  },
  tryNotification: function () {
    log("等待页面完整加载");
    AutojsUtil.waitFor(text("问题反馈"), 8);
    sleep(3000);

    AutojsUtil.pageDownBySwipe();

    let eles = text("我知道了").visibleToUser(true).clickable(true).find();

    if (eles == null || eles.empty()) {
      log("没有找到公告");
      return;
    }

    // let questionFeedbackEle = text("问题反馈")
    //   .visibleToUser(true)
    //   .clickable(true)
    //   .findOne(3000);

    // let eleArr = [];

    // for (let ele of eles) {
    //   if (questionFeedbackEle && ele) {
    //     if (questionFeedbackEle.bounds().top > ele.bounds().top) {
    //       log("此，我知道了，位置不对");
    //       return;
    //     } else {
    //       eleArr.push(ele);
    //     }
    //   }
    // }

    for (let e of eles) {
      log("阅读公告");
      sleep(4000);
      log("点 我知道了");
      AutojsUtil.clickEle(e);
    }
  },
};

module.exports = {
  MTZ,
};

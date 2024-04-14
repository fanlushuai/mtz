const { Config } = require("./config.js");
const { DailyStorage } = require("./dailyStorage");
const { pushplus } = require("./msgPush.js");
const { MTZ } = require("./mtz.js");
const { readStatics } = require("./statics.js");
const { WeiXin } = require("./weixin");

const Robot = {
  currentAccount: "",
  jump2MTZ: function () {
    log("开始进入每添赚");
    WeiXin.intoStarDir();
    WeiXin.searchByTag();
    WeiXin.chooseFirst();
    WeiXin.longPressPic(device.width / 2, device.height / 2); //fix 假设哪个就是一个图片
    WeiXin.jumpByqrCode(function () {
      WeiXin.longPressPic(device.width / 2, device.height / 2);
    });

    // 首次进入，网站多次跳转，反应很慢
    sleep(6 * 1000);
  },
  sign: function () {
    log("-->开始签到");
    MTZ.myPage();
    MTZ.sign();
  },
  joinReadActive: function () {
    log("开始阅读推荐");
    // MTZ.flushAll()
    MTZ.helpEach();
    if (MTZ.activeRead()) {
      let qrPosition = MTZ.getQrPosition();

      // AutojsUtil.showPoint(qrPosition);

      WeiXin.longPressPic(qrPosition.x, qrPosition.y); //减去头部  ！！！！！非常重要
      WeiXin.jumpByqrCode(function () {
        MTZ.tryNotification();
        let qrPosition = MTZ.getQrPosition();
        WeiXin.longPressPic(qrPosition.x, qrPosition.y);
      });

      // 3秒反应，进入文章。
      sleep(3 * 1000);

      MTZ.read();

      MTZ.tryGetSetLeftReadTime();
    } else {
      log("跳过阅读");
    }

    // todo 阅读规则？？
  },
  exchange: function () {
    log("开始兑换");
    let userId = MTZ.getUserId();
    MTZ.exchange();

    // 如果账号为，配置的账号。那么进行提现，否则进行积分转移
    if (Config.withdrawUserId == userId) {
      MTZ.payout2WeiXin(userId);
    } else {
      MTZ.transferScore(userId);
    }

    DailyStorage.setTransferScoreToday();
  },
  changeNextAccount: function (cuAcc) {
    let accArr = WeiXin.getAllAccount();
    // 切换到一个，有动作的账号。没有动作切他干啥？？？
    //过滤所有的账号。看看，有没有动作
    accArr = DailyStorage.canDoAccounts(accArr);

    if (cuAcc == null) {
      cuAcc = WeiXin.getCurrentAccount();
      log("获取当前账号 %s", cuAcc);
    } else {
      log("当前账号 %s", cuAcc);
    }

    function getNext(accArr, cuAcc) {
      let currentIndex = accArr.indexOf(cuAcc);
      console.log("当前账号索引 %s", currentIndex);
      let targetIndex;
      if (currentIndex < 0) {
        targetIndex = 0; //如果不存在，就设置到第一个
      } else {
        targetIndex =
          currentIndex + 1 > accArr.length - 1 ? 0 : currentIndex + 1;
      }
      return accArr[targetIndex];
    }

    let targetAccName = getNext(accArr, cuAcc);
    log("切换账号到 %s", targetAccName);

    if (targetAccName == cuAcc) {
      log("当前账号和目标账号一样");
      // sleep(5 * 60 * 1000);
      log("回退到首页");
      WeiXin.back2Settings();

      return;
    }

    if (!WeiXin.changeAccTo(targetAccName)) {
      log("继续切换");
      this.changeNextAccount(targetAccName);
    } else {
      log("切换成功");
      sleep(2000);
      this.currentAccount = targetAccName;
    }
  },

  taskMTZ: function () {
    // 判断一下，有没有公告

    // todo 签到，一般一天搞一次即可

    if (!DailyStorage.yetSignToday()) {
      this.sign();
    } else {
      log("内存里发现已经签名，跳过");
    }

    sleep(1000);

    if (!DailyStorage.yetTransferScoreToday()) {
      this.exchange();
    } else {
      log("内存里发现已经兑换，跳过");
    }

    // todo 参加活动，可以返回一下，还剩多少时间。方便任务高效调度。

    if (DailyStorage.canReadNow()) {
      this.joinReadActive();
      sleep(1000);
    }

    // 有时候无脑back会失败。所以，尝试刷新一下，再搞
    WeiXin.refreshWeb();
    WeiXin.back2Settings();
  },
  taskSwichAcc: function () {
    log("切换下一个账号");
    WeiXin.settings();
    WeiXin.cilckChangeAccount();
    this.changeNextAccount();
  },
  start: function () {
    WeiXin.boot();
    while (1) {
      log("开始任务");
      Robot.currentAccount = WeiXin.wo();
      DailyStorage.currentAccount = Robot.currentAccount;

      log("当前微信账号 %s", DailyStorage.currentAccount);

      if (!DailyStorage.yetReportYesterday()) {
        log("开始 报告数据");
        let staticsLog = readStatics.getYesterdayReport();
        if (staticsLog && staticsLog != "") {
          pushplus.push("昨日数据统计", staticsLog);
          // 清空之后，就不会重复发送了。
          readStatics.clearYesterdayStatics();
        }
        DailyStorage.setReportYesterday();
      }

      if (
        DailyStorage.yetSignToday() &&
        !DailyStorage.canReadNow() &&
        DailyStorage.yetTransferScoreToday()
      ) {
        log("此账号不需要任何操作");
      } else {
        this.jump2MTZ(); //跳入美添赚
        MTZ.tryNotification(); //尝试发现，和关闭通知
        this.taskMTZ(); // 签到，阅读互动，提款、提积分
      }
      this.taskSwichAcc();
    }
  },
};

// Robot.taskSwichAcc()

module.exports = {
  Robot,
};

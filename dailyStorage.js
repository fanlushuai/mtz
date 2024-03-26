const DailyStorage = {
  currentAccount: "",
  localStorage: function () {
    // 每个账号，每天一个存储
    return storages.create(
      new Date().getMonth() +
        "" +
        new Date().getDate() +
        "ds" +
        DailyStorage.currentAccount
    );
  },
  localStorage2: function () {
    // 每个账号，每天一个存储
    return storages.create("ds" + DailyStorage.currentAccount);
  },
  setSignToday: function () {
    log("设置 已经签到 标记");
    this.localStorage().put("sign", true);
  },
  yetSignToday: function () {
    return this.localStorage().get("sign", false);
  },
  setWithdrawToday: function () {
    log("设置 已经提现 标记");
    this.localStorage().put("Withdraw", true);
  },
  yetWithdrawToday: function () {
    return this.localStorage().get("Withdraw", false);
  },
  setTransferScoreToday: function () {
    log("设置 转移积分 标记");
    this.localStorage().put("TransferScore", true);
  },
  yetTransferScoreToday: function () {
    return this.localStorage().get("TransferScore", false);
  },

  setReadNextTime: function (futureTime) {
    // 剩余54分钟
    // 剩余1小时15分钟
    this.localStorage2().put("readNextTime", futureTime);
  },
  canReadNow: function () {
    let readNextTime = this.localStorage2().get("readNextTime");
    if (readNextTime) {
      // todo 格式化一下数据。判断一下时间
      if (new Date().getTime() > readNextTime) {
        log("过了限制时间");
        return true;
      } else {
        log("还没有过限制时间");
        return false;
      }
    }

    log("没有发现限制时间");
    return true;
  },
  canDoAccounts: function (accountArr) {
    log("阻塞等待，存在有效动作的账号");
    let canA = [];
    while (1) {
      for (let accont of accountArr) {
        DailyStorage.currentAccount = accont;
        if (
          !DailyStorage.yetSignToday() ||
          DailyStorage.canReadNow() ||
          !DailyStorage.yetTransferScoreToday()
        ) {
          canA.push(accont);
        }
      }
      log("获取所有具备有效动作的账号 %s", canA);

      if (canA.length > 0) {
        break;
      }

      sleep(2000);
    }

    return canA;
  },
};

module.exports = {
  DailyStorage,
};

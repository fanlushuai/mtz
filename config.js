const Config = {
  withdrawUserId: "",
  pushToken: "",
  setLSConfig2UI: function () {
    log("配置 本地->UI");

    let lS = this.localStorage();

    let withdrawUserId = lS.get("withdrawUserId", "");
    ui.withdrawUserId.setText(withdrawUserId);
    this.withdrawUserId = withdrawUserId;

    let pushToken = lS.get("pushToken", "");
    ui.pushToken.setText(pushToken);
    this.pushToken = pushToken;
  },
  setUI2LSConfig: function () {
    log("配置 UI->本地");
    let lS = this.localStorage();

    let withdrawUserId = ui.withdrawUserId.getText();
    if (withdrawUserId == null) {
      withdrawUserId = "";
    }
    this.withdrawUserId = withdrawUserId;
    log(withdrawUserId);
    lS.put("withdrawUserId", withdrawUserId + "");

    let pushToken = ui.pushToken.getText();
    if (pushToken == null) {
      pushToken = "";
    }
    this.pushToken = pushToken;
    log(pushToken);
    lS.put("pushToken", pushToken + "");

    let s = storages.create("msgpush-autojsx123455");
    s.put("pushToken", pushToken + "");
  },
  loadConfig: function () {
    log("配置 本地->内存");

    let lS = this.localStorage();

    let withdrawUserId = lS.get("withdrawUserId", "");
    this.withdrawUserId = withdrawUserId;
    log("提现ID" + withdrawUserId);

    let pushToken = lS.get("pushToken", "");
    this.pushToken = pushToken;
    log("pushToken" + pushToken);
  },
  localStorage: function () {
    return storages.create("ShowMeCodeMTZ");
  },
};

module.exports = {
  Config,
};

const Config = {
  withdrawUserId: "",
  setLSConfig2UI: function () {
    log("配置 本地->UI");

    let lS = this.localStorage();

    let withdrawUserId = lS.get("withdrawUserId", "");
    ui.withdrawUserId.setText(withdrawUserId);
    this.withdrawUserId = withdrawUserId;
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
  },
  loadConfig: function () {
    log("配置 本地->内存");

    let lS = this.localStorage();

    let withdrawUserId = lS.get("withdrawUserId", "");
    this.withdrawUserId = withdrawUserId;
    log("提现ID" + withdrawUserId);
  },
  localStorage: function () {
    return storages.create("ShowMeCodeMTZ");
  },
};

module.exports = {
  Config,
};

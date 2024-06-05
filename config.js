const Config = {
  withdrawUserId: "",
  pushToken: "",
  disableAccounts: "",
  save: function (json) {
    if (json == null) {
      return;
    }
    let path = "/storage/emulated/0/mtz/config.json";
    if (!files.exists(path)) {
      log("创建配置文件");
      files.createWithDirs(path);
      files.write(path, JSON.stringify(json), (encoding = "utf-8"));
    } else {
      let content = files.read(path, (encoding = "utf-8"));
      if (content != "" || content != null) {
        jsonContent = JSON.parse(content);

        // 注意，这里需要添加
        if (
          jsonContent.pushToken != json.pushToken ||
          jsonContent.withdrawUserId != json.withdrawUserId ||
          jsonContent.disableAccounts != json.disableAccounts
        ) {
          log("更新配置");
          files.write(path, JSON.stringify(json), (encoding = "utf-8"));
        }
      }
    }
  },
  read: function () {
    let path = "/storage/emulated/0/mtz/config.json";
    if (!files.exists(path)) {
      log("配置文件不存在");
      return;
    }

    log("读取文件配置");

    let content = files.read(path, (encoding = "utf-8"));
    if (content != "" || content != null) {
      jsonContent = JSON.parse(content);
      return jsonContent;
    }
  },
  setLSConfig2UI: function () {
    log("配置 本地->UI");

    let lS = this.localStorage();

    let withdrawUserId = lS.get("withdrawUserId", "");
    this.withdrawUserId = withdrawUserId;

    let pushToken = lS.get("pushToken", "");
    this.pushToken = pushToken;

    let disableAccounts = lS.get("disableAccounts", "");
    this.disableAccounts = disableAccounts;

    ui.withdrawUserId.setText(withdrawUserId + "");
    ui.pushToken.setText(pushToken + "");
    ui.disableAccounts.setText(disableAccounts + "");
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

    let disableAccounts = ui.disableAccounts.getText();
    if (disableAccounts == null) {
      disableAccounts = "";
    }
    this.disableAccounts = disableAccounts;
    log(disableAccounts);
    lS.put("disableAccounts", disableAccounts + "");

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

    let disableAccounts = lS.get("disableAccounts", "");
    this.disableAccounts = disableAccounts;
    log("disableAccounts" + disableAccounts);
  },
  lsByFile: function () {
    let json = this.read();
    return {
      get: function (key, defalut) {
        let value = null;

        if (json == null) {
          log("未读取到配置");
          return defalut;
        }
        let script =
          "value= json." +
          key +
          " == null ? " +
          (defalut == null || defalut == "" ? '""' : defalut) +
          " : json." +
          key +
          ";";

        log(script);
        eval(script);
        return value;
      },
      put: function (key, value) {
        if (json == null) {
          json = {};
        }

        let scritp = "json." + key + ' ="' + value + '";';
        eval(scritp);
        Config.save(json);
      },
    };
  },
  localStorage: function () {
    return this.lsByFile();
    // return storages.create("ShowMeCodeMTZ");
  },
};

module.exports = {
  Config,
};

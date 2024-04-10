const pushplus = {
  push: function (title, content) {
    // https://pushplus.apifox.cn/api-107787114
    // https://www.pushplus.plus/send

    log("推送内容 %s %s", title, content)
    let s = storages.create("msgpush-autojsx123455");
    let token = s.get("pushToken");
    if (token) {
      let r = http.postJson("https://www.pushplus.plus/send", {
        //   token: "aa2534a208ad4782a0888d03139b846b",
        token: token,
        title: title,
        content: content,
        template: "txt",
      });
      if (r && r.statusCode == 200) {
        //   log(r.body.json());
        log("推送成功");
      } else {
        console.warn("推送失败");
      }
    } else {
      log("未配置推送token");
    }
  },
};

// push("测22试", "发现问dff题");

module.exports = {
  pushplus,
};

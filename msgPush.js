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
  // 截图转化为base64太大了。先放弃了
  pushFailCapture: function (title, content, imageBase64) {
    // https://pushplus.apifox.cn/api-107787114
    // https://www.pushplus.plus/send
    log("推送失败内容 %s %s", title, content)
    let s = storages.create("msgpush-autojsx123455");
    let token = s.get("pushToken");
    if (token) {

      function getHtmlContent(content, imageBase64) {
        let template = '<!DOCTYPE html> <html> <head> <meta charset="utf-8"> </head> <body> <p><h2>#content#</h2></p> <img src="#image#"  style="max-width: 100%"> </body> </html>'
        return template.replace("#content#", content).replace("#image#", imageBase64)
      }

      contentHtml = getHtmlContent(content, imageBase64)

      log(contentHtml)

      let r = http.postJson("https://www.pushplus.plus/send", {
        //   token: "aa2534a208ad4782a0888d03139b846b",
        token: token,
        title: title,
        content: contentHtml,
        template: "html",
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

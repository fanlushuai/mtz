const Autojsx = {
  boot: function () {
    home();
    sleep(1000);
    app.launchApp("Autox.js v6");
    sleep(1000);
    pageUpBySwipe();
  },
  backIfInbuildDir: function () {
    if (textMatches(/.*apk/).findOne(1000)) {
      // log("返回到首页")

      log("当前在build目录");

      back();
      sleep(500);
      back();
      sleep(500);
      pageUpBySwipe();

      this.boot();
      sleep(1000);
    }
  },
  pack: function (name) {
    click(id("name").text(name).findOne());

    click(id("build").findOne());

    log("关闭 显示启动界面");
    click(scrollUtillFind(text("显示启动界面")));

    // log("开启 需要后台弹出界面权限")
    // click(scrollUtillFind(text("需要后台弹出界面权限")))

    log("开启 需要无障碍服务");
    click(scrollUtillFind(text("需要无障碍服务")));

    // log("开启 需要悬浮窗权限")
    // click(scrollUtillFind(text("需要悬浮窗权限")))

    log("开启 简单加密js文件");
    click(scrollUtillFind(text("简单加密js文件")));

    log("点击 完成");
    click(desc("完成").findOne());

    while (!text("打包成功").exists()) {
      sleep(500);
    }
    log("打包成功");
  },
  back: function () {
    log("返回");
    back();
    sleep(800);
    back();
    sleep(800);
    click(text("直接退出").findOne(3000));

    this.buildDir();

    // log("返回到首页")
    // back()
    // sleep(500)
    // pageUpBySwipe()
  },
  buildDir: function () {
    log("跳转到build位置");
    click(text("build").id("name").findOne());

    toast("老板，打包完成！！");
  },
};

function click(b) {
  sleep(1 * 1000);
  press(b.bounds().centerX(), b.bounds().centerY(), 100);
  sleep(1 * 1000);
}

function scrollUtillFind(selector) {
  while (1) {
    let e = selector.findOne(1000);
    if (e) {
      sleep(300);
      return e;
    }
    pageDownBySwipe();
  }
}

function pageUpBySwipe() {
  var h = device.height; //屏幕高
  var w = device.width; //屏幕宽
  var x = random((w * 1) / 3, (w * 2) / 3); //横坐标随机。防止检测。
  var h1 = (h / 6) * 5; //纵坐标6分之5处
  var h2 = h / 6; //纵坐标6分之1处
  swipe(x, h2, x, h1, 500); //向上翻页(从纵坐标6分之1处拖到纵坐标6分之5处)
}

function pageDownBySwipe() {
  var h = device.height; //屏幕高
  var w = device.width; //屏幕宽
  // var x = (w / 3) * 2; //横坐标2/3处。
  var x = random((w * 2) / 5, (w * 3) / 5); //横坐标随机。防止检测。
  var h1 = (h / 6) * 5; //纵坐标6分之5处
  var h2 = h / 6; //纵坐标6分之1处
  swipe(x, h1, x, h2, 100); //向下翻页(从纵坐标6分之5处拖到纵坐标6分之1处)
}

let projectName = "mtz-package";

Autojsx.boot();
Autojsx.backIfInbuildDir();
Autojsx.pack(projectName);
Autojsx.back();

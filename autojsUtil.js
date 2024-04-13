const { DailyStorage } = require("./dailyStorage");
const { pushplus } = require("./msgPush");
const { Smms } = require("./smms");

const AutojsUtil = {
  randomSleep: function (maxSecend, minSecend) {
    // return;
    if (!minSecend) {
      minSecend = 0;
    }
    let randomNum = random(minSecend * 1000, maxSecend * 1000);

    log("随机休息 %s", randomNum);
    sleep(randomNum);
  },
  keepScreen: function () {
    log("设备会保持常亮");
    device.keepScreenOn(3600 * 1000);
    device.setBrightness(2);
  },
  buttonEnable: function (uiEle, text) {
    if (uiEle.getText() == text) {
      return;
    }
    log("按钮启用");
    ui.run(function () {
      uiEle.setEnabled(true);

      uiEle.setText(text);
      uiEle.setBackgroundColor(
        AutojsUtil.反色(uiEle.getBackground().getColor())
      );
    });
  },
  buttonDisable: function (uiEle, text) {
    if (uiEle.getText() == text) {
      return;
    }
    log("按钮禁止");

    ui.run(function () {
      uiEle.setText(text);
      uiEle.setBackgroundColor(
        AutojsUtil.反色(uiEle.getBackground().getColor())
      );
      uiEle.setEnabled(false);
    });
  },
  // 按钮闪烁
  buttonFlashing: function (uiEle, tipText) {
    ui.run(function () {
      let beforeText = uiEle.getText();

      uiEle.setBackgroundColor(
        AutojsUtil.反色(uiEle.getBackground().getColor())
      );
      uiEle.setText(tipText);

      setTimeout(() => {
        uiEle.setBackgroundColor(
          AutojsUtil.反色(uiEle.getBackground().getColor())
        );
        uiEle.setText(beforeText);
      }, 600);
    });
  },
  反色: function (color) {
    return (
      -1 -
      colors.argb(0, colors.red(color), colors.green(color), colors.blue(color))
    );
  },
  AddFloatContrlButton: function (taskFunc) {
    // 悬浮窗文档 https://cloud.tencent.com/developer/article/2078104
    window = floaty.window(
      new XML(
        '<frame><button id="action" text="停" w="*" h="*" bg="#FF00FF" /></frame>'
      )
    );

    window.exitOnClose(); //注册退出，退出脚本

    // setInterval(() => { }, 1000);

    let x, y, windowX, windowY, downTime;
    window.action.setOnTouchListener(function (view, event) {
      let callProp0 = event.getAction();
      if (event.ACTION_DOWN === callProp0) {
        x = event.getRawX();
        y = event.getRawY();
        windowX = window.getX();
        windowY = window.getY();
        downTime = new Date().getTime();
        return true;
      } else if (event.ACTION_MOVE === callProp0) {
        window.setPosition(
          windowX + event.getRawX() - x,
          windowY + event.getRawY() - y
        );
        if (1500 < new Date().getTime() - downTime) {
          exit();
        }
        return true;
      } else if (event.ACTION_UP !== callProp0) {
        return true;
      } else {
        if (
          Math.abs(event.getRawY() - y) < 5 &&
          Math.abs(event.getRawX() - x) < 5
        ) {
          onClick();
        }
        return true;
      }
    });

    // 立即启动
    start();

    function start() {
      threads.start(function () {
        while (true) {
          try {
            taskFunc();
            sleep(1);
          } catch (error) {
            log(error);
          }
        }
      });

      // new java.lang.Thread(function () {
      //   //耗时间的代码放这里
      //   while (true) {
      //     try {
      //       taskFunc();
      //       sleep(1);
      //     } catch (error) {
      //       log(error);
      //     }
      //   }
      // }).start();
    }

    function onClick() {
      if (window.action.text() != "开始") {
        //当前 操作是停止
        // threads.shutDownAll(); //停止
        // // 直接隐藏按钮。结束了。
        // window.close();

        // 停止自己
        engines.myEngine().forceStop();

        // exit();
        // window.action.setText("开始");
        // window.action.setBackgroundColor(
        //     AutojsUtil.反色(window.action.getBackground().getColor())
        // );
      } else {
        //否则，就是开始。
        //不让开始了
        // start();
        // window.action.setText("停止");
        // window.action.setBackgroundColor(
        //     AutojsUtil.反色(window.action.getBackground().getColor())
        // );
      }
    }
  },
  retryGet: function (func, retryLimit) {
    let tryCount = 0;
    while (1) {
      let result = func();
      if (result) {
        return result;
      }
      tryCount++;
      log("重试 [%s/%s]", tryCount, retryLimit)
      if (tryCount == retryLimit) {
        return false;
      }
    }
  },
  getEleBySelectorWithRetry: function (selector,
    targetName,
    findTimeLimitSec,
    appName,
    refreshMethod) {
    let ele = this.retryGet(function () {
      log("查 %s", targetName);
      let e = selector.findOne(findTimeLimitSec * 1000);
      if (e) {
        return e;
      } else {
        toast("选择器查找失败");
        log("选择器查找失败 %s", targetName);

        if (refreshMethod) {
          // 也可以使用自定义方法刷新ui
          refreshMethod();
        } else {
          // 默认使用这种方式刷新ui
          AutojsUtil.refreshUI(appName);
        }
      }
    }, 8);

    if (ele == null) {
      log("未找到 %s", targetName)
    }

    return ele
  },
  getEleBySelectorWithAutoRefresh: function (
    selector,
    targetName,
    findTimeLimitSec,
    appName,
    refreshMethod
  ) {
    let ele = this.retryGet(function () {
      log("查 %s", targetName);
      let e = selector.findOne(findTimeLimitSec * 1000);
      if (e) {
        return e;
      } else {
        log("选择器查找失败 %s", targetName);

        if (refreshMethod) {
          // 也可以使用自定义方法刷新ui
          refreshMethod();
        } else {
          // 默认使用这种方式刷新ui
          AutojsUtil.refreshUI(appName);
        }
      }
    }, 8);

    if (!ele) {
      // alert("选择器查找失败");
      console.warn("选择器查找彻底失败");
      console.log("尝试判断，是否为需要人工接入的页面")
      // 杀掉app，重启app
      // 判断是否包含验证文字。

      // 截图，保存，并发送。todo 
      log("进行截图")
      let path = this.captureAndSaveScreen()
      let picUrl = Smms.uploadPic(path)

      if (textMatches(/(.*验证.*微信.*| .*同意并继续.*| .*请填写微信密码.* | .*紧急冻结.*)/).findOne(3000)) {
        log("发现需要人工接入界面")
        // pushplus.push("已退出脚本", "请马上手动验证账号 " + DailyStorage.currentAccount);
        pushplus.pushFailCapture("已退出脚本", targetName + " 查找失败!" + "请马上手动验证账号 " + DailyStorage.currentAccount, picUrl);
        log("脚本退出")
        exit()
      } else {
        pushplus.pushFailCapture("重启脚本", targetName + " 查找失败!" + "非预期元素 " + DailyStorage.currentAccount, picUrl);
      }

      log("等待1分钟，再重启。等待工作人员前来查看日志")
      sleep(1.5 * 60 * 1000)

      AutojsUtil.reloadApp("微信");
      sleep(2000)
      // 重新开始执行
      AutojsUtil.execScriptFile("./scriptTask.js", { delay: 5000 });

      AutojsUtil.stopCurrentScriptEngine();
      return;
    }

    return ele;
  },
  clickSelectorWithAutoRefresh: function (
    selector,
    targetName,
    findTimeLimitSec,
    appName,
    refreshMethod
  ) {
    let ele = this.getEleBySelectorWithAutoRefresh(
      selector,
      targetName,
      findTimeLimitSec,
      appName,
      refreshMethod
    );

    if (!ele) {
      // alert("选择器查找失败"); //醒目提醒一下，如果经常这样，就需要改代码了
      return false;
    }

    log("点 %s", targetName);
    sleep(400)
    return AutojsUtil.clickEle(ele);
  },
  clickSelector: function (selector, targetName) {
    let e = selector.findOne(15000);
    sleep(100);
    if (e) {
      log("点 %s", targetName);
      return this.clickEle(e);
    } else {
      toast("选择器查找失败");
      log("选择器查找失败 %s", targetName);
      return false;
    }
  },
  pressSelector: function (selector, targetName) {
    let e = selector.findOne(15000);
    sleep(100);
    if (e) {
      log("点 %s", targetName);
      return this.press(e);
    } else {
      toast("选择器查找失败");
      log("选择器查找失败 %s", targetName);
      return false;
    }
  },
  clickEle: function (ele) {
    // log(ele)
    if (ele) {
      // return this.press(ele);
      if (ele.clickable()) {
        // log("点元素" + ele);
        let ok = ele.click()
        // log("元素点" + ok)
        return ok;
      } else {

        return this.press(ele);
      }
    }

    log("没有元素，点个毛线");
    return false;
  },
  press: function (ele) {
    let b = ele.bounds();
    // log(ele)
    let halfW = parseInt((b.right - b.left) / 2);
    let halfH = parseInt((b.bottom - b.top) / 2);

    let x = b.left + halfW;
    let y = b.top + halfH;
    // log("居中 点击 (%d,%d)", x, y);
    return press(x, y, 1);
  },
  refreshUI: function (appName) {
    log("刷新控件");
    home();
    sleep(2000);
    app.launchApp(appName);
    sleep(2000);
  },
  testAndBack: function (testGetTargetFunc, timesLimit, backFunc) {
    log("无脑back");
    let retryTimes = timesLimit;
    let tryCount = 0;
    while (1) {
      if (testGetTargetFunc()) {
        log("退回成功");
        return true;
      } else {
        if (backFunc) {
          backFunc();
        } else {
          back();
        }

        sleep(800);
        tryCount++;
        log("back [%s/%s]", tryCount, retryTimes);
        if (tryCount > retryTimes) {
          console.warn("无脑退回失败");
          return false;
        }
      }
    }
  },
  timeoutTask: function (func, maxSecond) {
    let startTime = new Date().getTime();
    let excuteOK = false;

    let th = threads.start(function () {
      func();
      excuteOK = true;
    });

    while (1) {
      sleep(200);
      if (excuteOK) {
        log("执行成功");
        break;
      }

      if (new Date().getTime() - startTime > maxSecond * 1000) {
        log("执行超时");
        threads.shutDownAll();

        break;
      }
    }
    return excuteOK;
  },
  loadUI: function (scriptName, projectJsonPath, uiPath) {
    let projectJsonStr = files.read(projectJsonPath).toString();
    let projectData = JSON.parse(projectJsonStr);

    let version = "1.0.0    --- " + (projectData.updateTime || "");
    let themeColor = "#FF3123";
    let scriptTitle = scriptName + " v" + version;

    // AutoX.unLockIfNeed("888888");
    // const storage = storageUI("UIConfigInfo");

    let ScriptUIAllStr = files.read(uiPath).toString();
    let ScriptUIStr = ScriptUIAllStr.replace(/项目标题/g, scriptTitle).replace(
      /#4EBFDD/g,
      themeColor
    );

    configIDArr = ScriptUIStr.match(/ id( )?=( )?["|'].*?["|']/g).map((item) =>
      item.replace(/ id( )?=( )?["|']|"|'/g, "")
    );
    ui.statusBarColor(themeColor);
    ui.layout(ScriptUIStr);

    return {
      version: version,
      scriptTitle: scriptTitle,
      configIDArr: configIDArr,
    };
  },
  autoServiceCheck: function () {
    // 无障碍检查。需要ui，id为autoService

    ui.autoService.on("check", function (checked) {
      // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
      if (checked && auto.service == null) {
        app.startActivity({
          action: "android.settings.ACCESSIBILITY_SETTINGS",
        });
      }
      if (!checked && auto.service != null) {
        auto.service.disableSelf();
      }
    });

    ui.emitter.on("resume", function () {
      // 此时根据无障碍服务的开启情况，同步开关的状态
      ui.autoService.checked = auto.service != null;
    });
  },
  pageUpBySwipe: function () {
    let h = device.height; //屏幕高
    let w = device.width; //屏幕宽
    let x = random((w * 1) / 3, (w * 2) / 3); //横坐标随机。防止检测。
    let h1 = (h / 6) * 5; //纵坐标6分之5处
    let h2 = h / 6; //纵坐标6分之1处
    swipe(x, h2, x, h1, 500); //向上翻页(从纵坐标6分之1处拖到纵坐标6分之5处)
  },
  pageDownBySwipe: function () {
    let h = device.height; //屏幕高
    let w = device.width; //屏幕宽
    // let x = (w / 3) * 2; //横坐标2/3处。
    let x = random((w * 2) / 5, (w * 3) / 5); //横坐标随机。防止检测。
    let h1 = (h / 6) * 5; //纵坐标6分之5处
    let h2 = h / 6; //纵坐标6分之1处
    swipe(x, h1, x, h2, 500); //向下翻页(从纵坐标6分之5处拖到纵坐标6分之1处)
  },
  configConsole: (title) => {
    log("开启控制台");
    let dw = device.width;
    let dh = device.height;
    let cw = (dw * 4) / 10;
    let ch = (dh * 2) / 8;

    console.setTitle(title || "");
    console.show(true);
    console.setCanInput(false);

    console.setMaxLines(500);
    sleep(100); //等待一会，才能设置尺寸成功
    console.setSize(cw, ch); //需要前面等待一会
    console.setPosition(dw - cw, 120);

    let now = new Date();
    let logPath = "/storage/emulated/0/autojs/";
    let logFileName =
      logPath +
      "autoLog-" +
      (now.getMonth() + 1) +
      "_" +
      now.getDate() +
      "_" +
      now.getHours() +
      "_" +
      now.getMinutes() +
      "-" +
      random(1, 100) +
      ".txt";
    console.setGlobalLogConfig({
      file: logFileName,
    });
  },
  waitFor: function (selector, timeoutSec) {
    let startTime = new Date().getTime();
    while (1) {
      if (selector.exists()) {
        log("出现目标");
        return true;
      }

      if (new Date().getTime() - startTime > timeoutSec * 1000) {
        log("等待超时");
        break;
      }

      sleep(500);
    }
  },
  showPoint(x, y) {
    this.showPoint({ x: x, y: y });
  },
  showPoint(p) {
    let w = floaty.rawWindow(
      <vertical id="root" gravity="center">
        <canvas id="board"></canvas>
      </vertical>
    );
    w.setTouchable(false);
    w.setSize(-1, -1);
    setInterval(() => { }, 1000);

    let paint = new Paint();
    //设置画笔为填充，则绘制出来的图形都是实心的
    paint.setStyle(Paint.Style.FILL);
    //设置画笔颜色为红色
    paint.setColor(colors.RED);

    paint.setStrokeWidth(50);

    w.board.on("draw", function (canvas) {
      //   //绘制一个从坐标(0, 0)到坐标(100, 100)的正方形
      //   canvas.drawRect(0, 0, 500, 500, paint);
      // canvas.drawColor(colors.parseColor("#0000ff"));
      // canvas.drawRect(0, 0, 500, 500, paint);

      // canvas.drawColor(colors.RED)

      paint["setColor(int)"](colors.parseColor("#ff0000")); //重点

      canvas.drawPoint(p.x, p.y, paint);
    });
  },
  inputNumIfRoot: function (num) {
    log("输入 %s", num);
    let keyCodeStr = "KEYCODE_" + num;
    KeyCode(keyCodeStr);
    sleep(500);
  },
  isInScreen: function (ele) {
    if (ele) {
      let r = ele.bounds();
      return (
        device.width > r.right &&
        r.right >= 0 &&
        device.width > r.left &&
        r.left >= 0 &&
        device.height > r.top &&
        r.top >= 0 &&
        device.height > r.bottom &&
        r.bottom >= 0
      );
    }

    return false;
  },
  reloadApp: function (appName) {
    console.log("强制重启 %s", appName);
    while (1) {
      if (this.killApp(appName)) {
        break
      }
    };

    app.launchApp(appName);
    sleep(3000)
  },
  killApp: function (name) {
    let packageName = getPackageName(name) || getAppName(name);
    if (!packageName) {
      log("找不到packageName" + packageName);
      return;
    }

    // 打开系统级应用设置  https://github.com/kkevsekk1/AutoX/issues/706

    let textName = app.getAppName(packageName);
    let settingsOpenedFlag = false;
    // 强化版本，有时候，确实打不开不知道为何。非常偶然，但是确实会
    while (1) {
      log("打开 %s 设置", textName);

      app.openAppSetting(packageName);
      log("等待打开设置")
      startTime = new Date().getTime();
      while (new Date().getTime() - startTime < 6000) {
        sleep(500);
        if (text(textName).exists()) {
          settingsOpenedFlag = true;
          break;
        }
      }

      if (settingsOpenedFlag) {
        break;
      }
    }

    log("进行盲点");
    // 执行盲点流程 （多点几次不过分。都是非阻塞的。）
    let timeLimit = 3;
    let times = 0; // 多点几次，应对页面上存在一些其他tips文字，干扰流程。
    do {
      times++;
      if (stop()) {
        log("%s 次 搞定", times);
        break;
      }
    } while (times < timeLimit);

    sleep(random(800, 1000));
    back();
    return true

    // 盲点
    function stop() {
      let is_sure = textMatches(
        /(.{0,3}强.{0,3}|.{0,3}停.{0,3}|.{0,3}结.{0,3}|.{0,3}行.{0,3})/
      ).findOnce();
      if (is_sure) {
        is_sure.click();
        sleep(random(500, 600));
      }

      let b = textMatches(/(.*确.*|.*定.*)/).findOnce();
      if (b) {
        b.click();
        sleep(random(500, 600));
        return true;
      }
    }
  },
  stopCurrentScriptEngine: function () {
    log("开始停止当前脚本引擎");
    engines.all().map((ScriptEngine) => {
      log("存在的脚本引擎 %s", engines.myEngine().toString());
      if (engines.myEngine().toString() == ScriptEngine.toString()) {
        log("停止当前脚本引擎 %s", engines.myEngine().toString());
        engines.myEngine().forceStop();
      }
    });
  },
  execScriptFile: function (scriptFullPath, config) {
    exectuion = engines.execScriptFile(scriptFullPath, config); //简单的例子
    sleep(2000);
    return exectuion;
  },
  autoPermisionScreenCapture: once(function () {
    console.log("自动申请截图权限");
    let Thread = threads.start(function () {
      if (auto.service != null) {
        //如果已经获得无障碍权限
        //由于系统间同意授权的文本不同，采用正则表达式
        let Allow = textMatches(/(允许|立即开始|统一)/).findOne(10 * 1000);
        if (Allow) {
          Allow.click();
        }
      } else {
        log("未发现权限服务调用");
      }
    });
    log("申请权限");

    //在一个会话中，调用两次申请截图权限。就会卡死。
    if (!requestScreenCapture(false)) {
      log("请求截图权限失败");
      return false;
    } else {
      Thread.interrupt();
      log("已获得截图权限");
      return true;
    }
  }),
  getCurrrentScreenBase64() {
    log("截图")
    let img = captureScreen()
    return images.toBase64(img, "png", 1)
  },
  captureAndSaveScreen() {
    AutojsUtil.autoPermisionScreenCapture()
    sleep(1000)
    let imageName = "autojs-" + new Date().getDate() + "-" + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + ".png"
    var path = "/sdcard/autojs/" + imageName; //确保路径存在
    log("截图并保存")
    log(path)
    captureScreen(path);
    return path
  }

};

function once(fn, context) {
  var result;
  // 注意，此处为了防止，并发，加了sync。
  return sync(function () {
    if (fn) {
      log("执行一次");
      result = fn.apply(context || this, arguments);
      fn = null;
    } else {
      // log("已经执行")
    }
    return result;
  });
}


module.exports = {
  AutojsUtil,
};

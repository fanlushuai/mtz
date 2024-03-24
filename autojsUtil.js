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

    setInterval(() => {}, 1000);

    var x, y, windowX, windowY, downTime;
    window.action.setOnTouchListener(function (view, event) {
      var callProp0 = event.getAction();
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
    let retryLimit = retryLimit;
    let tryCount = 0;
    while (1) {
      let result = func();
      if (result) {
        return result;
      }
      tryCount++;
      if (tryCount == retryLimit) {
        return false;
      }
    }
  },
  getEleBySelectorWithAutoRefresh: function (
    selector,
    targetName,
    findTimeLimitSec,
    appName,
    refreshMethod
  ) {
    let ele = this.retryGet(function () {
      log("查找 %s", targetName);
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
    }, 5);

    if (!ele) {
      alert("选择器查找失败");
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
      alert("选择器查找失败"); //醒目提醒一下，如果经常这样，就需要改代码了
      return false;
    }

    log("点击 %s", targetName);
    return AutojsUtil.clickEle(ele);
  },
  clickSelector: function (selector, targetName) {
    let e = selector.findOne(15000);
    sleep(100);
    if (e) {
      log("点击 %s", targetName);
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
      log("点击 %s", targetName);
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
        return ele.click();
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
    press(x, y, 1);
  },
  refreshUI: function (appName) {
    log("刷新控件");
    home();
    sleep(2000);
    app.launchApp(appName);
    sleep(2000);
  },
  testAndBack: function (testGetTargetFunc, timesLimit) {
    log("无脑back");
    let retryTimes = timesLimit;
    let tryCount = 0;
    while (1) {
      if (testGetTargetFunc()) {
        log("退回成功");
        break;
      } else {
        back();
        sleep(800);
        tryCount++;
        log("back [%s/%s]", tryCount, retryTimes);
        if (tryCount > retryTimes) {
          console.warn("无脑退回失败");
          break;
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
    var projectJsonStr = files.read(projectJsonPath).toString();
    var projectData = JSON.parse(projectJsonStr);

    var version = "1.0.0    --- " + (projectData.updateTime || "");
    var themeColor = "#FF3123";
    var scriptTitle = scriptName + " v" + version;

    // AutoX.unLockIfNeed("888888");
    // const storage = storageUI("UIConfigInfo");

    var ScriptUIAllStr = files.read(uiPath).toString();
    var ScriptUIStr = ScriptUIAllStr.replace(/项目标题/g, scriptTitle).replace(
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
    var h = device.height; //屏幕高
    var w = device.width; //屏幕宽
    var x = random((w * 1) / 3, (w * 2) / 3); //横坐标随机。防止检测。
    var h1 = (h / 6) * 5; //纵坐标6分之5处
    var h2 = h / 6; //纵坐标6分之1处
    swipe(x, h2, x, h1, 500); //向上翻页(从纵坐标6分之1处拖到纵坐标6分之5处)
  },
  pageDownBySwipe: function () {
    var h = device.height; //屏幕高
    var w = device.width; //屏幕宽
    // var x = (w / 3) * 2; //横坐标2/3处。
    var x = random((w * 2) / 5, (w * 3) / 5); //横坐标随机。防止检测。
    var h1 = (h / 6) * 5; //纵坐标6分之5处
    var h2 = h / 6; //纵坐标6分之1处
    swipe(x, h1, x, h2, 500); //向下翻页(从纵坐标6分之5处拖到纵坐标6分之1处)
  },
  configConsole: (title) => {
    threads.start(() => {
      let dw = device.width;
      let dh = device.height;
      let cw = (dw * 4) / 10;
      let ch = (dh * 3) / 8;

      console.setTitle(title || "");
      console.show(true);
      console.setCanInput(false);

      console.setMaxLines(500);
      sleep(100); //等待一会，才能设置尺寸成功
      console.setSize(cw, ch); //需要前面等待一会
      console.setPosition(dw - cw, 120);
    });
  },
  waitFor: function (selector, timeoutSec) {
    let startTime = new Date().getTime();
    while (1) {
      if (selector.exists()) {
        log("发现目标");
        return true;
      }

      if (new Date().getTime() - startTime > timeoutSec * 1000) {
        log("超时");
        break;
      }

      sleep(500);
    }
  },
  showPoint(p) {
    let w = floaty.rawWindow(
      <vertical id="root" gravity="center">
        <canvas id="board"></canvas>
      </vertical>
    );
    w.setTouchable(false);
    w.setSize(-1, -1);
    setInterval(() => {}, 1000);

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
};

module.exports = {
  AutojsUtil,
};

const { Robot } = require("./robot");
const { AutojsUtil } = require("./autojsUtil");
const { Config } = require("./config");

AutojsUtil.keepScreen();

AutojsUtil.configConsole("美添赚");

Config.loadConfig();

// AutojsUtil.onFatherStop(function () {
//   log("收到主线程结束通知，强制停止子线程")
//   engines.myEngine().forceStop()
// })

AutojsUtil.AddFloatContrlButton(function () {
  Robot.start();
});



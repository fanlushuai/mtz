const { Robot } = require("./robot");
const { AutojsUtil } = require("./autojsUtil");
const { Config } = require("./config");

AutojsUtil.keepScreen();

AutojsUtil.configConsole("美添赚");

Config.loadConfig();

AutojsUtil.AddFloatContrlButton(function () {
  Robot.start();
});



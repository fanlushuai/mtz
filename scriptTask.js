const { Robot } = require("./robot");
const { AutojsUtil } = require("./autojsUtil")


AutojsUtil.keepScreen();

AutojsUtil.configConsole("美添赚")

AutojsUtil.AddFloatContrlButton(function () {
    Robot.start()
});
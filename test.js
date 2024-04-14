
const { pushplus } = require("./msgPush");

const { Smms } = require("./smms");


pushplus.pushFailCapture("test", "ahah", Smms.captureAndUpload())


// log(descMatches(/(https:.*)/).findOne(10000).desc())


var js = () => {

    //返回值

    return {
        点击: (x, y) => shell("input tap " + x + " " + y),

        滑动: (x, y, xx, yy, d) => shell("input swipe " + x + " " + y + " " + xx + " " + yy + " " + d),

        输入: (str) => shell("input text " + str),

        模拟: (str) => shell("input keyevent " + str)
    }
}

let test = js().点击(150, 100);

//code为0就说明adb shell成功执行

if (test.code === 0) {



    log("成功使用");



} else {



    error("使用失败");



}
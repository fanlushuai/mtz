
const { pushplus } = require("./msgPush");

const { Smms } = require("./smms");


pushplus.pushFailCapture("test", "ahah", Smms.captureAndUpload())


// log(descMatches(/(https:.*)/).findOne(10000).desc())
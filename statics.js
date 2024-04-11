const { DailyStorage } = require("./dailyStorage");

let dailyStorage = DailyStorage.localStorage()

let yesterdayStorage = DailyStorage.yesterdayStorage()

const readStatics = {
    cachekey: "readStatics",
    add: function (account, thisTimesCount) {
        let readStatics = dailyStorage.get(this.cachekey)
        if (readStatics) {
            for (let a of readStatics) {
                log(a)
                if (a.account == account) {
                    a.times.push(thisTimesCount)
                    dailyStorage.put(this.cachekey, readStatics)

                    log("统计完毕")
                    return
                }
            }

            log("初次统计 %s", account)

            readStatics.push({ account: account, times: [thisTimesCount] })
            dailyStorage.put(this.cachekey, readStatics)
        } else {
            // 初始化的数据结构
            readStatics = [{ account: account, times: [thisTimesCount] }]
            dailyStorage.put(this.cachekey, readStatics)
        }

    },
    getReport: function () {
        let readStatics = dailyStorage.get(this.cachekey, "")
        log("阅读统计 %j", readStatics)
        let dateStr = new Date().getMonth() + 1 + "月" + new Date().getDate() + "号"
        return dateStr + JSON.stringify(readStatics)
    },
    getYesterdayReport: function () {
        let readStatics = yesterdayStorage.get(this.cachekey, "")
        if (readStatics == "") {
            return
        }
        log("昨天的阅读统计 %j", readStatics)
        var today = new Date();
        var yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));

        let dateStr = yesterday.getMonth() + 1 + "月" + yesterday.getDate() + "号"
        return dateStr + JSON.stringify(readStatics)
    },
    clearYesterdayStatics: function () {
        log("清空昨天的统计数据")
        yesterdayStorage.put(this.cachekey, "")
    }
}



// readStatics.add("小明", 20)
// readStatics.add("小明", 10)
// readStatics.add("小红", 30)
// readStatics.add("小明", 20)
// readStatics.add("小绿", 20)
// readStatics.add("小明", 20)
// readStatics.add("小红", 20)
// readStatics.add("小明", 20)

// log(JSON.stringify(readStatics.getReport()))

module.exports = {
    readStatics
}
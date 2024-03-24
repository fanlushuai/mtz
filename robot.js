const { AutojsUtil } = require("./autojsUtil")
const { DailyStorage } = require("./dailyStorage")
const { MTZ } = require("./mtz")
const { WeiXin } = require("./weixin")

const Robot = {
    currentAccount: "",
    jump2MTZ: function () {
        log("开始进入每添赚")
        WeiXin.intoStarDir()
        WeiXin.searchByTag()
        WeiXin.chooseFirst()
        WeiXin.longPressPic(device.width / 2, device.height / 2) //fix 假设哪个就是一个图片
        WeiXin.jumpByqrCode(function () {
            WeiXin.longPressPic(device.width / 2, device.height / 2)
        })

        sleep(4 * 1000)
    },
    sign: function () {
        log("开始签到")
        MTZ.myPage()
        MTZ.sign()
    },
    joinReadActive: function () {
        log("开始阅读推荐")
        // MTZ.flushAll()
        MTZ.helpEach()
        if (MTZ.activeRead()) {
            let qrPosition = MTZ.getQrPosition()

            // AutojsUtil.showPoint(qrPosition)

            WeiXin.longPressPic(qrPosition.x, qrPosition.y - 150) //减去头部  ！！！！！非常重要
            WeiXin.jumpByqrCode(function () {
                WeiXin.longPressPic(qrPosition.x, qrPosition.y - 150)
            })

            // 3秒反应，进入文章。
            sleep(3 * 1000)

            MTZ.read()
        }

        // todo 阅读规则？？
    },
    exchange: function () {
        log("开始兑换")
        let userId = MTZ.getUserId()
        MTZ.exchange()
        MTZ.transferScore()
        sleep(2000)
        MTZ.transferScore()

        // 点击用户名输入框

        AutojsUtil.clickEle(text("输入用户ID").findOne())
        sleep(1000)
        let numStrArr = (userId + "").split("")
        for (numStr of numStrArr) {
            AutojsUtil.inputNumIfRoot(numStr)
        }

        AutojsUtil.clickEle(text("输入提现密码").findOne())
        sleep(1000)
        let pw = "1234" //todo 放到配置里面。或者写死
        numStrArr = pw.split("")
        for (numStr of numStrArr) {
            AutojsUtil.inputNumIfRoot(numStr)
        }
    },
    changeNextAccount: function (cuAcc) {
        let accArr = WeiXin.getAllAccount()

        if (cuAcc == null) {
            cuAcc = WeiXin.getCurrentAccount()
        }
        log("当前账号 %s", cuAcc)

        let index = accArr.indexOf(cuAcc)

        let location = index + 1 > accArr.length - 1 ? index : index + 1

        if (location == index) {
            log("已经到达最后一个账号")
            let targetAccName = accArr[0]
            log("切换到第一个账号 %s", targetAccName)
            log("切换账号到 %s", targetAccName)
            if (!WeiXin.changeAccTo(targetAccName)) {
                log("继续切换")  //如果全部都失效，那就让他死循环了。
                this.changeNextAccount(targetAccName)
            } else {
                log("切换成功")
                // 第一次不要这个账号了。下一次切换的时候才会赋值这个。
                this.currentAccount = targetAccName
            }
        } else {
            let targetAccName = accArr[location]
            log("切换账号到 %s", targetAccName)
            if (!WeiXin.changeAccTo(targetAccName)) {
                log("继续切换")
                this.changeNextAccount(targetAccName)
            } else {
                log("切换成功")
                this.currentAccount = targetAccName
            }
        }
    },

    task1: function () {
        WeiXin.boot()
    },
    task2: function () {
        this.jump2MTZ()
    },
    taskMTZ: function () {

        // 判断一下，有没有公告

        // todo 签到，一般一天搞一次即可

        if (!DailyStorage.yetSignToday()) {
            this.sign()
        } else {
            log("内存里发现已经签名，跳过")
        }

        sleep(1000)
        // todo 参加活动，可以返回一下，还剩多少时间。方便任务高效调度。

        if (DailyStorage.canReadNow()) {
            this.joinReadActive()
            // this.exchange()
            sleep(1000)

            WeiXin.back2Settings()
        }

    },
    taskSwichAcc: function () {
        log("切换下一个账号")
        WeiXin.settings()
        WeiXin.changeAccount()
        this.changeNextAccount()
    },
    start: function () {
        WeiXin.boot()
        while (1) {
            log("开始任务")
            Robot.currentAccount = WeiXin.wo()
            DailyStorage.currentAccount = Robot.currentAccount

            if (DailyStorage.yetSignToday()
                && !DailyStorage.canReadNow()) {
                log("此账号不需要任何操作")
            } else {
                this.jump2MTZ()  //跳入美添赚
                this.taskMTZ()  // 签到，阅读互动，提款、提积分
            }
            this.taskSwichAcc()

            // WeiXin.back2SettingsFromAcc()
        }
    }
}

// Robot.taskSwichAcc()


module.exports = {
    Robot
}



const { AutojsUtil } = require("./autojsUtil")

const WeiXin = {
    name: "微信",
    boot: function () {
        log("打开微信")
        app.launchApp("微信")
    },
    wo: function () {
        AutojsUtil.clickSelectorWithAutoRefresh(text("我"), "我", 10, this.name)
        return id("ouv").findOne().getText().replace("微信号：", "")
    },
    intoStarDir: function () {
        AutojsUtil.clickSelectorWithAutoRefresh(text("收藏"), "收藏", 10, this.name)
    },
    searchByTag: function (tagName) {
        let tName = tagName || "美添赚"
        AutojsUtil.clickSelectorWithAutoRefresh(id("du4"), "小三角", 10, this.name)
        sleep(1000)
        AutojsUtil.clickSelectorWithAutoRefresh(id("ci2").text(tName), tName, 10, this.name)
        sleep(1500)
    },
    chooseFirst: function () {
        AutojsUtil.clickSelectorWithAutoRefresh(id("dwo"), "日期", 10, this.name)
        sleep(1500)
    },
    longPressPic: function (x, y) {
        // todo
        // 长安设备的，
        // press(device.width / 2, device.height / 2, 1000)
        sleep(1000) //等待那个滑动特效结束
        log("长按 %s,%s", x, y)
        press(x, y, 1000)  //600以上，为长按。
        sleep(1.5 * 1000) //等待那个滑动特效结束
    },
    jumpByqrCode: function (func) {
        // fix 卡住
        sleep(1.5 * 1000)
        let ele = AutojsUtil.getEleBySelectorWithAutoRefresh(text("识别图中的二维码"), "识别图中的二维码", 10, this.name, func)
        let b = ele.bounds()
        log("点击，识别图中的二维码")
        press(b.centerX(), b.centerY(), 100)
    },

    settings: function () {
        AutojsUtil.clickSelectorWithAutoRefresh(text("设置"), "设置", 10, this.name)
    },
    changeAccount: function () {
        // AutojsUtil.pageDownBySwipe()
        sleep(1000)
        AutojsUtil.pageDownBySwipe()
        sleep(1000)
        AutojsUtil.clickSelectorWithAutoRefresh(text("切换账号"), "切换账号", 10, this.name)
        sleep(500)

        // 切换到哪个
    },
    getCurrentAccount: function () {
        let accountEle = id("co1").findOne().parent().parent().findOne(id("dy"))
        // log(accountEle)
        if (accountEle) {
            return accountEle.getText()
        }
    },
    getAllAccount: function () {
        // fix 账号可能很多，还需要滚动屏幕
        sleep(1000)

        AutojsUtil.refreshUI("微信")

        let allAccountEles = id("dy").find()
        let acArr = []
        for (aE of allAccountEles) {
            log("账号- %s", aE.getText())
            acArr.push(aE.getText())
        }

        log("所有账号：%j", acArr)
        return acArr
    },
    changeAccTo: function (name) {
        AutojsUtil.clickEle(text(name).findOne())

        sleep(1000)

        // AutojsUtil.refreshUI("微信")

        // id("co1")
        // while (text("正在退出...").exists()) {
        //     sleep(1000)
        // }
        // log("已退出")
        // while (text("正在登录...").exists()) {
        //     sleep(1000)
        // }
        // log("已登陆")

        // idMatches("otg").waitFor() //todo 达到首页



        // 可能出现登陆失效
        let logniExpired = AutojsUtil.waitFor(id("iol").text("登录"), 30)
        if (logniExpired) {
            log("登陆失效")

            back() //后退一下
            sleep(1000)
            return false
        }

        AutojsUtil.waitFor(id("icon_tv").text("通讯录"), 30)
        log("到达首页，切换成功")
        sleep(2000)
        return true
    },
    changeNext: function () {
        id("dy").find()
    },
    backTab: function () {
        // AutojsUtil.clickEle(id("actionbar_up_indicator_btn"))
        log("左上返回")
        AutojsUtil.clickEle(desc("返回").findOne().parent())
        sleep(1500)
    },
    back2Settings: function () {
        AutojsUtil.testAndBack(function () {
            // return id("title").text("设置").findOnce() != null

            // return text("发现").findOnce() != null
            // return id("ouv").findOnce() != null
            return text("收藏").id("android:id/title").visibleToUser(true).findOnce() != null
        }, 10)
    },
    back2SettingsFromAcc: function () {
        this.backTab()
        this.backTab()
    },
    refreshWeb: function () {
        log("刷新网页")
        AutojsUtil.clickSelectorWithAutoRefresh(id("coz"), "。。。", 10, this.name)
        sleep(1.5 * 1000)
        AutojsUtil.clickSelectorWithAutoRefresh(id("obc").text("刷新"), "刷新", 10, this.name)
        sleep(4 * 1000)

        AutojsUtil.refreshUI("微信")
        sleep(1 * 1000)
    }

}

// WeiXin.refreshWeb()

// 
// 


// log(find())

module.exports = {
    WeiXin
}



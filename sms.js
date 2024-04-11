// ZrkIKcmw2trMdVFUaYtBq2Wr60XDU5fF

const { AutojsUtil } = require("./autojsUtil");

function upload(filePath) {
    log("上传SMS")

    let request = {
        baseUrl: "https://sm.ms/api/v2/",
        path: "upload"
    }

    request.url = request.baseUrl + request.path
    var res = http.postMultipart(request.url, {

        file: open(filePath),
        headers: {
            Authorization: "ZrkIKcmw2trMdVFUaYtBq2Wr60XDU5fF"
        }
    },);

    log(res)
    log(res.body.string())
}

AutojsUtil.autoPermisionScreenCapture()
let imageName = "autojs-" + new Date().getDate() + "-" + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + ".png"
var path = "/sdcard/" + imageName;
captureScreen(path);
upload(path)



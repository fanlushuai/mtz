// ZrkIKcmw2trMdVFUaYtBq2Wr60XDU5fF

const { AutojsUtil } = require("./autojsUtil");

function uploadPic(filePath) {
    log("上传SMS %s", filePath)

    let request = {
        baseUrl: "https://sm.ms/api/v2/",
        path: "upload"
    }

    request.url = request.baseUrl + request.path

    var res = http.postMultipart(request.url, {
        'smfile': open(filePath),
    }, {
        headers: {
            'Authorization': "Basic 6xSePi634uxDUysWKPqqR5wp6RRH7Uyg",
            'Content-Type': "multipart/form-data",
            "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0'

        }
    });

    let url = res.body.json().data.url
    log("上传完成 %s", url)

    return url
    {/* <img src="https://s2.loli.net/2024/04/11/mPIAhGQkBaZyuor.png" alt="autojs-11-232941.png"> */ }
}


function captureAndUpload() {
    AutojsUtil.autoPermisionScreenCapture()
    sleep(1000)
    let imageName = "autojs-" + new Date().getDate() + "-" + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + ".png"
    var path = "/sdcard/autojs/" + imageName; //确保路径存在
    captureScreen(path);

    return uploadPic(path)
}

module.exports = {
    captureAndUpload,
    uploadPic
}



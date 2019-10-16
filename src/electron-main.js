const { app, BrowserWindow,session } = require('electron')

function createWindow () {
  // 创建浏览器窗口
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    }
  })
  session.defaultSession.webRequest.onBeforeSendHeaders({urls: ["https://gym.yiban.bupt.link/*","https://postman-echo.com/post"]},(details, callback) => {
    const newHeader = details.requestHeaders
    for (let key in details.requestHeaders.valueOf()){
      if(key.startsWith("UNSAFE_")){
        newHeader[key.substring(7)]=details.requestHeaders[key];
        delete newHeader[key];
      }
    }
    delete newHeader["Sec-Fetch-Site"]
    console.log(newHeader)
    callback({requestHeaders: newHeader})
  })
  win.webContents.openDevTools()
  win.loadURL('http://localhost:4200/index.html')
}
app.on('ready', createWindow)

const AV = require('leanengine');
const fs = require('fs');
const path = require('path');

/**
 * 加载 functions 目录下所有的云函数
 */
fs.readdirSync(path.join(__dirname, 'functions')).forEach(file => {
    if (!file.endsWith(".js"))return;
    console.log("Load function:"+file);
    require(path.join(__dirname, 'functions', file))
});

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('ping', async () => {
    return 'Pong!';
});

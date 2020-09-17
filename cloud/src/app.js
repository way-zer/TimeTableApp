'use strict';

const path = require('path');

const AV = require('leanengine');
const fs = require('fs');
const Koa = require('koa');
const views = require('koa-views');
const history = require('koa-connect-history-api-fallback');
const statics = require('koa-static');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress')

// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require('./cloud');

const app = new Koa();

app.use(compress({
  filter(content_type) {
    return /text/i.test(content_type)
  },
  threshold: 2048,
  gzip: {
    flush: require('zlib').constants.Z_SYNC_FLUSH
  },
  deflate: {
    flush: require('zlib').constants.Z_SYNC_FLUSH,
  },
  br: false // disable brotli
}))

// 设置模版引擎
app.use(views(path.join(__dirname, 'views')));

app.use(history());
// 设置静态资源目录
app.use(statics(path.join(__dirname, 'public')));

fs.readdirSync(path.join(__dirname, 'routes')).forEach(file => {
  if (!file.endsWith(".js")) return;
    app.use(require(path.join(__dirname, 'routes', file)).routes())
});

// 加载云引擎中间件
app.use(AV.koa2());

app.use(bodyParser());

module.exports = app;

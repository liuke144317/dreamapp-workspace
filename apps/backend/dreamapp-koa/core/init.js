const requireDirectory = require('require-directory')
const Router = require('koa-router')();
const bodyParser = require('koa-bodyparser')
const cros = require("koa2-cors")
const { EventEmitter } = require('events')

class InitManager {
  static initCore (app) {
    EventEmitter.defaultMaxListeners = 30
    InitManager.app = app
    InitManager.app.use(cros())
    InitManager.app.use(bodyParser())
    InitManager.initLoadRouters()
    InitManager.initMiddleware()
  }
  /* 初始化路由 */
  static initLoadRouters () {
    const routersObj = {} // 解析后的所有路由对象集合
    // 解析apps下所有Router.js中路由
    let apps = requireDirectory(module, '../src/apps')
    for (let key in apps) {
      let routers = apps[key]['Routers']
      routersObj[key] = routers
    }
    routersObj['SmallFunction/movie'] = apps['SmallFunction']['movie']['Routers']
    routersObj['SmallFunction/music'] = apps['SmallFunction']['music']['Routers']
    routersObj['SmallFunction/address'] = apps['SmallFunction']['address']['Routers']
    routersObj['SmallFunction/crawler'] = apps['SmallFunction']['crawler']['Routers']
    for (let key in routersObj) {
      routersObj[key](Router)
    }
    InitManager.app.use(Router.routes())
  }
  /* 初始化中间件 */
  static initMiddleware () {
    let middleware = requireDirectory(module, '../src/middleware')
    for (let key in middleware) {
      let middlewareFun = middleware[key]
      InitManager.app.use(async (ctx) => {middlewareFun(ctx)})
    }
  }

}
module.exports = InitManager;

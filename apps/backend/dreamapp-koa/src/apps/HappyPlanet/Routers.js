/**
 * Created by liuke on 2020/3/31 11:07.
 *
 * use to 路由器-登陆页路由
 */
const ctrl = require('./Ctrl.js')
module.exports = (router) => {
  router
    .post('/HappyPlanet/getdataInfo', async (ctx, next) => {
      let data = await ctrl.getHappyPlanetDataByUserID(ctx.request.body)
      ctx.response.status = 200;
      ctx.response.body = data
    })
    .post('/HappyPlanet/setdataInfo', async (ctx, next) => {
      let data = await ctrl.updateHappyPlanetData(ctx.request.body)
      ctx.response.status = 200;
      ctx.response.body = data
    })
}

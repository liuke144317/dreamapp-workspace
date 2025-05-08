/**
 * Created by liuke on 2020/3/31 11:07.
 *
 * use to 小程序
 */
const ctrl = require('./Ctrl.js')
module.exports = (router) => {
  router
    .get('/DreamApp/SmallFunction/getList', async (ctx, next) => {
      try {
        let data = await ctrl.getSmallFunctionList(ctx.request.body)
        if (data && data.length !== 0) {
          ctx.status = 200
          ctx.body = {
            message: '操作成功',
            data
          }
        } else {
          ctx.status = 400
          ctx.body = {
            message: '操作失败'
          }
        }
      } catch (e) {
        ctx.status = 400
        ctx.body = {
          message: '操作失败',
          data: e
        }
      }

    })
}

/**
 * Created by liuke on 2020/3/31 11:07.
 *
 * use to 获取ip
 */
const ping = require('ping');
module.exports = (router) => {
    router
        .get('/DreamApp/SmallFunction/address', async (ctx, next) => {
            try {
                let res = await ping.promise.probe(ctx.query.realmName)
                ctx.status = 200
                ctx.body = {
                    message: '操作成功',
                    data: res
                }
            } catch (e) {
                ctx.status = 400
                ctx.body = {
                    message: '操作失败',
                    data: e
                }
            }

        })
        .get('/DreamApp/SmallFunction/address/getInfo', async (ctx, next) => {
            try {
                let res = await ping.promise.probe(ctx.query.realmName)
                ctx.status = 200
                ctx.body = {
                    message: '操作成功',
                    data: res
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

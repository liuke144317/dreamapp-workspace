let EVN = 'development'
// let EVN = 'production'
let ip_dev = '10.8.0.1'
let ip_prod = '172.17.0.1'
function isDev () {
  return EVN === 'development'
}
const config = {
  // 启动端口
  port: 3000,
  webDav: {
    url: 'http://cn-bj1-kvlqs4ee.frp.cool:14431',
    username: 'webdav',
    password: '144317Waesr'
  },
  minio: {
    url: isDev() ? ip_dev : ip_prod,
    port: 9000,
    username: 'lksminio',
    password: '144317waesr',
    bucket: isDev() ? 'dreamappdev' : 'dreamapp',
    showPath: `https://nas.liuke12355.top:13531/${isDev() ? 'minioclientdev/dreamapp' : 'minioclient/dreamapp'}/` // nginx代理的9000端口，只能用代理，穿透的无法使用
  },
  // 数据库配置
  database: {
    DATABASE: isDev() ? 'dream_app_dev' : 'dream_app',
    CHARSET: 'utf8mb4',
    USERNAME: 'root',
    PASSWORD: '144317waesr',
    HOST: isDev() ? ip_dev : ip_prod,
    PORT: '3306'
  },
  elasticSearch: {
    HOST: isDev() ? ip_dev : ip_prod,
    port: '9200'
  },
}

module.exports = config

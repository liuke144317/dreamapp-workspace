/**
 * Created by liuke on 2020/3/31 10:20.
 *
 * use to 模型（数据库访问）
 */
const pool = require('../../../mysql/index.js')

class Mysql {
  constructor(arg) {

  }

  queryList() {
    return new Promise((resolve, reject) => {
      pool.query('select * from home_list', (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  getUserInfoByUserID(userID) {
    return new Promise((resolve, reject) => {
      pool.query(`select * from user_info where userid=?`, userID, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }
}

module.exports = new Mysql()

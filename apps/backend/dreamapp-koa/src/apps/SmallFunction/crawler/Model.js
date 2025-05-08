/**
 * Created by liuke on 2020/3/31 11:09
 *
 * use to 模型
 */
const pool = require('../../../../mysql/index.js')

class Mysql {
  constructor(arg) {

  }

  loginVerifyModel(params) {
    return new Promise((resolve, reject) => {
      pool.query(`select * from user_info where username="${params.username}" and password="${params.password}"`, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  updateUseInfo(params) {
    return new Promise((resolve, reject) => {
      pool.query(`UPDATE user_info set username='${params.nickname}', phone='${params.phone}', address='${params.province}', sex=${params.sex}, age=26, email='${params.email}' where userid=${params.userid}`, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  getSmallFunctionList(params) {
    return new Promise((resolve, reject) => {
      pool.query("select * from small_program", (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }
}

module.exports = new Mysql()

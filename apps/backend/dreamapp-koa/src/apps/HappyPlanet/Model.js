/**
 * Created by liuke on 2020/3/31 11:09
 *
 * use to 模型
 */
const pool = require('../../../mysql/index.js')

class Mysql {
  constructor(arg) {

  }

  getHappyPlanetNoteListByUserID(params) {
    return new Promise((resolve, reject) => {
      pool.query(`select * from note_list where userid="${params.userid}"`, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  getHappyPlanetTodoListByUserID(params) {
    return new Promise((resolve, reject) => {
      let sqlData = [params.nickname, params.birthday, params.phone, params.address, params.sex, 26, params.email, params.userid]
      pool.query(`select * from todo_list where userid="${params.userid}"`, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  deleteHappyPlanetData(params) {
    return new Promise((resolve, reject) => {
      let sqlData = [params.nickname, params.birthday, params.phone, params.address, params.sex, 26, params.email, params.userid]
      pool.query(`select * from todo_list where userid="${params.userid}"`, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  addHappyPlanetData(params) {
    return new Promise((resolve, reject) => {
      let sqlData = [params.nickname, params.birthday, params.phone, params.address, params.sex, 26, params.email, params.userid]
      pool.query(`select * from todo_list where userid="${params.userid}"`, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }
}

module.exports = new Mysql()

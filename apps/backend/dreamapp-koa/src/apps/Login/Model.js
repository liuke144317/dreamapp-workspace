/**
 * Created by liuke on 2020/3/31 11:09
 *
 * use to 模型
 */
const pool = require('../../../mysql/index.js')

class Mysql {
  constructor(arg) {

  }

  queryUserByUserName(params) {
    return new Promise((resolve, reject) => {
      pool.query(`select userid,username,phone,address,sex,age,email,birthday,userImg,nickname,set_info from user_info where username="${params}"`, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  queryInvitation(params) {
    return new Promise((resolve, reject) => {
      pool.query(`select * from invitation_code_list where code="${params}"`, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  loginVerifyModel(params) {
    return new Promise((resolve, reject) => {
      pool.query(`select userid,username,phone,address,sex,age,email,birthday,userImg,nickname,set_info from user_info where username="${params.username}" and password="${params.password}"`, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  insertUseInfo(params) {
    return new Promise((resolve, reject) => {
      let sqlData = [params.userid, params.username, params.password, params.phone]
      let sql = 'INSERT INTO user_info (userid,username,password,phone) VALUES (?,?,?,?)'
      pool.query(sql, sqlData, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        this.getUserInfoByUserID(params.userid).then(res => {
          resolve(res[0])
        })
      })
    })
  }

  updateUseInfo(params) {
    let data = []
    let sqlData = []
    let sql = ''
    let range = ['nickname','birthday','phone','address','sex','email','userImg','set_info','userid']
    for (let key in params) {
      if (params[key] !== 'null' && params[key] !== '' && key !== 'userid' && range.indexOf(key) !== -1) {
        data.push(key + '=?')
      }
      if (params[key] !== 'null' && params[key] !== '' && range.indexOf(key) !== -1) {
        sqlData.push(params[key])
      }
    }
    sql = 'UPDATE user_info set ' + data.toString() + ' where userid=?'
    return new Promise((resolve, reject) => {
      pool.query(sql, sqlData, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        this.getUserInfoByUserID(params.userid).then(res => {
          resolve(res[0])
        })
      })
    })
  }

  getUserInfoByUserID(userID) {
    return new Promise((resolve, reject) => {
      pool.query(`select userid,username,phone,address,sex,age,email,birthday,userImg,nickname,set_info from user_info where userid=?`, userID, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  getReadPasswordByUserID(userID) {
    return new Promise((resolve, reject) => {
      pool.query(`select read_password from user_info where userid=?`, userID, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  setReadPasswordByUserID(password, userid) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE user_info set read_password=? where userid=?'
      let sqlData = [password, userid]
      pool.query(sql, sqlData, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  getIsLockedLabels(userid) {
    return new Promise((resolve, reject) => {
      const sql = 'select count(*) as count,t1.id,t1.label from home_list_label t1 left JOIN list_label_relationship t2 on t1.id=t2.labelid LEFT JOIN home_list t3 on t2.listid=t3.id WHERE t3.islock=1 and userid=? GROUP BY t1.id,t1.label'
      let sqlData = [userid]
      pool.query(sql, sqlData, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  getUnLockLabels(params, userid) {
    return new Promise((resolve, reject) => {
      const sql = `select count(*) as count,t1.id,t1.label from home_list_label t1 left JOIN list_label_relationship t2 on t1.id=t2.labelid LEFT JOIN home_list t3 on t2.listid=t3.id WHERE t3.islock=0 and userid=? and t1.label like '%${params}%' GROUP BY t1.id,t1.label`
      let sqlData = [userid]
      pool.query(sql, sqlData,(error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  setLockHomeList(labelid, userid, status) {
    return new Promise((resolve, reject) => {
      const sql = `update home_list set islock=${status} where userid='${userid}' and id in (select listid from list_label_relationship where labelid='${labelid}')`
      let sqlData = [userid]
      pool.query(sql, sqlData,(error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }
}

module.exports = new Mysql()

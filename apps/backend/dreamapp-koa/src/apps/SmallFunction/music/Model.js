/**
 * Created by liuke on 2020/3/31 11:09
 *
 * use to 模型
 */
const pool = require('../../../../mysql/index.js')

class Mysql {
  constructor(arg) {}
  insertMusicInfo(insertData) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO music_info (music_position,lyric_position,post_position,name,author,album,userid) VALUES (?,?,?,?,?,?,?)'
      let sqlData = [insertData.music_position, insertData.lyric_position, insertData.post_position, insertData.name, insertData.author, insertData.album, insertData.userid]
      pool.query(sql, sqlData, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }
  updateMusicInfo(insertData) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE music_info set lyric_position=?, post_position=?, name=?, author=?, album=?, userid=? where id=?'
      let sqlData = [insertData.lyric_position, insertData.post_position, insertData.name, insertData.author, insertData.album, insertData.userid , insertData.id]
      pool.query(sql, sqlData, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }
  getMusicList(userid) {
    return new Promise((resolve, reject) => {
      const sql = `select * from music_info where userid=${userid}`
      pool.query(sql, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }
  getMusicItemInfo(id) {
    return new Promise((resolve, reject) => {
      const sql = `select * from music_info where id=${id}`
      pool.query(sql, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }
  deleteMusicItem(id) {
    return new Promise((resolve, reject) => {
      const sql = `delete from music_info where id=${id}`
      pool.query(sql, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }
}

module.exports = new Mysql()

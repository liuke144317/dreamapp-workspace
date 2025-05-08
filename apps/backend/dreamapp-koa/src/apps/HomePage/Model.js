/**
 * Created by liuke on 2020/3/31 10:20.
 *
 * use to 模型（数据库访问）
 */
const pool = require('../../../mysql/index.js')
const esClient = require('../../../elastic/index.js')
const { v4: uuidv4 } = require('uuid')
class Mysql {
  constructor(arg) {

  }

  // 查询记录
  queryList(postParam, labelid, id, userid, showLock, showSelf) {
    return new Promise((resolve, reject) => {
      let sql = ''
      if (id) { // 根据记录id查询
        sql = `select a.id,a.title,a.slogan,a.description,a.image,a.label,a.date,a.type,a.islock,a.topping,b.userid,b.username,b.userImg,b.nickname from home_list a,user_info b where b.userid=a.userid and a.id='${id}' ORDER BY
              CASE
                WHEN a.userid='${userid}' AND a.topping IS NOT NULL THEN 0
                ELSE 1
              END,
              CASE WHEN a.userid='${userid}' THEN a.topping END DESC,a.date DESC limit ${(postParam.pageParams.currentPage - 1) * postParam.pageParams.pageSize},${postParam.pageParams.pageSize}`
      } else if (labelid) { // 根据关联标签查询数据
        if (showLock) { // 展示加锁数据
          sql = `select a.id,a.title,a.slogan,a.description,a.image,a.label,a.date,a.type,a.islock,a.topping,b.userid,b.username,b.userImg,b.nickname from home_list a left join user_info b on b.userid=a.userid WHERE (a.islock=1 and a.userid='${userid}') and a.id in (SELECT listid from list_label_relationship WHERE labelid='${labelid}') ORDER BY
              CASE
                WHEN a.userid='${userid}' AND a.topping IS NOT NULL THEN 0
                ELSE 1
              END,
              CASE WHEN a.userid='${userid}' THEN a.topping END DESC,a.date DESC limit ${(postParam.pageParams.currentPage - 1) * postParam.pageParams.pageSize},${postParam.pageParams.pageSize}`
        } else if (showSelf) { // 展示自己的数据
          sql = `select a.id,a.title,a.slogan,a.description,a.image,a.label,a.date,a.type,a.islock,a.topping,b.userid,b.username,b.userImg,b.nickname from home_list a left join user_info b on b.userid=a.userid WHERE a.userid='${userid}' and a.islock=0 and a.id in (SELECT listid from list_label_relationship WHERE labelid='${labelid}') ORDER BY
              CASE
                WHEN a.userid='${userid}' AND a.topping IS NOT NULL THEN 0
                ELSE 1
              END,
              CASE WHEN a.userid='${userid}' THEN a.topping END DESC,a.date DESC limit ${(postParam.pageParams.currentPage - 1) * postParam.pageParams.pageSize},${postParam.pageParams.pageSize}`
        } else {
          sql = `select a.id,a.title,a.slogan,a.description,a.image,a.label,a.date,a.type,a.islock,a.topping,b.userid,b.username,b.userImg,b.nickname from home_list a left join user_info b on b.userid=a.userid WHERE (a.isprivate=0 or (a.isprivate=1 and a.userid='${userid}')) and a.islock=0 and a.id in (SELECT listid from list_label_relationship WHERE labelid='${labelid}') ORDER BY
              CASE
                WHEN a.userid='${userid}' AND a.topping IS NOT NULL THEN 0
                ELSE 1
              END,
              CASE WHEN a.userid='${userid}' THEN a.topping END DESC,a.date DESC limit ${(postParam.pageParams.currentPage - 1) * postParam.pageParams.pageSize},${postParam.pageParams.pageSize}`
        }
      } else { // 查询所有公开的和自己的私有记录
        sql = `select a.id,a.title,a.slogan,a.description,a.image,a.label,a.date,a.type,a.islock,a.topping,b.userid,b.username,b.userImg,b.nickname from home_list a left join user_info b on b.userid=a.userid where (a.isprivate=0 or (a.isprivate=1 and a.userid='${userid}')) and a.islock=0 ORDER BY
              CASE
                WHEN a.userid='${userid}' AND a.topping IS NOT NULL THEN 0
                ELSE 1
              END,
              CASE WHEN a.userid='${userid}' THEN a.topping END DESC,a.date DESC limit ${(postParam.pageParams.currentPage - 1) * postParam.pageParams.pageSize},${postParam.pageParams.pageSize}`
      }
      pool.query(sql, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 查询单个记录详情
  queryItem(itemId, userid) {
    // 只能查看自己的或者他人公开的
    return new Promise((resolve, reject) => {
      let sql = `select a.id,a.title,a.slogan,a.description,a.image,a.label,a.date,a.type,a.islock,a.topping,b.userid,b.username,b.userImg,b.nickname from home_list a,user_info b where b.userid=a.userid and ((a.userid='${userid}' AND a.id='${itemId}') or (a.userid!='${userid}' AND a.id='${itemId}' and a.islock=0))`
      pool.query(sql, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 查询记录对应图片
  queryImageList(idArr) {
    return new Promise((resolve, reject) => {
      let sqlData = idArr
      const sql = 'select * from home_list_image where home_list_id in (?) group by id'
      pool.query(sql, [sqlData], (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 查询记录对应标签
  queryLabelList(idArr) {
    return new Promise((resolve, reject) => {
      let sqlData = idArr
      const sql = 'select a.id,a.labelid,a.listid, b.label from list_label_relationship a left JOIN home_list_label b  on b.id = a.labelid where a.listid in (?) AND b.id IS NOT NULL'
      pool.query(sql, [sqlData], (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 删除记录对应图片
  deleteImageList(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM home_list_image WHERE home_list_id = ?'
      pool.query(sql, id, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  queryImageByIDs (idStr) {
    return new Promise((resolve, reject) => {
      const sql = 'Select * FROM home_list_image WHERE id in (?)'
      pool.query(sql,[idStr], (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 根据图片id删除对应图片
  deleteImageListByImageID(idStr) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM home_list_image WHERE id in (?)`
      pool.query(sql,[idStr], (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 删除记录对应图片
  deleteLabelRelation(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM list_label_relationship WHERE listid = ?'
      pool.query(sql, id, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 判断labels中是否有当前用户已经加锁的label
  hasLockLabel(userid,str) {
    return new Promise((resolve, reject) => {
      const sql = `select DISTINCT t1.id,t1.label from home_list_label t1 left JOIN list_label_relationship t2 on t1.id=t2.labelid LEFT JOIN home_list t3 on t2.listid=t3.id where t3.userid='${userid}' and t3.islock=1 and t1.label in (?)`
      pool.query(sql, [str], (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 插入记录
  insertItem(insertData, islock) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO home_list (id, title,slogan,description,label,date,userid,islock,isprivate) VALUES (?,?,?,?,?,?,?,?,?)'
      let uuid = uuidv4()
      let sqlData = [uuid, insertData.title, insertData.slogan, insertData.description, insertData.label, insertData.date, insertData.userid, islock, insertData.isprivate]
      pool.query(sql, sqlData, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve({...result, insertId: uuid})
      })
    })
  }

  // 修改记录
  updateItem(insertData, islock) {
    return new Promise((resolve, reject) => {
      let sql = ''
      let sqlData = []
      if (islock !== undefined) {
        sql = 'UPDATE home_list set title=?,slogan=?,description=?,label=?,date=?,userid=?,isprivate=?,islock=? where id=?'
        sqlData = [insertData.title, insertData.slogan, insertData.description, insertData.label, insertData.date, insertData.userid, insertData.isprivate, islock, insertData.id]
      } else {
        sql = 'UPDATE home_list set title=?,slogan=?,description=?,label=?,date=?,userid=?,isprivate=? where id=?'
        sqlData = [insertData.title, insertData.slogan, insertData.description, insertData.label, insertData.date, insertData.userid, insertData.isprivate, insertData.id]
      }
      pool.query(sql, sqlData, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 删除记录
  deleteItem(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM home_list WHERE id=?'
      let sqlData = [id]
      pool.query(sql, sqlData, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 插入图片信息
  insertImageInfo(insertData) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO home_list_image (id,home_list_id,url) VALUES ?'
      let sqlData = insertData
      pool.query(sql, [sqlData], (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 修改首页列表锁定状态
  updateHomeList(data) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE home_list set islock=? where id=?'
      let sqlData = [data.islock, data.id]
      pool.query(sql, sqlData, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 查询标签关联记录
  queryTagRelationList(postParam, limitSearchNum) {
    return new Promise((resolve, reject) => {
      let labelName = postParam.labelName || ''
      let sql = `SELECT t1.id, t1.label, COUNT(t2.labelid) AS count FROM home_list_label t1 LEFT JOIN list_label_relationship t2 ON t1.id = t2.labelid WHERE label like \'%${labelName}%\' GROUP BY t1.id, t1.label ORDER BY count DESC limit 0,${limitSearchNum}`
      pool.query(sql, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 查询标签关联记录
  queryTagRelationListSelf(postParam, limitSearchNum, userid) {
    return new Promise((resolve, reject) => {
      let labelName = postParam.labelName || ''
      let sql = `SELECT t1.id, t1.label, t3.islock, COUNT(t2.labelid) AS count FROM home_list_label t1 LEFT JOIN list_label_relationship t2 ON t1.id = t2.labelid LEFT JOIN home_list t3 on t2.listid=t3.id  WHERE t3.userid='${userid}' and t1.label like \'%${labelName}%\' GROUP BY t1.id, t1.label,t3.islock ORDER BY count DESC limit 0,${limitSearchNum}`
      pool.query(sql, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 查询标签关联记录
  queryHomeListSimpleInfo(postParam, limitSearchNum, userid) {
    let labelName = postParam.labelName || ''
    let body = {
      "_source": ["description","title", "id"],
      "query": {
        "bool": {
          "must": [
            {"multi_match": {"query": labelName,"fields": ["description", "title"]}},
            {
              "bool": {
                "should": [
                  {"term": {"isprivate": 0}},
                  {
                    "bool": {
                      "must": [
                        {"term": {"isprivate": 1}},
                        {"term": {"userid": userid}}
                      ]
                    }
                  }
                ]
              }
            },
            {
              "bool": {
                "should": [
                  {"term": {"islock": 0}},
                  {
                    "bool": {
                      "must": [
                        {"term": {"islock": 1}},
                        {"term": {"userid": userid}}
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      "highlight": {
        "boundary_scanner_locale":"zh_CN",
        "fragment_size": 20,
        "fields": {
          "description": {
            "pre_tags": ["<span style=\"color:#0d8e38\">"],
            "post_tags": ["</span>"]
          },
          "title": {
            "pre_tags": ["<span style=\"color:#0d8e38\">"],
            "post_tags": ["</span>"]
          }
        }
      }
    }
    return new Promise((resolve, reject) => {
      esClient.search({index: 'home_list', body: body}).then(res => {
        let result = res.hits.hits
        if (result.length === 0) {
          resolve([])
        } else {
         let newResult =  result.map(item => {
            let id = item._source.id
            let description = item.highlight.description ? item.highlight.description[0] : item._source.description.slice(0,30)
            let title = item.highlight.title ? item.highlight.title[0] : item._source.title.slice(0,30)
            return {
              id,
              description,
              title
            }
          })
          resolve(newResult)
        }
      })
    })
    // return new Promise((resolve, reject) => {
    //   let sql = `SELECT id,title,description  from home_list WHERE description like '%${labelName}%' and (isprivate=0 or (isprivate=1 and userid='${userid}')) and (islock=0 or (islock=1 and userid='${userid}')) AND description NOT REGEXP '#[^#]*${labelName}[^#]*#' limit 0,${limitSearchNum}`
    //   pool.query(sql, (error, result, fields) => {
    //     if (error) {
    //       reject(error)
    //     }
    //     resolve(result)
    //   })
    // })
  }

  // 添加标签关联记录
  insertTagRelationItem(insertData) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO list_label_relationship (id, listid,labelid) VALUES (?,?,?)'
      let uuid = uuidv4()
      let sqlData = [uuid, insertData.listid, insertData.labelid]
      pool.query(sql, sqlData,(error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve({...result, insertId: uuid})
      })
    })
  }

  // 添加标签关联记录
  deleteTagRelationItem(insertData) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM list_label_relationship where listid=? and labelid=?'
      let sqlData = [insertData.listid, insertData.labelid]
      pool.query(sql, sqlData,(error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 添删除标签关联记录
  deleteTagRelationList(data) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM list_label_relationship WHERE id=?'
      let sqlData = [data.id]
      pool.query(sql, sqlData,(error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 通过listid查询关联记录
  queryRelationList(id) {
    return new Promise((resolve, reject) => {
      const sql = 'select * FROM list_label_relationship WHERE listid=?'
      let sqlData = [id]
      pool.query(sql, sqlData,(error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 通过labelid查询关联记录
  findRelationListByLabelId(id) {
    return new Promise((resolve, reject) => {
      const sql = 'select * FROM list_label_relationship WHERE labelid=?'
      let sqlData = [id]
      pool.query(sql, sqlData,(error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }

  // 添加除标签记录
  insertTagItem(data) {
    return new Promise((resolve, reject) => {
      const sql = 'insert into home_list_label (id, label) values (?,?)'
      let uuid = uuidv4()
      let sqlData = [uuid, data.label]
      pool.query(sql, sqlData,(error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve({...result, insertId: uuid})
      })
    })
  }

  // 删除除标签记录
  deleteTagList(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM home_list_label WHERE id=?'
      let sqlData = [id]
      pool.query(sql, sqlData,(error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }
  queryLabelByName (labelName) {
    return new Promise((resolve, reject) => {
      const sql = 'select * FROM home_list_label WHERE label=?'
      let sqlData = [labelName]
      pool.query(sql, sqlData,(error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }
  queryNormalUsedTagList (userid) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT t1.id, t1.label, COUNT(t2.labelid) AS count FROM home_list_label t1 LEFT JOIN list_label_relationship t2 ON t1.id = t2.labelid left join home_list t3 on t2.listid=t3.id WHERE t3.userid='${userid}' GROUP BY t1.id, t1.label ORDER BY count DESC limit 0,10`
      pool.query(sql,(error, result, fields) => {
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

  findHomeListItemLabels(id) {
    return new Promise((resolve, reject) => {
      pool.query(`Select a.labelid as id,b.label FROM list_label_relationship a LEFT JOIN home_list_label b on a.labelid=b.id WHERE a.listid=?`, id, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }
  // 修改博客置顶状态
  changeToppingStatus (id, timeStamp) {
    return new Promise((resolve, reject) => {
      let sql = 'UPDATE home_list set topping=? where id=?'
      let sqlData = [timeStamp, id]
      pool.query(sql, sqlData, (error, result, fields) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  }
}

module.exports = new Mysql()

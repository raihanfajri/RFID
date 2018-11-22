'use strict';
var sequelize = require('../connection'),
    log = sequelize.import('../repository/log.table'),
    user = sequelize.import('../repository/user.table'),
    role = sequelize.import('../repository/role.table')

log.belongsTo(user, {foreignKey : 'user_id'})
user.belongsTo(role, { foreignKey: 'role_id' })

class LogClass{
  constructor(){

  }

  getAllActiveLogs(callback){
    log.findAll({
      where: {status : 1},
      include: [{
        model : user,
        include : role
      }],
      order : [['updated_date','DESC']]
    }).then(result => {
        callback({err: false, data: result})
    }).catch(err => {
        callback({err: true, data: err})
    })
  }

  getActiveLogById(id, callback){
    log.findOne({
      where: {status : 1},
      include: [{
        model : user
      }]
    }).then(result => {
        callback({err: false, data: result})
    }).catch(err => {
        callback({err: true, data: err})
    })
  }

  getCheckedinLogByUserId(user_id, callback){
      log.findOne({
            where: {user_id: user_id,status : 1, checkout_time: null}
        }).then(result => {
            callback({err: false, data: result})
        }).catch(err => {
            callback({err: true, data: err})
        })
  }

  createLog(data, callback){
    log.create({
        user_id: data.user_id,
        checkin_time: new Date(),
        status: 1,
        created_date: new Date(),
        updated_date: new Date()
    }).then(result => {
        callback({err: false, data: result})
    }).catch(err => {
        callback({err: true, data: err})
    })
  }

  updateCheckoutLog(log_id, callback){
    log.update({
        checkout_time: new Date(),
        status: 1,
        updated_date: new Date()
    },{
      where: {id: log_id, status: 1}
    }).then(result => {
        callback({err: false, data: result})
    }).catch(err => {
        callback({err: true, data: err})
    })
  }

  updateTujuanLog(data, callback){
    log.update({
        tujuan: data.tujuan,
        status: 1,
        updated_date: new Date()
    },{
      where: {id : data.id}
    }).then(result => {
        callback({err: false, data: result})
    }).catch(err => {
        callback({err: true, data: err})
    })
  }

  deleteLog(id, callback){
    log.update({
        status: 4,
        updated_date: new Date()
    },{
      where: {id : id}
    }).then(result => {
        callback({err: false, data: result})
    }).catch(err => {
        callback({err: true, data: err})
    })
  }

}

module.exports = LogClass;
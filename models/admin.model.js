'use strict';
var sequelize = require('../connection'),
    admin = sequelize.import('../repository/admin.table')


class AdminClass{
  constructor(){

  }

  getListActiveAdmin(callback){
    admin.findAll({
        where:{
            status : 1
        }
    }).then(result => {
        callback({err: false, data: result})
    }).catch( err => {
        callback({err: true, data: err})
    })
  }

  getAllActiveAdminByUsername(username, callback){
    admin.findAll({
        where:{
            username : username,
            status : 1
        }
    }).then(result => {
        callback({err: false, data: result})
    }).catch( err => {
        callback({err: true, data: err})
    })
  }

  loginAdmin(data, callback){
    admin.findOne({
        where:{
            username : data.username,
            password : data.password,
            status : 1
        }
    }).then(result => {
        callback({err: false, data: result})
    }).catch( err => {
        callback({err: true, data: err})
    })
  }

  createAdmin(data, callback){
    admin.create({
        username: data.username,
        password: data.password,
        role_admin: data.role_admin,
        status: 1,
        created_date: new Date(),
        updated_date: new Date()
    }).then(result => {
        callback({err: false, data: result})
    }).catch(err => {
        callback({err: true, data: err})
    })
  }

  deleteAdmin(id, callback){
    admin.update({
        status: 4,
        updated_date: new Date()
    },{
        where: {
          id : id
        }
    }).then(result => {
        callback({err: false, data: result})
    }).catch(err => {
        callback({err: true, data: err})
    })
  }

  updateAdmin(data, callback){
    admin.update({
        username: data.username,
        password: data.password,
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

}

module.exports = AdminClass;
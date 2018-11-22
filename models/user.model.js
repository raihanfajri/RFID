'use strict';
var sequelize = require('../connection'),
    user = sequelize.import('../repository/user.table'),
    role = sequelize.import('../repository/role.table')

user.belongsTo(role, { foreignKey: 'role_id' })

class UserModel{
  constructor(){

  }
    getActiveUserByRFID(rfid, callback){
        user.findOne({
            where:{
                rfid : rfid,
                status : 1
            },
            include: [{
                model: role
            }]
        }).then(result => {
            callback({err: false, data: result})
        }).catch( err => {
            console.log(err)
            callback({err: true, data: err})
        })
    }

    getListActiveUsers(callback){
      user.findAll({
          where:{
              status : 1
          },
          order:[
              ['updated_date', 'DESC']
          ],
          include: [{
              model: role
          }]
      }).then(result => {
          callback({err: false, data: result})
      }).catch( err => {
          callback({err: true, data: err})
      })
    }

    getDeletedUserByRFID(rfid, callback){
        user.findAll({
          where:{
              status : 4
          },
          order:[
              ['updated_date', 'DESC']
          ],
          include: [{
              model: role
          }]
      }).then(result => {
          callback({err: false, data: result})
      }).catch( err => {
          callback({err: true, data: err})
      })
    }

    getListUsers(callback){
      user.findAll({
          include: [{
            model: role
          }]
      }).then(result => {
          callback({err: false, data: result})
      }).catch( err => {
          callback({err: true, data: err})
      })
    }

    createUser(data, callback){
      user.create({
          name: data.name,
          rfid: data.rfid,
          role_id: data.role_id,
          status: 1,
          created_date: new Date(),
          updated_date: new Date()
      }).then(result => {
          callback({err: false, data: result})
      }).catch(err => {
          callback({err: true, data: err})
      })
    }

    updateUser(data, callback){
      user.update({
          name: data.name,
          role_id: data.role_id,
          status: 1,
          updated_date: new Date()
      },{
        where:{
            id: data.id
        }
    }).then(result => {
          callback({err: false, data: result})
      }).catch(err => {
          callback({err: true, data: err})
      })
    }

    deleteUser(id, callback){
      user.update({
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
}

module.exports = UserModel
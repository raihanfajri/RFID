'use strict';
var sequelize = require('../connection'),
    role = sequelize.import('../repository/role.table'),
    user = sequelize.import('../repository/user.table')
    
role.hasMany(user, {foreignKey : 'role_id'})
user.belongsTo(role, {foreignKey: 'role_id'})

class RoleClass{
  constructor(){

  }

  getAllActiveRoles(callback){
    role.findAll({
      where: { status : 1},
      include: [{
        model: user,
        required: false,
        require: false,
        where: {
          status : 1
        }
      }]
    }).then(result => {
      callback({err: false, data: result})
    }).catch(err => {
      console.log(err)
      callback({err: true, data: err})
    })
  }

  getActiveRoleById(id, callback){
    role.findOne({
      where: { status : 1, id: id}
    }).then(result => {
      callback({err: false, data: result})
    }).catch(err => {
      callback({err: true, data: err})
    })
  }

  createRole(data, callback){
    role.create({
      name: data.name,
      status: 1,
      delete_after_checkout : data.delete_after_checkout,
      created_date: new Date(),
      updated_date: new Date()
    }).then(result => {
      callback({err: false, data: result})
    }).catch(err => {
      callback({err: true, data: err})
    })
  }

  updateRole(data, callback){
    role.update({
      name: data.name,
      delete_after_checkout : data.delete_after_checkout,
      status: 1,
      updated_date: new Date()
    },{
        where: {
          id: data.id
        }
      }
    ).then(result => {
      callback({err: false, data: result})
    }).catch(err => {
      callback({err: true, data: err})
    })
  }

  deleteRole(id, callback){
    role.update({
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

module.exports = RoleClass
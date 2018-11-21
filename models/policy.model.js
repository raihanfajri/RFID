'use strict';
var sequelize = require('../connection'),
    policy = sequelize.import('../repository/policy.table'),
    role = sequelize.import('../repository/role.table')

policy.belongsTo(role, {foreignKey: 'role_id'})

class PolicyClass{
  constructor(){

  }

  getAllActivePolicies(callback){
    policy.findAll({
      where: {status : 1},
      include: [{
        model : role
      }]
    }).then(result => {
        callback({err: false, data: result})
    }).catch(err => {
        callback({err: true, data: err})
    })
  }

  getActivePolicyById(id, callback){
    policy.findOne({
      where: {status : 1},
      include: [{
        model : role
      }]
    }).then(result => {
        callback({err: false, data: result})
    }).catch(err => {
        callback({err: true, data: err})
    })
  }

  createPolicy(data, callback){
    policy.create({
        name: data.name,
        role_id: data.role_id,
        day: data.day,
        status: 1,
        created_date: new Date(),
        updated_date: new Date()
    }).then(result => {
        callback({err: false, data: result})
    }).catch(err => {
        callback({err: true, data: err})
    })
  }

  updatePolicy(data, callback){
    policy.update({
        name: data.name,
        role_id: data.role_id,
        day: data.day,
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

  deletePolicy(id, callback){
    policy.update({
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

module.exports = PolicyClass
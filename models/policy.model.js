'use strict';
var sequelize = require('../connection'),
    policy = sequelize.import('../repository/policy.table'),
    role = sequelize.import('../repository/role.table')

policy.belongsTo(role, {foreignKey: 'role_id'})
role.hasMany(policy, {foreignKey: 'role_id'})

class PolicyClass{
  constructor(){

  }

  getAllActivePolicies(callback){
    role.findAll({
      where: {status : 1},
      include: [{
        model : policy,
        where: {status : 1},
        order: [['day','ASC']]
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

  checkPolicyByDay(data, callback){
    policy.findOne({
        where: {
            status : 1,
            day : data.day,
            role_id : data.role_id
        }
    }).then(result => {
        callback({err: false, data: result})
    }).catch(err => {
        callback({err: true, data: err})
    })
  }

  create(data, callback){
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

  bulkCreate(data, callback){
      policy.bulkCreate(data)
        .then(() => {
            callback({err: false, data: []})
        }).catch(err => {
            callback({err: true, data: err})
        })
  }

  update(data, callback){
    policy.update({
        role_id: data.role_id,
        day: data.day,
        checkin: data.checkin,
        checkout: data.checkout,
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

  delete(id, callback){
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
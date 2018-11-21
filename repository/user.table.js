'use strict';
var sequelize = require('../connection');

module.exports = function(sequelize, DataTypes){
  return sequelize.define('user', {
    name: DataTypes.STRING,
    rfid: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    created_date: DataTypes.DATE,
    updated_date: DataTypes.DATE
  }, {
    timestamps: false
  });
}
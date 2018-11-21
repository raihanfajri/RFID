'use strict';
var sequelize = require('../connection');
module.exports = function(sequelize, DataTypes){
  return sequelize.define('log', {
    user_id: DataTypes.INTEGER,
    tujuan: DataTypes.STRING,
    checkin_time: DataTypes.DATE,
    checkout_time: DataTypes.DATE,
    status: DataTypes.INTEGER,
    created_date: DataTypes.DATE,
    updated_date: DataTypes.DATE
  }, {
      timestamps: false
  });
};
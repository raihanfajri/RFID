'use strict';
var sequelize = require('../connection');
module.exports = function(sequelize, DataTypes){
  return sequelize.define('admin', {
    username: DataTypes.STRING,
    password: DataTypes.TEXT,
    role_admin: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    created_date: DataTypes.DATE,
    updated_date: DataTypes.DATE
  }, {
      timestamps: false
  });
};
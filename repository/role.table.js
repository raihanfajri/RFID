'use strict';
var sequelize = require('../connection');
module.exports = function(sequelize, DataTypes){
  return sequelize.define('role', {
    name: DataTypes.STRING,
    delete_after_checkout: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    created_date: DataTypes.DATE,
    updated_date: DataTypes.DATE
  }, {
      timestamps: false
  });
};
'use strict';
var sequelize = require('../connection');
module.exports = function(sequelize, DataTypes){
  return sequelize.define('policy', {
    name: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    day: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    created_date: DataTypes.DATE,
    updated_date: DataTypes.DATE
  }, {
      timestamps: false
  });
};
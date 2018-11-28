var express = require('express'),
	router = express.Router(),
    sequelize = require('../connection'),
    role = require('./../models/role.model')

var role_model = new role;

class RoleController{
    constructor(){
        
    }

    getAllRoles(req, res){
        role_model.getAllActiveRoles(function(result){
            if(!result.err){
                var dataPromise = new Promise(function(resolve, reject){
                    var dataResult = [];
                    for(var i in result.data){
                        dataResult.push({
                            id: result.data[i].id,
                            name: result.data[i].name,
                            status: result.data[i].delete_after_checkout == 1 ? 'Temporary' : 'Permanent',
                            count_users: result.data[i].users.length
                        })
                    }
                    resolve(dataResult)
                })
                dataPromise.then(function(dataResult){
                    let message = "Semua data role berhasil diambil"
                    res.status(200).json({err: false, message: message, data: dataResult});
                })
            }
            else{
                let message = "Semua data role gagal diambil"
                res.status(500).json({err: true, message: message, data: result.data});    
            }
        });
    }

    /* Create new record */
    create(req, res){
        role_model.createRole(req.body, function(result){
            if(!result.err){
                let message = "Data role baru berhasil ditambahkan!"
                res.status(201).json({err: false, message: message, data: result.data});
            }
            else{
                let message = "Data role baru gagal ditambahkan!"
                res.status(500).json({err: true, message: message, data: result.data});    
            }
        })
    }

    /* Update a role */
    update(req, res){
        role_model.updateRole(req.body, function(result){
            if(!result.err){
                let message = "Data role berhasil diganti!"
                res.status(201).json({err: false, message: message, data: result.data});
            }
            else{
                let message = "Data role gagal diganti!"
                res.status(500).json({err: true, message: message, data: result.data});    
            }
        })
    }

    /** Delete a role */
    delete(req, res){
        role_model.deleteRole(req.body.id, function(result){
            if(!result.err){
                let message = "Data role berhasil dihapus!"
                res.status(201).json({err: false, message: message, data: result.data});
            }
            else{
                let message = "Data role gagal dihapus!"
                res.status(500).json({err: true, message: message, data: result.data});    
            }
        })
    }

    
}
module.exports = RoleController;
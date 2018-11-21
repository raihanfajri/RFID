var express = require('express'),
	router = express.Router(),
    sequelize = require('../connection'),
    admin = require('./../models/admin.model'),
    constant = require('../utils/constant'),
    crypto = require('crypto');


var admin_model = new admin;

class AdminController{
    constructor(){
        
    }    

    /* Register new admin */
    register(req, res){
        var data = {
            username : req.body.username,
            password : req.body.password,
            role_admin : req.body.role_admin
        }
        const hmac = crypto.createHmac('sha256', process.env.HASH_SECRET);
        var hashPassword = hmac.update(data.password).digest('hex');
        data.password = hashPassword;
        /** Check username is exist. if exist return failed */
        admin_model.getAllActiveAdminByUsername(data.username, function(result){
            if(!result.err){
                if(result.data.length == 0){
                    admin_model.createAdmin(data, function(result){
                        if(!result.err){
                            let message = "Data admin baru berhasil ditambahkan!"
                            res.status(200).json({err: false, message: message, data: result.data});
                        }
                        else{
                            let message = "Data admin baru gagal ditambahkan!"
                            res.status(500).json({err: true, message: message, data: result.data});    
                        }
                    })
                }else{
                    let message = "Username sudah terpakai!"
                    res.status(500).json({err: true, message: message, data: {}});
                }
            }else{
                let message = "Data admin baru gagal ditambahkan!"
                res.status(500).json({err: true, message: message, data: result.data});    
            }
        })
    }

    /** Login Admin */
    login(req, res){
        var data = {
            username : req.body.username,
            password : req.body.password
        }
        const hmac = crypto.createHmac('sha256', process.env.HASH_SECRET);
        var hashPassword = hmac.update(data.password).digest('hex');
        data.password = hashPassword;
        admin_model.loginAdmin(data, function(result){
            if(!result.err){
                if(result.data != null){
                    var returnedData = {
                        found : true,
                        admin : {
                            id : result.data.id,
                            username : result.data.username,
                            role_admin : constant.roleAdminNumberToString(result.data.role_admin),
                            updated_date : result.data.updated_date
                        }
                    }
                    let message = "Berhasil Login!"
                    res.status(200).json({err: false, message: message, data: returnedData});
                }else{
                    var returnedData = {
                        found : false,
                        admin : {}
                    }
                    let message = "Username atau password salah!"
                    res.status(200).json({err: false, message: message, data: returnedData});
                }
            }
            else{
                let message = "Login gagal"
                res.status(500).json({err: true, message: message, data: result.data});    
            }
        })
    }

    
}
module.exports = AdminController;
var express = require('express'),
	router = express.Router(),
    sequelize = require('../connection'),
    admin = require('./../models/admin.model'),
    constant = require('../utils/constant'),
    jwt = require('jsonwebtoken'),
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
                    var admin = {
                            id : result.data.id,
                            username : result.data.username,
                            role_admin : constant.roleAdminNumberToString(result.data.role_admin),
                            role_admin_id: result.data.role_admin,
                            updated_date : result.data.updated_date
                    }
                    var token = jwt.sign(admin, process.env.JWT_SECRET);
                    var returnedData = {
                        found : true,
                        token : token
                    }
                    let message = "Berhasil Login!"
                    res.status(200).json({err: false, message: message, data: returnedData});
                }else{
                    var returnedData = {
                        found : false,
                        token : {}
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

    verifyToken(req, res){
        jwt.verify(req.headers.authorization, process.env.JWT_SECRET, function(err, decoded) {
            if(err == null){
                res.json({
                    err: false,
                    message: "Token Valid",
                    data: {
                        verified : true,
                        user_data : decoded
                    }
                })
            }
            else{
                res.json({
                    err: true,
                    message: "Token Invalid",
                    data: {
                        verified : false
                    }
                })
            }
        });
    }

    getAllAdmin(res){
        admin_model.getListAllAdmin(function(result){
            var dataPromise = new Promise(function(resolve, reject){
                var data = []
                for(var i in result.data){
                    data.push({
                        id: result.data[i].id,
                        username: result.data[i].username,
                        status: result.data[i].status,
                        date : constant.convertToGMT7(result.data[i].created_date, 0)
                    })
                }
                resolve(data)
            })
            dataPromise.then(function(data){
                res.status(200).json({err:false, data: data})
            })
        })
    }

    updateAdminData(req, res){
        var data = {
            username: req.body.username,
            status : 1,
            updated_date : new Date()
        }
        if(req.body.password != ""){
            const hmac = crypto.createHmac('sha256', process.env.HASH_SECRET);
            var hashPassword = hmac.update(req.body.password).digest('hex');
            data['password'] = hashPassword
        }
        admin_model.updateAdmin(data, req.body.id, function(result){
            if(!result.err){
                let message = "Data admin berhasil diganti!"
                res.status(201).json({err: false, message: message, data: result.data});
            }
            else{
                let message = "Data admin gagal diganti!"
                res.status(500).json({err: true, message: message, data: error});    
            }
        })
    }

    deleteAdmin(req, res){
        admin_model.deleteAdmin(req.body.id, function(result){
            if(!result.err){
                let message = "Data admin berhasil dihapus!"
                res.status(201).json({err: false, message: message, data: result.data});
            }
            else{
                let message = "Data admin gagal dihapus!"
                res.status(500).json({err: true, message: message, data: error});    
            }
        })
    }

    aktifkanAdmin(req, res){
        var data = {
            status: 1,
            updated_date : new Date()
        }
        admin_model.updateAdmin(data, req.body.id, function(result){
            if(!result.err){
                let message = "Data admin berhasil diganti!"
                res.status(201).json({err: false, message: message, data: result.data});
            }
            else{
                let message = "Data admin gagal diganti!"
                res.status(500).json({err: true, message: message, data: error});    
            }
        })
    }
}
module.exports = AdminController;
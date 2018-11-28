var express = require('express'),
	router = express.Router(),
    sequelize = require('../connection'),
    user = require('./../models/user.model'),
    crypto = require('crypto');

var user_model = new user;

class UserController{
    constructor(){
        
    }

    

    /* Create new record */
    create(req, res){
        user_model.createUser(req.body, function(result){
            if(!result.err){
                let message = "Data user baru berhasil ditambahkan!"
                res.status(201).json({err: false, message: message, data: result.data});
            }
            else{
                let message = "Data user baru gagal ditambahkan!"
                res.status(500).json({err: true, message: message, data: error});    
            }
        })
    }

    /* Update a record where tanggal = req.tanggal */
    update(req, res){
        user_model.updateUser(req.body, function(result){
            if(!result.err){
                let message = "Data user berhasil diganti!"
                res.status(201).json({err: false, message: message, data: result.data});
            }
            else{
                let message = "Data usergagal diganti!"
                res.status(500).json({err: true, message: message, data: error});    
            }
        })
    }

    delete(req, res){
        user_model.deleteUser(req.body.id, function(result){
            if(!result.err){
                let message = "Data user berhasil dihapus!"
                res.status(201).json({err: false, message: message, data: result.data});
            }
            else{
                let message = "Data usergagal dihapus!"
                res.status(500).json({err: true, message: message, data: error});    
            }
        })
    }

    /* Show all user data descending ordered by tanggal */
    showAll(res){
        var message = 'Successfuly get all users'
        user_model.getListUsers(function(result){
            if(!result.err){
                if(result.data.length != 0){
                    var dataPromise = new Promise(function(resolve, reject){
                        var dataResult = [];
                        for(var i in result.data){
                            var posisi = 0
                            if(typeof result.data[i].logs[0] != 'undefined'){
                                posisi = result.data[i].logs[0].checkout_time == null ? 1 : 0
                            }
                            var date = new Date(result.data[i].created_date)
                            var utc = date.getTime() + (0 * 60000)
                            var gmt7 = new Date(utc + (3600000*7))
                            gmt7 = gmt7.getDate() + '-' + (gmt7.getMonth()+1) + '-' + gmt7.getFullYear() + ' ' + 
                                   gmt7.getHours() + ':' + gmt7.getMinutes()
                            dataResult.push({
                                id: result.data[i].id,
                                name: result.data[i].name,
                                status: result.data[i].status,
                                date: gmt7,
                                role: result.data[i].role,
                                posisi: posisi
                            })
                        }
                        resolve(dataResult)
                    })
                    dataPromise.then(function(dataResult){
                        res.status(200).json({status: true, message: message, data: dataResult});
                    })
                }
                else{
                    message = 'Users not found';
                    res.status(200).json({status: true, message: message, data: []});
                }
            }
            else{
                message = 'Failed to get all users';
                res.status(500).json({status: false, message: message, data: result.data});
            }
        });
    }

    filteredList(req, res){
        var data = {
            name : req.query.nama,
            role : {
                id : parseInt(req.query.kriteria)
            },
            posisi : parseInt(req.query.posisi)
        }
        user_model.getFilteredUsers(data, function(result){
            var message = 'Successfuly get all users'
            if(result.data.length != 0){
                var dataPromise = new Promise(function(resolve, reject){
                    var dataResult = [];
                    for(var i in result.data){
                        var posisi = 0
                        if(typeof result.data[i].logs[0] != 'undefined'){
                            posisi = result.data[i].logs[0].checkout_time == null ? 1 : 0
                        }
                        if(data.posisi != -1){
                            if(posisi != data.posisi){
                                continue;
                            }
                        }
                        if(data.role.id != -1){
                            if(result.data[i].role.id != data.role.id){
                                continue;
                            }
                        }
                        var date = new Date(result.data[i].created_date)
                        var utc = date.getTime() + (0 * 60000)
                        var gmt7 = new Date(utc + (3600000*7))
                        gmt7 = gmt7.getDate() + '-' + (gmt7.getMonth()+1) + '-' + gmt7.getFullYear() + ' ' + 
                                gmt7.getHours() + ':' + gmt7.getMinutes()
                        dataResult.push({
                            id: result.data[i].id,
                            name: result.data[i].name,
                            status: result.data[i].status,
                            date: gmt7,
                            role: result.data[i].role,
                            posisi: posisi
                        })
                    }
                    resolve(dataResult)
                })
                dataPromise.then(function(dataResult){
                    res.status(200).json({status: true, message: message, data: dataResult});
                })
            }
            else{
                message = 'Users not found';
                res.status(200).json({status: true, message: message, data: []});
            }
        })
    }
}
module.exports = UserController;
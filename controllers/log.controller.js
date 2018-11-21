var express = require('express'),
	router = express.Router(),
    sequelize = require('../connection'),
    user = require('./../models/user.model'),
    log = require('./../models/log.model'),
    async = require('async'),
    crypto = require('crypto')

var user_model = new user;
var log_model = new log;


class LogController{
    constructor(){
            
    }

    tapRFID(req, res){
        var rfid = req.body.rfid
        /** check if active rfid exist */
        user_model.getActiveUserByRFID(rfid, function(result1){
            if(!result1.err){
                /** if exist check log, if not create new user */
                if(result1.data != null){
                    var user_data = {
                        user_id: result1.data.id,
                        rfid: result1.data.rfid,
                        name: result1.data.name,
                        role: result1.data.role
                    }
                    /** check check_in status user in log */
                    log_model.getCheckedinLogByUserId(user_data.user_id, function(result2){
                        if(!result2.err){
                            /** if exist update checkout_time log, if not create new log */
                            if(result2.data != null){
                                var log_id = result2.data.id
                                log_model.updateCheckoutLog(log_id, function(result3){
                                    if(!result3.err){
                                        /** if user is disposable, user is deleted */
                                        if(user_data.role.delete_after_checkout == 1){
                                            user_model.deleteUser(user_data.user_id, function(result4){

                                            })
                                        }
                                        /** Emit check out */
                                        var data = {
                                            status : 2,
                                            user_data : user_data,
                                            log_data : result3.data,
                                            message: 'Successfuly Checkout User'
                                        }
                                        io.emit('check', data)
                                        res.status(200).json({err: false, message: 'Successfuly Checkout User', data: data})
                                    }else{
                                        res.status(500).json({err: true, message: result3.data})
                                    }
                                })
                            }else{
                                log_model.createLog(user_data, function(result3){
                                    if(!result3.err){
                                        /** Emit check in */
                                        var data = {
                                            status : 1,
                                            user_data : user_data,
                                            log_data : result3.data,
                                            message: 'Successfuly Checkin user'
                                        }
                                        io.emit('check', data)
                                        res.status(200).json({err: false, message: 'Successfuly Checkin user', data: data})
                                    }else{
                                        res.status(500).json({err: true, message: result3.data})
                                    }
                                });
                            }
                        }else{
                            res.status(500).json({err: true, message: result2.data})
                        }
                    });
                }else{
                    var data = {
                        status : 3,
                        user_data: {
                            rfid: rfid
                        },
                        message: 'Card is not registered'
                    }
                    /** Emit create user */
                    io.emit('check', data)
                    res.status(200).json({err: false, message: 'Card is not registered', data: data})
                }
            }else{
                res.status(500).json({err: true, message: result1.data})
            }
        });
    }

    tapRFIDDetail(req, res){
        var rfid = req.body.rfid
        user.getActiveUserByRFID(rfid, function(result){
            if(!result.err){
                /** if exist return user data */
                if(result.data != null){
                    /** emit  user detail */
                    var data = {
                        status : 4,
                        user_data: {
                            user_id: result.data.id,
                            name: result.data.name,
                            rfid: result.data.rfid,
                            role: result.data.role
                        },
                        message: 'Successfuly get card user'
                    }
                    /** Emit create user */
                    router.io.emit('check', data)
                    res.status(200).json({err: false, message: 'Successfuly get card user', data: result.data})
                }else{
                    var data = {
                        status : 3,
                        user_data: {
                            rfid: rfid
                        },
                        message: 'Card is not registered'
                    }
                    /** Emit create user */
                    router.io.emit('check', data)
                    res.status(200).json({err: false, message: 'Card is not registered', data: {}})
                }
            }else{
                res.status(500).json({err: true, message: result.data})
            }
        });
    }

    /* Create new record */
    create(req, res){
        user.createUser(req.body, function(result){
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
        berat.update({
            max : req.body.max,
            min : req.body.min
        },{
            where : { tanggal : req.body.tanggal }
        }).then(result => {
            let message = "Data berat berhasil diupdate!"
            res.status(201).json({status: true, message: message, data: result});
        }).catch(error => {
            let message = "Data berat gagal diupdate!"
            res.status(500).json({status: false, message: message, data: error});
        });
    }

    /* Show all user data descending ordered by tanggal */
    showAll(res){
        var rfid = 'asd'
        var message = 'Successfuly get all active users'
        user_model.getListActiveUsers(function(result){
            if(!result.err){
                if(result.data.length != 0){
                    res.status(200).json({status: true, message: message, data: result.data});
                }
                else{
                    message = 'Active users not found';
                    res.status(200).json({status: true, message: message, data: []});
                }
            }
            else{
                message = 'Failed to get all active users';
                res.status(500).json({status: false, message: message, data: result.data});
            }
        });
    }

    /* Show detail of a record depends on tanggal */
    showDetail(req, res){
        let tanggal = new Date(req.params.tanggal)
        if(tanggal == null){
            let message = "Invalid input!";
            res.status(400).json({status: false, message: message, data: null})
        }
        berat.findOne({
            where: {
                tanggal : tanggal
            }
        }).then(result => {
            let message = "";
            if(result == null){
                message = "Tidak ada data dalam database!";
                console.log(message)
                res.json({status: true, message: message, data: result});
            }else{
                message = "Data ditemukan!";
                res.status(200).json({status: true, message: message, data: result});
            }
        }).catch(error => {
            let message = "Gagal mengambil data!"
            res.status(500).json({status: false, message: message, data: error});
        });
    }
}
module.exports = LogController;
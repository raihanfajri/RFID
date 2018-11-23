var express = require('express'),
	router = express.Router(),
    sequelize = require('../connection'),
    user = require('./../models/user.model'),
    log = require('./../models/log.model'),
    async = require('async'),
    crypto = require('crypto'),
    constant = require('../utils/constant')

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
                                        var check_out = constant.convertToGMT7(new Date(), 7)
                                        var data = {
                                            status : 2,
                                            user_data : user_data,
                                            log_data : result3.data,
                                            check_out: check_out,
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
                                            tujuan : result3.data.tujuan != null ? result3.data.tujuan : '-',
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

    updateLog(req, res){
        log_model.updateTujuanLog(req.body, function(result){
            if(!result.err){
                let message = "Data log berhasil diganti!"
                res.status(201).json({err: false, message: message, data: result.data});
            }
            else{
                let message = "Data log gagal diganti!"
                res.status(500).json({err: true, message: message, data: error});    
            }
        })
    }

    /* Show all user data descending ordered by tanggal */
    showAll(res){
        var message = 'Successfuly get all active logs'
        log_model.getAllActiveLogs(function(result){
            if(!result.err){
                if(result.data.length != 0){
                    var dataPromise = new Promise(function(resolve, reject){
                        var data = []
                        for(var i in result.data){
                            var check_in = constant.convertToGMT7(result.data[i].checkin_time, 0)
                            var check_out = result.data[i].checkout_time != null ? constant.convertToGMT7(result.data[i].checkout_time, 0) : '-'
                            data.push({
                                id : result.data[i].id,
                                tujuan : result.data[i].tujuan != null ? result.data[i].tujuan : '-',
                                status : result.data[i].checkout_time == null ? 1 : 0,
                                checkin_time : check_in,
                                checkout_time : check_out,
                                user : result.data[i].user
                            })
                        }
                        resolve(data)
                    })
                    dataPromise.then(function(data){
                        res.status(200).json({status: true, message: message, data: data});
                    })
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
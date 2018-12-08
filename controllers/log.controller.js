var express = require('express'),
	router = express.Router(),
    sequelize = require('../connection'),
    user = require('./../models/user.model'),
    log = require('./../models/log.model'),
    async = require('async'),
    crypto = require('crypto'),
    constant = require('../utils/constant'),
    policy = require('./../models/policy.model')

var user_model = new user;
var log_model = new log;
var policy_model = new policy;
const excel = require('node-excel-export')


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
                    var policy_data = {
                        day : new Date().getDay(),
                        role_id : user_data.role.id
                    }
                    policy_model.checkPolicyByDay(policy_data, function(policy_result){
                        policy_result.data = policy_result.data != null ? policy_result.data : {checkin : 1, checkout: 1}
                        /** check check_in status user in log */
                        log_model.getCheckedinLogByUserId(user_data.user_id, function(result2){
                            if(!result2.err){
                                /** if exist update checkout_time log, if not create new log */
                                if(result2.data != null){
                                    if(policy_result.data.checkout == 1){
                                        var log_id = result2.data.id
                                        log_model.updateCheckoutLog(log_id, function(result3){
                                            if(!result3.err){
                                                /** if user is disposable, user is deleted */
                                                if(user_data.role.delete_after_checkout == 1){
                                                    user_model.deleteUser(user_data.user_id, function(result4){})
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
                                        var data = {
                                            status : 5,
                                            user_data: user_data,
                                            message: user_data.role.name +' dilarang keluar pada hari ini'
                                        }
                                        io.emit('check', data)
                                        res.status(200).json({err: false, message: 'Failed to checkout user', data : data})
                                    }
                                }else{
                                    if(policy_result.data.checkin == 1){
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
                                    }else{
                                        var data = {
                                            status : 6,
                                            user_data: user_data,
                                            message: user_data.role.name +' dilarang masuk pada hari ini'
                                        }
                                        io.emit('check', data)
                                        res.status(200).json({err: false, message: 'Failed to checkin user', data: data})
                                    }
                                }
                            }else{
                                res.status(500).json({err: true, message: result2.data})
                            }
                        });   
                    })
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
        user_model.getActiveUserByRFID(rfid, function(result){
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
                    io.emit('check', data)
                    res.status(200).json({err: false, message: 'Successfuly get card user', data: data})
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

    generateExcel(req, res){
        const styles = {
            headerDark: {
                font: {
                    color: {
                        rgb: 'FF000000'
                    },
                    sz: 14,
                    bold: true,
                    underline: true,
                },
                alignment: {
                    horizontal : 'center',
                    vertical : 'center'
                }
            }
        }
        const heading = [
            ['Nama', 'Kriteria', 'Tujuan', 'Status', 'Waktu Masuk', 'Waktu Keluar'] 
        ];
        const specification = {
            name: {
                displayName: 'Nama', 
                headerStyle: styles.headerDark,
                width: 120 // <- width in pixels
            },
            role: {
                displayName: 'Kriteria',
                headerStyle: styles.headerDark,
                width: 120 
            },
            tujuan: {
                displayName: 'Tujuan',
                headerStyle: styles.headerDark,
                width: 120
            },
            status: {
                displayName: 'Status',
                headerStyle: styles.headerDark,
                width: 120
            },
            checkin_time: {
                displayName: 'Waktu Masuk',
                headerStyle: styles.headerDark,
                width: 120
            },
            checkout_time: {
                displayName: 'Waktu Keluar',
                headerStyle: styles.headerDark,
                width: 120
            }
        }
        this.filteredLog(req, function(logData){
            const dataset = logData.data
            const report = excel.buildExport(
            [
                {
                    name: 'Report', // <- Specify sheet name (optional)
                    specification: specification, // <- Report specification
                    data: dataset // <-- Report data
                }
            ]);
            res.attachment('report.xlsx')
            res.send(report)
        })
    }

    filteredLog(req, callback){
        var year = req.query.year
        var top_month = req.query.month == -1 ? 0 : (req.query.month-1)
        var bot_month = req.query.month == -1 ? 12 : (req.query.month)
        var top_date = new Date((new Date(year, top_month, 1)).getTime() +  (7*3600000))
        var bot_date = new Date((new Date(year, bot_month, 0)).getTime() +  (7*3600000))
        log_model.getAllActiveLogs(function(result){
            if(result.data.length != 0){
                var dataPromise = new Promise(function(resolve, reject){
                    var data = []
                    for(var i in result.data){
                        var checkin_date = new Date((new Date(result.data[i].checkin_time)).getTime() +  (7*3600000))
                        if(checkin_date < top_date || checkin_date > bot_date){
                            if(result.data[i].checkin_time != null){
                                var checkout_date = new Date((new Date(result.data[i].checkout_time)).getTime() +  (7*3600000))
                                if(checkout_date < top_date || checkout_date > bot_date){
                                    continue
                                }
                            }else{
                                continue
                            }
                        }
                        var checkout_date = new Date((new Date(result.data[i].checkout_time)).getTime() +  (7*3600000))
                        var check_in = constant.convertToGMT7(result.data[i].checkin_time, 0)
                        var check_out = result.data[i].checkout_time != null ? constant.convertToGMT7(result.data[i].checkout_time, 0) : '-'
                        data.push({
                            tujuan : result.data[i].tujuan != null ? result.data[i].tujuan : '-',
                            status : result.data[i].checkout_time == null ? 'Masuk' : 'Keluar',
                            checkin_time : check_in,
                            checkout_time : check_out,
                            name : result.data[i].user.name,
                            role : result.data[i].user.role.name
                        })
                    }
                    resolve(data)
                })
                dataPromise.then(function(dataResult){
                    callback({data : dataResult})
                })
            }else{
                callback({data: []})
            }
        })
    }
}
module.exports = LogController;

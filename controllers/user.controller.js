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
        var message = 'Successfuly get all users'
        user_model.getListUsers(function(result){
            if(!result.err){
                if(result.data.length != 0){
                    var dataPromise = new Promise(function(resolve, reject){
                        var dataResult = [];
                        for(var i in result.data){
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
                                role: result.data[i].role
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
module.exports = UserController;
var express = require('express'),
	router = express.Router(),
    sequelize = require('../connection'),
    policy = require('./../models/policy.model'),
    async = require('async')

var policy_model = new policy;

class PolicyController{
    constructor(){

    }

    createPolicy(req, res){
        var days = JSON.parse(req.body.days);
        var dataPromise = new Promise(function(resolve, reject){
            var data = []
            for(var i in days){
                data.push({
                    role_id : req.body.role_id,
                    day : days[i].day,
                    checkin: days[i].checkin,
                    checkout: days[i].checkout,
                    status : 1,
                    created_date: new Date(),
                    updated_date : new Date()
                })
            }
            resolve(data)
        })
        dataPromise.then(function(data){
            policy_model.bulkCreate(data, function(result){
                if(!result.err){
                    let message = "Data policy baru berhasil ditambahkan!"
                    res.status(201).json({err: false, message: message, data: []});
                }
                else{
                    let message = "Data policy baru gagal ditambahkan!"
                    res.status(500).json({err: true, message: message, data: result.data});    
                }
            })
        })
    }

    getAllPolicies(res){
        policy_model.getAllActivePolicies(function(result){
            if(!result.err){
                let message = "Data policy berhasil diambil!"
                res.status(200).json({err: false, message: message, data: result.data});
            }
            else{
                let message = "Data policy gagal diambil!"
                res.status(500).json({err: true, message: message, data: result.data});    
            }
        })
    }

    updatePolicies(req, res){
        var days = JSON.parse(req.body.days);
        async.map(days, function(day, callback){
            policy_model.update(day, function(result){
                callback(false, result.data)
            })
        },function(err, result){
            var data = {
                err: false,
                message : 'Data policy berhasil diupdate!'
            }
            res.status(200).json(data)
        })
    }

    deletePolicies(req, res){
        var days = JSON.parse(req.body.days);
        async.map(days, function(day, callback){
            policy_model.delete(day.id, function(result){
                callback(false, result.data)
            })
        },function(err, result){
            var data = {
                err: false,
                message : 'Data policy berhasil dihapus!'
            }
            res.status(200).json(data)
        })
    }
}

module.exports = PolicyController;

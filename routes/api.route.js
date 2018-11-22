var express = require('express');
var router = express.Router();

var user = require('../controllers/user.controller');
var admin = require('../controllers/admin.controller');
var role = require('../controllers/role.controller');
var log = require('../controllers/log.controller');

const User = new user;
const Admin = new admin;
const Role = new role;
const Log = new log;

/* API for register new admin */
router.post('/admin/register', function(req, res, next) {
  Admin.register(req,res);
});

/* API for login admin */
router.post('/admin/login', function(req, res, next) {
  Admin.login(req,res);
});

/* API for create new role record */
router.get('/role/list', function(req, res, next) {
  Role.getAllRoles(req,res);
});

/* API for create new role record */
router.post('/role/create', function(req, res, next) {
  Role.create(req,res);
});

/* API for update role record */
router.post('/role/update', function(req, res, next) {
  Role.update(req,res);
});

/* API for delete role record */
router.post('/role/delete', function(req, res, next) {
  Role.delete(req,res);
});

router.post('/tap/check', function(req, res, next) {
  Log.tapRFID(req,res);
});

/* API for create new user record */
router.post('/user/create', function(req, res, next) {
  User.create(req,res);
});

/* API for update a user record depends on tanggal */
router.post('/user/update', function(req, res, next) {
  User.update(req,res);
});

router.post('/user/delete', function(req, res, next) {
  User.delete(req,res);
});

router.get('/logs/all', function(req, res, next){
  Log.showAll(res);
})

/* API for get all user records */
router.get('/user/all', function(req, res, next) {
  User.showAll(res);
});

/* API for get detail of a record depends on tanggal */
router.get('/show-detail/:tanggal', function(req, res, next) {
  User.showDetail(req,res);
});

module.exports = router;

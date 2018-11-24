var express = require('express');
var router = express.Router();

/* Router to index page */
router.get('/dashboard', function(req, res, next) {
  res.render('index', { title: 'Berat' });
});

/* Router to index page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Berat' });
});

/* Router to index page */
router.get('/', function(req, res, next) {
  res.render('none', { title: 'Berat' });
});

module.exports = router;

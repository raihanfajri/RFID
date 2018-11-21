var express = require('express');
var router = express.Router();

/* Router to index page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Berat' });
});

/* Router to create page */
router.get('/tambah', function(req, res, next) {
  res.render('Tambah', { title: 'Tambah/Edit Berat' });
});

/* Router to detail page */
router.get('/show-detail/:tanggal', function(req, res, next) {
  res.render('detail', { title: 'Detail Berat', tanggal : req.params.tanggal});
});

module.exports = router;
